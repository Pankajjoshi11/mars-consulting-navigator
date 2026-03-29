import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import projectDeliveryHero from "@/assets/ProjectDel.jpeg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const ProjectDelivery = () => {
  const steps = [
    { num: "01", title: "Discover & Analyse", desc: "Clarify objectives, constraints and stakeholder needs." },
    { num: "02", title: "Purpose Driven Solution", desc: "Select or design solutions that align to context and goals." },
    { num: "03", title: "Plan", desc: "Milestones, budget, resourcing and governance." },
    { num: "04", title: "Deliver", desc: "Focused execution with transparent reporting." },
    { num: "05", title: "Value Realisation & Hypercare", desc: "Adoption, stabilisation, and measurable outcomes." },
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
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 md:mb-16"
          >
            How We Work
          </motion.h2>
          <div className="mx-auto max-w-4xl">
            {steps.map((step, i) => {
              const isAccent = i % 2 === 1;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={`relative w-full max-w-[19.5rem] rounded-[1.35rem] px-5 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.14)] sm:max-w-[22rem] sm:px-6 sm:py-5 md:max-w-[34rem] md:rounded-2xl md:px-8 md:py-6 ${
                      isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className={`mb-2 text-xs font-semibold tracking-[0.28em] ${isAccent ? "text-white/65" : "text-white/55"}`}>
                      STEP {step.num}
                    </p>
                    <h3 className="text-lg font-bold uppercase leading-tight sm:text-xl md:text-2xl">
                      {step.title}
                    </h3>
                    <p className={`mt-2.5 max-w-xl text-sm leading-relaxed sm:mt-3 md:text-base ${isAccent ? "text-white/88" : "text-white/82"}`}>
                      {step.desc}
                    </p>
                    {i < steps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-full h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b-[3px] border-r-[3px] border-card sm:h-6 sm:w-6 sm:border-b-4 sm:border-r-4 ${
                          isAccent ? "bg-accent" : "bg-primary"
                        }`}
                      />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-8 w-2 sm:h-10 sm:w-3 ${isAccent ? "bg-accent" : "bg-primary"}`} />
                  )}
                </motion.div>
              );
            })}
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
