import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, TrendingDown, BarChart3, Download, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import offshoreHero from "@/assets/TalentPage.jpeg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

// 2026 Market Data (Updated Annual Base Salaries in USD based on Global Recruitment Guides)
const salaryData: Record<string, Record<string, number>> = {
  "Full-Stack Developer": { "Australia": 134000, "US": 147000, "Canada": 112000, "UAE": 98000, "New Zealand": 105000 },
  "Cybersecurity Analyst": { "Australia": 140000, "US": 155000, "Canada": 118000, "UAE": 105000, "New Zealand": 110000 },
  "Data Scientist": { "Australia": 138000, "US": 158000, "Canada": 120000, "UAE": 110000, "New Zealand": 108000 },
  "DevOps Engineer": { "Australia": 145000, "US": 162000, "Canada": 125000, "UAE": 108000, "New Zealand": 115000 },
  "QA / Tester": { "Australia": 95000, "US": 108000, "Canada": 88000, "UAE": 72000, "New Zealand": 80000 },
};

// Fixed Offshore Cost (Mars Consulting Premium Managed Resource Tier)
const OFFSHORE_ANNUAL_COST = 45000; 

const OffshoreResourcing = () => {
  const [serviceType, setServiceType] = useState("Full-Stack Developer");
  const [targetCountry, setTargetCountry] = useState("Australia");
  const [devs, setDevs] = useState(5);
  const [months, setMonths] = useState(12);
  const [showResults, setShowResults] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  // ROI Logic aligned with 2026 Economic Models
  const calculations = useMemo(() => {
    const baseSalary = salaryData[serviceType][targetCountry] || 100000;
    
    // 2026 "Fully Loaded" Multiplier: Includes 12% Superannuation + Payroll Tax + Overhead
    // High-cost markets (AU/US/NZ) typically hit 1.4x true cost
    const tcoFactor = (targetCountry === "Australia" || targetCountry === "US" || targetCountry === "New Zealand") ? 1.40 : 1.30; 
    
    const localMonthlyCost = (baseSalary * tcoFactor) / 12;
    const offshoreMonthlyCost = OFFSHORE_ANNUAL_COST / 12;

    const localTotal = localMonthlyCost * devs * months;
    const offshoreTotal = offshoreMonthlyCost * devs * months;
    const totalSavings = localTotal - offshoreTotal;
    const savingsPercent = Math.round((totalSavings / localTotal) * 100);

    return { localTotal, offshoreTotal, totalSavings, savingsPercent, baseSalary, tcoFactor };
  }, [serviceType, targetCountry, devs, months]);

  const chartData = [
    { name: 'Local (Fully Loaded)', value: Math.round(calculations.localTotal) },
    { name: 'Mars Offshore', value: Math.round(calculations.offshoreTotal) },
  ];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(30, 41, 59);
    pdf.text("Mars Consulting: ROI Analysis Report", 15, 20);
    
    pdf.setFontSize(12);
    pdf.text("Project Configuration:", 15, 35);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    
    const inputY = 42;
    const lineHeight = 7;
    pdf.text(`• Service Type: ${serviceType}`, 20, inputY);
    pdf.text(`• Target Market: ${targetCountry}`, 20, inputY + lineHeight);
    pdf.text(`• Team Size: ${devs} Resource(s)`, 20, inputY + (lineHeight * 2));
    pdf.text(`• Project Duration: ${months} Months`, 20, inputY + (lineHeight * 3));
    pdf.text(`• Local Load Factor: ${calculations.tcoFactor}x (Super/Tax/Overhead)`, 20, inputY + (lineHeight * 4));
    
    pdf.setDrawColor(226, 232, 240);
    pdf.line(15, 80, pdfWidth - 15, 80);
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text("Financial Breakdown & Cost Comparison:", 15, 90);
    
    pdf.addImage(imgData, "PNG", 5, 95, pdfWidth - 10, imgHeight);
    
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text("* Estimates based on 2026 recruitment benchmarks and mandatory statutory employer on-costs.", 15, pageHeight - 15);
    pdf.text("Generated via Mars Consulting Strategic ROI Tool.", 15, pageHeight - 10);
    
    pdf.save(`Mars_Consulting_ROI_${targetCountry}.pdf`);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
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
                Scale your team with 2026 market-aligned offshore specialists.
              </motion.h2>
              <motion.p variants={fadeInUp} className="max-w-2xl leading-relaxed text-white/80 md:text-lg">
                Access skilled Developers, Testers, and Data Analysts who integrate with
                your ways of working while delivering up to 70% cost efficiency.
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

      {/* ROI Calculator Section */}
      <section className="section-padding bg-white text-primary">
        <div className="container-mars">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Strategic Savings Calculator</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare "Fully Loaded" local hiring costs—including 2026 superannuation and payroll taxes—against our managed offshore model.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto"
          >
            {/* Inputs Panel */}
            <div className="lg:col-span-5 space-y-6 bg-secondary/50 p-8 rounded-3xl border border-border">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" /> Cost Modeling
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Role Type</label>
                  <select 
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer"
                  >
                    {Object.keys(salaryData).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Target Market</label>
                  <select 
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer"
                  >
                    {["Australia", "US", "Canada", "UAE", "New Zealand"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Team Size</label>
                    <input
                      type="number"
                      min={1}
                      value={devs}
                      onChange={(e) => setDevs(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Duration (Mo)</label>
                    <input
                      type="number"
                      min={1}
                      value={months}
                      onChange={(e) => setMonths(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Economic Context Box */}
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-accent shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-primary">2026 Economic Modeling</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Local costs include base salary plus a {calculations.tcoFactor}x "Fully Loaded" factor 
                    (12% Super, Payroll Tax, and Insurance) per 2026 Fair Work standards.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowResults(true)}
                className="w-full py-4 bg-accent text-accent-foreground rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Calculate ROI
              </button>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7 space-y-6">
              <div ref={reportRef} className="bg-white p-4 rounded-2xl">
                <div className="grid sm:grid-cols-3 gap-4 mb-6 text-center">
                  <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
                    <p className="text-muted-foreground text-[10px] font-bold uppercase mb-1">Local Loaded Cost</p>
                    <p className="text-lg font-bold text-primary">{showResults ? formatCurrency(calculations.localTotal) : "—"}</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <p className="text-red-500 text-[10px] font-bold uppercase mb-1">Offshore Cost</p>
                    <p className="text-lg font-bold text-red-600">{showResults ? formatCurrency(calculations.offshoreTotal) : "—"}</p>
                  </div>
                  <div className="bg-accent/10 p-5 rounded-2xl border border-accent/30">
                    <p className="text-accent text-[10px] font-bold uppercase mb-1">Net Savings ({calculations.savingsPercent}%)</p>
                    <p className="text-lg font-bold text-accent">{showResults ? formatCurrency(calculations.totalSavings) : "—"}</p>
                  </div>
                </div>

                <div className="bg-secondary/50 p-6 rounded-3xl border border-border h-[300px]">
                  {showResults ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          formatter={(value: number) => [formatCurrency(value), 'Total Cost']}
                        />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#1e293b' : '#ef4444'} /> 
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 text-center">
                       <TrendingDown className="w-12 h-12" />
                       <p className="text-sm font-medium italic">Enter project details to see your 2026 savings report</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                 <button 
                    disabled={!showResults}
                    onClick={downloadPDF}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-30"
                 >
                    <Download className="w-4 h-4" /> Export Savings Analysis (PDF)
                 </button>
                 
                 <p className="text-[10px] text-slate-400 italic leading-relaxed text-center max-w-lg">
                    "Estimates provided are based on 2026 median salary data from global recruitment benchmarks and mandatory statutory employer on-costs. Actual savings may vary based on specific tech stack requirements and chosen engagement model."
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OffshoreResourcing;