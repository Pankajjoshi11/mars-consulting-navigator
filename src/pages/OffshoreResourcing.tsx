import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, DollarSign, TrendingDown } from "lucide-react";
import offshoreHero from "@/assets/offshore-hero.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const OffshoreResourcing = () => {
  const [devs, setDevs] = useState(5);
  const [salary, setSalary] = useState(100000);
  const [months, setMonths] = useState(12);
  const [showResults, setShowResults] = useState(false);

  const localCost = devs * salary * (months / 12);
  const offshoreCost = localCost * 0.4;
  const savings = localCost - offshoreCost;
  const savingsPercent = Math.round((savings / localCost) * 100);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-card" />
          <div className="relative">
            <img src={offshoreHero} alt="Offshore team collaboration" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/40" />
          </div>
        </div>
        <div className="relative z-10 container-mars px-6 lg:px-20 w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl">
            <motion.p variants={fadeInUp} className="text-muted-foreground text-sm font-semibold tracking-widest uppercase mb-2">
              Services
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Offshore Resourcing
            </motion.h1>
            <motion.h2 variants={fadeInUp} className="text-xl text-foreground/80 mb-6 font-medium leading-relaxed">
              Scale your team with contract‑based offshore specialists.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed">
              Access skilled Developers, Testers, Data Analysts and PMO/Project Admin resources who integrate with
              your ways of working — contracted for the life of your project.
            </motion.p>
          </motion.div>
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
              "Delivery alignment.",
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
              "PMO Support and Project Administration",
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

      {/* ROI Calculator */}
      <section className="section-padding bg-primary">
        <div className="container-mars">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-primary-foreground text-center mb-4">
            ROI Calculator
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-primary-foreground/70 text-center mb-12">
            Calculate your potential cost savings with strategic offshore resourcing
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* Inputs */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary-foreground">Project Details</h3>
              <div>
                <label className="block text-sm text-primary-foreground/70 mb-2">Number of Developers</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={devs}
                  onChange={(e) => setDevs(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground focus:ring-2 focus:ring-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-primary-foreground/70 mb-2">Average Local Salary (USD/year)</label>
                <input
                  type="number"
                  min={1000}
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground focus:ring-2 focus:ring-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-primary-foreground/70 mb-2">Project Duration (months)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground focus:ring-2 focus:ring-accent focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowResults(true)}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Calculate Savings
              </button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary-foreground">Your Potential Savings</h3>
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-1">
                  <DollarSign className="w-4 h-4" /> Local Cost
                </div>
                <p className="text-2xl font-bold text-primary-foreground">{showResults ? formatCurrency(localCost) : "—"}</p>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-1">
                  <DollarSign className="w-4 h-4" /> Offshore Cost
                </div>
                <p className="text-2xl font-bold text-primary-foreground">{showResults ? formatCurrency(offshoreCost) : "—"}</p>
              </div>
              <div className="bg-accent/20 border border-accent/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-1">
                  <TrendingDown className="w-4 h-4" /> Total Savings
                </div>
                <p className="text-2xl font-bold text-primary-foreground">{showResults ? formatCurrency(savings) : "—"}</p>
                {showResults && <p className="text-sm text-primary-foreground/60 mt-1">{savingsPercent}% cost reduction</p>}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OffshoreResourcing;
