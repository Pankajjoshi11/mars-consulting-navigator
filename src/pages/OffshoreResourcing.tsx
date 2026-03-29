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

// 2026 Market Data (Annual Base Salaries in USD)
const salaryData: Record<string, Record<string, number>> = {
  "Full-Stack Developer": { "Australia": 128000, "US": 147000, "Canada": 112000, "UAE": 98000, "New Zealand": 105000 },
  "Cybersecurity Analyst": { "Australia": 135000, "US": 152000, "Canada": 118000, "UAE": 105000, "New Zealand": 110000 },
  "Data Scientist": { "Australia": 132000, "US": 155000, "Canada": 120000, "UAE": 110000, "New Zealand": 108000 },
  "DevOps Engineer": { "Australia": 142000, "US": 158000, "Canada": 125000, "UAE": 108000, "New Zealand": 115000 },
  "QA / Tester": { "Australia": 92000, "US": 105000, "Canada": 88000, "UAE": 72000, "New Zealand": 80000 },
};

// Fixed Offshore Cost (Mars Consulting Premium Tier)
const OFFSHORE_ANNUAL_COST = 45000; 

const OffshoreResourcing = () => {
  // Calculator State
  const [serviceType, setServiceType] = useState("Full-Stack Developer");
  const [targetCountry, setTargetCountry] = useState("Australia");
  const [devs, setDevs] = useState(5);
  const [months, setMonths] = useState(12);
  const [showResults, setShowResults] = useState(false);
  
  // Reference for PDF Capture
  const reportRef = useRef<HTMLDivElement>(null);

  // ROI Logic
  const calculations = useMemo(() => {
    const baseSalary = salaryData[serviceType][targetCountry] || 100000;
    const tcoFactor = targetCountry === "Australia" ? 1.22 : 1.18; 
    
    const localMonthlyCost = (baseSalary * tcoFactor) / 12;
    const offshoreMonthlyCost = OFFSHORE_ANNUAL_COST / 12;

    const localTotal = localMonthlyCost * devs * months;
    const offshoreTotal = offshoreMonthlyCost * devs * months;
    const totalSavings = localTotal - offshoreTotal;
    const savingsPercent = Math.round((totalSavings / localTotal) * 100);

    return { localTotal, offshoreTotal, totalSavings, savingsPercent, baseSalary };
  }, [serviceType, targetCountry, devs, months]);

  const chartData = [
    { name: 'Local Cost', value: Math.round(calculations.localTotal) },
    { name: 'Offshore Cost', value: Math.round(calculations.offshoreTotal) },
  ];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  // PDF Download Function
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    // Capture the visual chart area
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // 1. Header & Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(30, 41, 59); // Dark Slate
    pdf.text("Mars Consulting: ROI Analysis Report", 15, 20);
    
    // 2. Project Configuration Section (The Inputs)
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Project Configuration:", 15, 35);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139); // Muted Slate
    
    const inputY = 42;
    const lineHeight = 7;
    
    pdf.text(`• Service Type: ${serviceType}`, 20, inputY);
    pdf.text(`• Target Market: ${targetCountry}`, 20, inputY + lineHeight);
    pdf.text(`• Team Size: ${devs} Resource(s)`, 20, inputY + (lineHeight * 2));
    pdf.text(`• Project Duration: ${months} Months`, 20, inputY + (lineHeight * 3));
    
    // 3. Horizontal Line Separator
    pdf.setDrawColor(226, 232, 240);
    pdf.line(15, 75, pdfWidth - 15, 75);
    
    // 4. Financial Visuals (The Chart and Cards)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text("Financial Breakdown & Cost Comparison:", 15, 85);
    
    // Adding the captured screenshot of the results
    pdf.addImage(imgData, "PNG", 5, 90, pdfWidth - 10, imgHeight);
    
    // 5. Footer / Disclaimer
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("* This report is an estimate based on average 2026 market rates and TCO factors.", 15, pageHeight - 15);
    pdf.text("Generated via Mars Consulting ROI Tool.", 15, pageHeight - 10);
    
    // Save the file
    pdf.save(`Mars_Consulting_ROI_${targetCountry}.pdf`);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <img
          src={offshoreHero}
          alt="Offshore team collaboration"
          className="absolute inset-0 h-full w-full object-cover object-[60%_center] md:object-[58%_center] lg:object-[56%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/88 via-primary/65 to-primary/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[72vh] items-center px-6 py-12 md:px-12 lg:px-16 lg:py-16">
          <div className="w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl rounded-[1.75rem] border border-white/12 bg-primary/35 p-8 shadow-2xl backdrop-blur-sm md:p-10 lg:ml-0"
            >
              <motion.p variants={fadeInUp} className="mb-4 text-sm font-semibold tracking-[0.3em] uppercase text-white/75">
                Services
              </motion.p>
              <motion.h1 variants={fadeInUp} className="mb-4 text-4xl font-bold leading-tight text-white md:text-6xl">
                Offshore Resourcing
              </motion.h1>
              <motion.h2 variants={fadeInUp} className="mb-6 max-w-2xl text-xl font-medium leading-relaxed text-white/90 md:text-2xl">
                Scale your team with contract-based offshore specialists.
              </motion.h2>
              <motion.p variants={fadeInUp} className="max-w-2xl leading-relaxed text-white/80 md:text-lg">
                Access skilled Developers, Testers, Data Analysts and PMO/Project Admin resources who integrate with
                your ways of working — contracted for the life of your project.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Contract-based specialists",
                  "Faster team scale-up",
                  "Aligned to your delivery rhythm",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/12">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-white/90">{item}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-padding bg-secondary">
        <div className="container-mars">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            What You Get
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              "Right skills, right time.",
              "Cost transparency with clear contractual engagement terms.",
              "Delivery alignment."
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <p className="text-foreground font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="section-padding bg-card">
        <div className="container-mars text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Roles We Commonly Provide
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              "Technical Development and Testing",
              "Business Analysis",
              "Data Analysis",
              "PMO Support and Project Administration"
            ].map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-primary rounded-2xl p-6 text-primary-foreground"
              >
                <p className="font-semibold">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section (Inverted: White BG) */}
      <section className="section-padding bg-white text-primary">
        <div className="container-mars">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">
            ROI Calculator
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-muted-foreground text-center mb-12">
            Compare local hiring costs vs. strategic offshore resourcing in real-time
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto"
          >
            {/* Inputs Panel (Left) */}
            <div className="lg:col-span-5 space-y-6 bg-secondary/50 p-8 rounded-3xl border border-border">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" /> Project Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Service Type</label>
                  <select 
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl text-primary focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer"
                  >
                    {Object.keys(salaryData).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Comparison Country</label>
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
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Duration (Months)</label>
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

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-accent shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Local estimates include 2026 base salary of {formatCurrency(calculations.baseSalary)} plus Super/Taxes.
                </p>
              </div>

              <button 
                onClick={() => setShowResults(true)}
                className="w-full py-4 bg-accent text-accent-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Calculate Savings
              </button>
            </div>

            {/* Results & Visuals (Right) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Capture this Ref for PDF */}
              <div ref={reportRef} className="bg-white p-4 rounded-2xl">
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
                    <p className="text-muted-foreground text-[10px] font-bold uppercase mb-1">Local Cost</p>
                    <p className="text-lg font-bold text-primary">{showResults ? formatCurrency(calculations.localTotal) : "—"}</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <p className="text-red-500 text-[10px] font-bold uppercase mb-1">Offshore Cost</p>
                    <p className="text-lg font-bold text-red-600">{showResults ? formatCurrency(calculations.offshoreTotal) : "—"}</p>
                  </div>
                  <div className="bg-accent/10 p-5 rounded-2xl border border-accent/30">
                    <p className="text-accent text-[10px] font-bold uppercase mb-1">Total Savings</p>
                    <p className="text-lg font-bold text-accent">{showResults ? formatCurrency(calculations.totalSavings) : "—"}</p>
                  </div>
                </div>

                {/* Chart Visualization */}
                <div className="bg-secondary/50 p-6 rounded-3xl border border-border h-[280px]">
                  {showResults ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }}
                          formatter={(value: number) => [formatCurrency(value), 'Cost']}
                        />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#1e293b' : '#ef4444'} /> 
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 text-center">
                       <TrendingDown className="w-12 h-12" />
                       <p className="text-sm font-medium">Click "Calculate Savings" to view analysis</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                 <button 
                    disabled={!showResults}
                    onClick={downloadPDF}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    <Download className="w-4 h-4" /> Download Report (PDF)
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OffshoreResourcing;
