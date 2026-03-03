import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Lightbulb, Target, CalendarCheck, Rocket, ShieldCheck } from "lucide-react";
import projectDeliveryHero from "@/assets/project-delivery-hero.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const ProjectDelivery = () => {
  const steps = [
    { num: "01", title: "Discover & Analyse", desc: "Clarify objectives, constraints, and stakeholder needs.", icon: Lightbulb },
    { num: "02", title: "Purpose Driven Solution", desc: "Select or design solutions that align to context and goals.", icon: Target },
    { num: "03", title: "Plan", desc: "Milestones, budget, resourcing, and risk/governance.", icon: CalendarCheck },
    { num: "04", title: "Deliver", desc: "Focused execution with transparent reporting.", icon: Rocket },
    { num: "05", title: "Value Realisation & Hypercare", desc: "Adoption, stabilisation, and measurable outcomes.", icon: ShieldCheck },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="relative min-h-[70vh] flex items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${projectDeliveryHero})` }}
      >
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 container-mars px-6 lg:px-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.p variants={fadeInUp} className="text-accent-foreground/80 text-sm font-semibold tracking-widest uppercase mb-2 text-primary-foreground/60">
              Services
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Project Delivery Services
            </motion.h1>
            <motion.h2 variants={fadeInUp} className="text-xl md:text-2xl text-primary-foreground/80 mb-6 font-medium">
              Deliver the right outcomes, on time and on budget.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-primary-foreground/70 leading-relaxed">
              We start by understanding your business landscape and operating environment, then define a fit‑for‑purpose
              solution. From there, we map milestones, budget and resources, execute with focus, and provide hypercare to
              ensure value is realised — not just delivered.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How We Work */}
      <section className="section-padding bg-card">
        <div className="container-mars">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16"
          >
            How We Work
          </motion.h2>

          {/* Mobile: vertical snake timeline */}
          <div className="md:hidden space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative flex items-center gap-4 py-4"
                >
                  {i < steps.length - 1 && (
                    <div className="absolute left-5 top-14 bottom-0 w-0 border-l-2 border-dotted border-accent/40" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs shrink-0 z-10">
                    {step.num}
                  </div>
                  <div className="bg-primary rounded-2xl p-4 flex-1 flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-primary-foreground mb-1">{step.title}</h3>
                      <p className="text-primary-foreground/70 text-xs">{step.desc}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: curved arc timeline inspired by reference */}
          <div className="hidden md:flex items-center gap-8">
            {/* Left: Semi-circle arc with label */}
            <div className="relative w-44 shrink-0 self-stretch flex items-center justify-center" style={{ minHeight: 420 }}>
              <svg viewBox="0 0 140 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 130 30 C 40 30, 10 120, 10 210 C 10 300, 40 390, 130 390"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  opacity="0.45"
                />
              </svg>
              <div className="text-center z-10">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Our</p>
                <p className="text-xl font-bold text-foreground">Process</p>
              </div>
            </div>

            {/* Right: stacked step cards */}
            <div className="flex-1 space-y-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`flex items-center gap-4 ${isEven ? '' : 'ml-16'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-lg z-10">
                      {step.num}
                    </div>
                    <div className="bg-primary rounded-2xl px-6 py-4 flex items-center gap-4 flex-1 max-w-lg shadow-md">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-primary-foreground mb-1">{step.title}</h3>
                        <p className="text-primary-foreground/70 text-sm">{step.desc}</p>
                      </div>
                      <div className="w-11 h-11 rounded-full bg-card flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-padding bg-secondary">
        <div className="container-mars text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground mb-12"
          >
            Capabilities
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {[
              "Project & Program Management",
              "Change Management (reduce resistance, drive adoption)",
            ].map((cap, i) => (
              <motion.div
                key={cap}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 flex items-center gap-4"
              >
                <CheckCircle className="w-6 h-6 text-accent shrink-0" />
                <p className="text-foreground font-medium text-left">{cap}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Discuss Your Delivery Challenge <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDelivery;
