import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, TrendingDown, BarChart3, Info, RefreshCw, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import offshoreHero from "@/assets/TalentPage.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO CONNECT YOUR GOOGLE SHEET:
//
// 1. Open your Google Sheet containing the pricing data.
// 2. Go to File → Share → Publish to web.
// 3. In the "Link" tab, choose the correct sheet tab and select "Comma-separated
//    values (.csv)" as the format, then click "Publish".
// 4. Copy the URL (looks like:
//    https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=GID_NUMBER)
// 5. Paste it below as GOOGLE_SHEET_CSV_URL.
//
// The sheet must follow this exact column order (matching your current Excel):
//   Column A: ignored (Day Rate / Yearly labels)
//   Column B: Role name  (e.g. "Full-Stack Developer")
//   Column C: Local cost (AUD for AU section, NZD for NZ section) — annual
//   Column D: Offshore (India) cost — annual in same currency
//   Column E: % Savings (ignored, recalculated in-app)
//
// Row markers the parser looks for (case-insensitive, trimmed):
//   "Annual Cost Calculator" → start of AU annual block
//   "Current New Zealand Rate" (yearly section) → start of NZ annual block
//   Blank rows → end of a block
//
// The component will auto-refresh every REFRESH_INTERVAL_MS milliseconds.
// Set to 0 to disable auto-refresh.
// ─────────────────────────────────────────────────────────────────────────────

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCz568hLpwuPRIUmk6i9ZEUTYD7g_Z0nWRGL_0Xt1n5WmXVdqZM8WXLU27mqNtWA/pub?gid=446296133&single=true&output=csv";

const REFRESH_INTERVAL_MS = 1 * 60 * 1000; // 1 minute (set back to 5 * 60 * 1000 in production)

// Fallback static data (used if fetch fails)
const FALLBACK_DATA: SheetData = {
  Australia: {
    "Full-Stack Developer": { localAnnual: 252000, offshoreAnnual: 87600 },
    "Cyber Security Analyst": { localAnnual: 228000, offshoreAnnual: 76800 },
    "Data Scientist": { localAnnual: 264000, offshoreAnnual: 104400 },
    "DevOps Engineer": { localAnnual: 264000, offshoreAnnual: 111600 },
    "QA / Tester": { localAnnual: 216000, offshoreAnnual: 62400 },
  },
  "New Zealand": {
    "Full-Stack Developer": { localAnnual: 228000, offshoreAnnual: 105600 },
    "Cyber Security Analyst": { localAnnual: 240000, offshoreAnnual: 92400 },
    "Data Scientist": { localAnnual: 264000, offshoreAnnual: 127200 },
    "DevOps Engineer": { localAnnual: 276000, offshoreAnnual: 134400 },
    "QA / Tester": { localAnnual: 204000, offshoreAnnual: 75600 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface RoleRates {
  localAnnual: number;
  offshoreAnnual: number;
}

interface CountryData {
  [role: string]: RoleRates;
}

interface SheetData {
  Australia: CountryData;
  "New Zealand": CountryData;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV PARSER
// Reads the published Google Sheet CSV and maps it to SheetData.
// ─────────────────────────────────────────────────────────────────────────────

function parseSheetCSV(csv: string): { data: SheetData; warnings: string[] } {
  const rows = csv.split("\n").map((r) => {
    const result: string[] = [];
    let cur = "";
    let inQuote = false;
    for (const ch of r) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { result.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    result.push(cur.trim());
    return result;
  });

  console.log("[parseSheetCSV] total rows:", rows.length);

  const result: SheetData = { Australia: {}, "New Zealand": {} };
  let currentCountry: keyof SheetData | null = null;
  let nzHeaderCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    // Guard against empty rows completely
    if (!row || row.length < 4) continue;

    const col0 = (row[0] ?? "").trim();  // "Day Rate" / "Yearly" / ""
    const col1 = (row[1] ?? "").trim();  // role name or section header
    const col2 = (row[2] ?? "").trim();  // local annual cost
    const col3 = (row[3] ?? "").trim();  // offshore annual cost
    const col1Lower = col1.toLowerCase();

    // Detect AU yearly block
    if (col1Lower.includes("annual cost calculator")) {
      currentCountry = "Australia";
      continue;
    }

    // Detect NZ headers
    if (col1Lower.includes("new zealand rate") || col1Lower.includes("current new zealand")) {
      nzHeaderCount++;
      if (nzHeaderCount >= 2) {
        currentCountry = "New Zealand";
      } else {
        currentCountry = null;
      }
      continue;
    }

    // Skip header labels or rows where column 0 has text
    if (col0 && col0 !== "") continue;
    if (!currentCountry) continue;
    if (!col1 || !col2 || !col3) continue;

    // CRITICAL FIX: If col1 contains currency symbols, it's a shifted row, not a role name
    if (col1.includes("$") || col1Lower.includes("local") || col1Lower.includes("offshore")) {
      continue;
    }

    const local = parseFloat(col2.replace(/[^0-9.]/g, ""));
    const offshore = parseFloat(col3.replace(/[^0-9.]/g, ""));

    if (isNaN(local) || isNaN(offshore)) continue;

    // Skip day-rate rows safely
    if (local < 5000) {
      continue;
    }

    // Assign clean parsed values
    result[currentCountry][col1] = { localAnnual: local, offshoreAnnual: offshore };
  }

  // Warning check validation
  const warnings: string[] = [];
  const ANNUAL_THRESHOLD = 10000;

  for (const country of ["Australia", "New Zealand"] as const) {
    if (Object.keys(result[country]).length === 0) {
      warnings.push(`${country}: no roles parsed — check sheet structure`);
      result[country] = FALLBACK_DATA[country];
      continue;
    }
    for (const [role, rates] of Object.entries(result[country])) {
      if (rates.localAnnual < ANNUAL_THRESHOLD) {
        warnings.push(`${country} › ${role}: local annual $${rates.localAnnual} looks like a day rate`);
        result[country][role] = FALLBACK_DATA[country][role] ?? rates;
      }
      if (rates.offshoreAnnual < ANNUAL_THRESHOLD) {
        warnings.push(`${country} › ${role}: offshore annual $${rates.offshoreAnnual} looks like a day rate`);
        result[country][role] = FALLBACK_DATA[country][role] ?? rates;
      }
    }
  }

  return { data: result, warnings };
}
// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

// ─────────────────────────────────────────────────────────────────────────────
// CURRENCY LABELS — local currency per country
// ─────────────────────────────────────────────────────────────────────────────

const CURRENCY_LABEL: Record<string, string> = {
  Australia: "AUD",
  "New Zealand": "NZD",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const OffshoreResourcing = () => {
  // ── Sheet data state ──────────────────────────────────────────────────────
  const [sheetData, setSheetData] = useState<SheetData>(FALLBACK_DATA);
  const [dataStatus, setDataStatus] = useState<"loading" | "live" | "fallback" | "sheet-error">("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const fetchSheetData = async () => {
    try {
      console.log("[FETCH] attempting to fetch:", GOOGLE_SHEET_CSV_URL);
      let res: Response;
      try {
        res = await fetch(GOOGLE_SHEET_CSV_URL, { cache: "no-store" });
      } catch (networkErr) {
        console.error("[FETCH] Network/CORS error — fetch itself failed:", networkErr);
        throw networkErr;
      }
      console.log("[FETCH] response status:", res.status, res.statusText);
      console.log("[FETCH] response type:", res.type);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const csv = await res.text();
      console.log("[RAW CSV] total length:", csv.length);
      console.log("[RAW CSV] first 800 chars:", csv.slice(0, 800));
      const { data: parsed, warnings } = parseSheetCSV(csv);

      setSheetData(parsed);
      setLastUpdated(new Date());

      if (warnings.length > 0) {
        // CSV fetched but some values look wrong (e.g. $2,000 where $252,000 expected)
        setDataStatus("sheet-error");
        setSheetError(warnings.join(" | "));
        console.error("[OffshoreResourcing] Sheet data warnings:", warnings);
      } else {
        setDataStatus("live");
        setSheetError(null);
      }
    } catch {
      setSheetData(FALLBACK_DATA);
      setDataStatus("fallback");
      setSheetError("Could not reach Google Sheet — using cached rates.");
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchSheetData();
    if (REFRESH_INTERVAL_MS > 0) {
      const interval = setInterval(fetchSheetData, REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, []);

  // ── Calculator state ──────────────────────────────────────────────────────
  const [targetCountry, setTargetCountry] = useState<keyof SheetData>("Australia");
  const [serviceType, setServiceType] = useState("");
  const [devs, setDevs] = useState<string>("");
  const [months, setMonths] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Reset role when country changes
  useEffect(() => {
    setServiceType("");
    setShowResults(false);
  }, [targetCountry]);

  const availableRoles = Object.keys(sheetData[targetCountry]);
  const currency = CURRENCY_LABEL[targetCountry];

  // ── Calculations ──────────────────────────────────────────────────────────
  const calculations = useMemo(() => {
    const role = serviceType;
    const rates = role && sheetData[targetCountry][role]
      ? sheetData[targetCountry][role]
      : { localAnnual: 0, offshoreAnnual: 0 };

    // Parse inputs — guard against empty strings
    const n = devs === "" ? 0 : parseInt(devs, 10);
    const m = months === "" ? 0 : parseInt(months, 10);

    const localMonthly = rates.localAnnual / 12;
    const offshoreMonthly = rates.offshoreAnnual / 12;

    const localTotal = localMonthly * n * m;
    const offshoreTotal = offshoreMonthly * n * m;
    const totalSavings = localTotal - offshoreTotal;
    const savingsPercent = localTotal > 0 ? Math.round((totalSavings / localTotal) * 100) : 0;

    // ── DEBUG LOG — visible in browser console (F12 → Console) ──────────────
    console.group("🧮 Savings Calculator — debug");
    console.log("dataStatus       :", dataStatus);
    console.log("targetCountry    :", targetCountry);
    console.log("serviceType      :", role || "(none selected)");
    console.log("devs input (raw) :", devs, "→ parsed:", n);
    console.log("months input (raw):", months, "→ parsed:", m);
    console.log("rates from data  :", rates);
    console.log("localMonthly     :", localMonthly);
    console.log("offshoreMonthly  :", offshoreMonthly);
    console.log("localTotal       :", localTotal);
    console.log("offshoreTotal    :", offshoreTotal);
    console.log("totalSavings     :", totalSavings);
    console.log("savingsPercent   :", savingsPercent);
    console.log("full sheetData   :", JSON.parse(JSON.stringify(sheetData)));
    console.groupEnd();
    // ─────────────────────────────────────────────────────────────────────────

    return { localTotal, offshoreTotal, totalSavings, savingsPercent, rates, debugN: n, debugM: m };
  }, [serviceType, targetCountry, devs, months, sheetData, dataStatus]);

  const chartData = [
    { name: "Local Cost", value: Math.round(calculations.localTotal) },
    { name: "Mars Offshore", value: Math.round(calculations.offshoreTotal) },
  ];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency === "NZD" ? "NZD" : "AUD",
      maximumFractionDigits: 0,
    }).format(n);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="pt-16">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <img
          src={offshoreHero}
          alt="Offshore team collaboration"
          className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/88 via-primary/65 to-primary/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[72vh] items-center px-6 py-12 md:px-12 lg:px-16 lg:py-16">
          <div className="w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl rounded-[1.75rem] border border-white/12 bg-primary/35 p-8 shadow-2xl backdrop-blur-sm md:p-10"
            >
              <motion.p variants={fadeInUp} className="mb-4 text-sm font-semibold tracking-[0.3em] uppercase text-white/75">
                Services
              </motion.p>
              <motion.h1 variants={fadeInUp} className="mb-4 text-4xl font-bold leading-tight text-white md:text-6xl">
                Offshore Resourcing
              </motion.h1>
              <motion.h2 variants={fadeInUp} className="mb-6 max-w-2xl text-xl font-medium leading-relaxed text-white/90 md:text-2xl">
                Scale your team with market-aligned offshore specialists.
              </motion.h2>
              <motion.p variants={fadeInUp} className="max-w-2xl leading-relaxed text-white/80 md:text-lg">
                Access skilled Developers, Testers, and Data Analysts who integrate with
                your ways of working while delivering significant cost efficiency.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Contract-based specialists", "Faster team scale-up", "Aligned to delivery rhythm"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-center">
                    <CheckCircle className="h-4 w-4 text-white mx-auto mb-2" />
                    <p className="text-xs font-medium leading-relaxed text-white/90">{item}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Calculator Section ────────────────────────────────────────────── */}
      <section className="section-padding bg-white text-primary">
        <div className="container-mars">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Savings Calculator</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get a comparison of local and off-shore resourcing costs to analyse your potential savings.
            </p>

            {/* Live data status badge */}
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border text-xs font-medium
              bg-secondary/50 border-border text-muted-foreground">
              {dataStatus === "loading" && (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Loading live rates…
                </>
              )}
              {dataStatus === "live" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Live rates · updated {lastUpdated?.toLocaleTimeString()}
                  <button onClick={fetchSheetData} className="ml-1 hover:text-primary transition-colors" title="Refresh">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </>
              )}
              {dataStatus === "fallback" && (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  Using cached rates — live sheet unavailable
                </>
              )}
              {dataStatus === "sheet-error" && (
                <>
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-red-500 font-semibold">Sheet data error — showing last valid rates</span>
                  <button onClick={fetchSheetData} className="ml-1 hover:text-primary transition-colors" title="Refresh">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Sheet Error Banner */}
          {dataStatus === "sheet-error" && sheetError && (
            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex gap-3 items-start bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700 mb-1">Invalid value detected in Google Sheet</p>
                  <p className="text-xs text-red-600 leading-relaxed font-mono">{sheetError}</p>
                  <p className="text-xs text-red-500 mt-2">
                    Showing last valid rates. Fix the value in the sheet and click the refresh button.
                  </p>
                </div>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto"
          >
            {/* ── Inputs Panel ──────────────────────────────────────────── */}
            <div className="lg:col-span-5 self-start space-y-6 bg-secondary/50 p-8 rounded-3xl border border-border">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" /> Cost Modelling
              </h3>

              <div className="space-y-4">
                {/* Country toggle */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                    Target Market
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Australia", "New Zealand"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setTargetCountry(c)}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all border
                          ${targetCountry === c
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-primary border-border hover:border-primary/40"
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role select */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                    Role Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => { setServiceType(e.target.value); setShowResults(false); }}
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent outline-none cursor-pointer"
                  >
                    <option value="">Select a role…</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Team size + duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Team Size</label>
                    <input
                      type="number"
                      min={1}
                      value={devs}
                      onChange={(e) => { setDevs(e.target.value); setShowResults(false); }}
                      placeholder="e.g. 3"
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Duration (Mo)</label>
                    <input
                      type="number"
                      min={1}
                      value={months}
                      onChange={(e) => { setMonths(e.target.value); setShowResults(false); }}
                      placeholder="e.g. 12"
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                </div>

                {/* Rate preview */}
                {serviceType && (
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex gap-3">
                    <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div className="space-y-1 text-[11px] text-muted-foreground leading-relaxed">
                      <p className="text-xs font-bold text-primary">Live Rate Preview — {currency}</p>
                      <p>Local annual: <span className="font-semibold text-primary">{formatCurrency(calculations.rates.localAnnual)}</span></p>
                      <p>Offshore annual: <span className="font-semibold text-primary">{formatCurrency(calculations.rates.offshoreAnnual)}</span></p>
                    </div>
                  </div>
                )}
              </div>

              <button
                disabled={!serviceType || !devs || !months}
                onClick={() => setShowResults(true)}
                className="w-full py-4 bg-accent text-accent-foreground rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Calculate Savings
              </button>
            </div>

            {/* ── Results Panel ──────────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-4 rounded-2xl">
                {/* KPI cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6 text-center">
                  <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
                    <p className="text-muted-foreground text-[10px] font-bold uppercase mb-1">Local Loaded Cost</p>
                    <p className="text-lg font-bold text-primary">
                      {showResults ? formatCurrency(calculations.localTotal) : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{currency}</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <p className="text-red-500 text-[10px] font-bold uppercase mb-1">Offshore Cost</p>
                    <p className="text-lg font-bold text-red-600">
                      {showResults ? formatCurrency(calculations.offshoreTotal) : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{currency}</p>
                  </div>
                  <div className="bg-accent/10 p-5 rounded-2xl border border-accent/30">
                    <p className="text-accent text-[10px] font-bold uppercase mb-1">
                      Net Savings ({showResults ? calculations.savingsPercent : 0}%)
                    </p>
                    <p className="text-lg font-bold text-accent">
                      {showResults ? formatCurrency(calculations.totalSavings) : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{currency}</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-secondary/50 p-6 rounded-3xl border border-border h-[300px]">
                  {showResults ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                          formatter={(value: number) => [formatCurrency(value), "Total Cost"]}
                        />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? "#1e293b" : "#ef4444"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 text-center">
                      <TrendingDown className="w-12 h-12" />
                      <p className="text-sm font-medium italic">
                        Select a role, team size and duration to see your savings report
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>

          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-white p-5 text-left text-[11px] leading-relaxed text-slate-600 shadow-sm">
            <p className="font-semibold text-primary">By using this tool, you acknowledge:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                The figures provided by this calculator are for indicative purposes only and actual costs or savings may vary.
              </li>
              <li>
                All are calculated at an average salaries in respective countries based on mid-level technical experience.
              </li>
              <li>
                The rates provided may differ across industries, locations, and market conditions.
              </li>
              <li>
                Local cost estimates are based on contract-based resource rates and include statutory obligations such as Leave
                Loading, Australian/New Zealand Superannuation, and KiwiSaver contributions, where applicable.
              </li>
              <li>
                All costs are calculated in AUD or NZD and translated using standard exchange rate assumptions, which may fluctuate.
              </li>
            </ul>
            <p className="mt-4">
              Note: This tool is intended for informational purposes only and does not constitute a formal quotation. Final pricing
              will be determined based on specific project requirements and engagement terms.
            </p>
          </div>
        </div>

        {/* ── On-screen Debug Panel (remove before production) ─────────────── */}
        {/* <div className="max-w-6xl mx-auto mt-8">
          <button
            onClick={() => setShowDebug((v) => !v)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-primary transition-colors"
          >
            {showDebug ? "▲ Hide" : "▼ Show"} debug info
          </button>

          {showDebug && (
            <div className="mt-3 bg-slate-900 text-green-400 font-mono text-[11px] rounded-2xl p-5 space-y-1 leading-relaxed overflow-x-auto">
              <p className="text-slate-400 mb-2">// Calculator state — also check browser console (F12) for full logs</p>
              <p><span className="text-slate-500">dataStatus       </span> {dataStatus}</p>
              <p><span className="text-slate-500">targetCountry    </span> {targetCountry}</p>
              <p><span className="text-slate-500">serviceType      </span> {serviceType || "(none)"}</p>
              <p><span className="text-slate-500">devs (raw)       </span> "{devs}" → parsed: {devs === "" ? 0 : parseInt(devs, 10)}</p>
              <p><span className="text-slate-500">months (raw)     </span> "{months}" → parsed: {months === "" ? 0 : parseInt(months, 10)}</p>
              <p className="pt-1"><span className="text-slate-500">rates.localAnnual   </span> {calculations.rates.localAnnual}</p>
              <p><span className="text-slate-500">rates.offshoreAnnual</span> {calculations.rates.offshoreAnnual}</p>
              <p className="pt-1"><span className="text-slate-500">localTotal      </span> {calculations.localTotal}</p>
              <p><span className="text-slate-500">offshoreTotal   </span> {calculations.offshoreTotal}</p>
              <p><span className="text-slate-500">totalSavings    </span> {calculations.totalSavings}</p>
              <p><span className="text-slate-500">savingsPercent  </span> {calculations.savingsPercent}%</p>
              <p className="pt-1 text-slate-400">// Available roles for {targetCountry}:</p>
              {availableRoles.map((r) => (
                <p key={r}>
                  <span className="text-slate-500">  {r}  </span>
                  local={sheetData[targetCountry][r].localAnnual}  offshore={sheetData[targetCountry][r].offshoreAnnual}
                </p>
              ))}
            </div>
          )}
        </div> */}
        {/* ─────────────────────────────────────────────────────────────────── */}

      </section>
    </div>
  );
};

export default OffshoreResourcing;
