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
    { num: "01", title: "Discover & Analyse", desc: "Clarify objectives, constraints and stakeholder needs.", icon: Lightbulb },
    { num: "02", title: "Purpose Driven Solution", desc: "Select or design solutions that align to context and goals.", icon: Target },
    { num: "03", title: "Plan", desc: "Milestones, budget, resourcing and governance", icon: CalendarCheck },
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

          {/* Mobile: vertical snake timeline (like reference image 2) */}
          <div className="md:hidden flex flex-col items-center">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;
              return (
                <div key={step.num} className="relative flex flex-col items-center">
                  {/* Dotted connector from previous */}
                  {i > 0 && (
                    <div className="w-0 h-8 border-l-2 border-dotted border-muted-foreground/30" />
                  )}
                  {/* Card row */}
                  <div className={`flex items-center gap-3 w-full max-w-xs ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Card */}
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="bg-primary rounded-2xl p-4 flex-1 flex items-center gap-3"
                    >
                      {isLeft ? (
                        <>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-primary-foreground">{step.title}</h3>
                            <p className="text-primary-foreground/60 text-xs mt-1">{step.desc}</p>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-accent" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-primary-foreground">{step.title}</h3>
                            <p className="text-primary-foreground/60 text-xs mt-1">{step.desc}</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                    {/* Circle connector + step number */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 rounded-full border-2 border-accent bg-card" />
                    </div>
                    {/* Step label */}
                    <div className={`shrink-0 w-14 ${isLeft ? 'text-left' : 'text-right'}`}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Step</p>
                      <p className="text-2xl font-bold text-accent">{step.num}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: semi-circular arc with cards fanning out (like reference image 1) */}
          <div className="hidden md:flex justify-center">
            <div className="relative" style={{ width: 900, height: 520 }}>
              {/* Semi-circle arc */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 520" fill="none">
                {/* Main semi-circle curve on the left side, centred */}
                <path
                  d="M 340 40 C 180 40, 120 130, 120 260 C 120 390, 180 480, 340 480"
                  stroke="hsl(var(--accent))"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                  opacity="0.4"
                />
                {/* Filled semi-circle decorative arcs */}
                <path
                  d="M 280 140 C 220 140, 190 190, 190 260 C 190 330, 220 380, 280 380"
                  stroke="hsl(var(--accent))"
                  strokeWidth="22"
                  strokeLinecap="round"
                  opacity="0.12"
                  fill="none"
                />
                <path
                  d="M 270 170 C 230 170, 210 210, 210 260 C 210 310, 230 350, 270 350"
                  stroke="hsl(var(--primary))"
                  strokeWidth="18"
                  strokeLinecap="round"
                  opacity="0.15"
                  fill="none"
                />
                {/* Branch lines from arc to cards */}
                {[
                  { x1: 340, y1: 52, x2: 420, y2: 52 },
                  { x1: 310, y1: 155, x2: 420, y2: 155 },
                  { x1: 295, y1: 260, x2: 420, y2: 260 },
                  { x1: 310, y1: 365, x2: 420, y2: 365 },
                  { x1: 340, y1: 468, x2: 420, y2: 468 },
                ].map((line, i) => (
                  <g key={i}>
                    <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5 4" opacity="0.35" />
                    <circle cx={line.x1} cy={line.y1} r="5" fill="hsl(var(--accent))" opacity="0.5" />
                    <circle cx={line.x1 - 12} cy={line.y1} r="2.5" fill="hsl(var(--accent))" opacity="0.3" />
                  </g>
                ))}
              </svg>

              {/* Centre label inside the arc */}
              <div className="absolute flex flex-col items-center justify-center" style={{ left: 160, top: 210, width: 120, height: 100 }}>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">How We</p>
                <p className="text-2xl font-bold text-foreground">Work</p>
              </div>

              {/* Step cards positioned absolutely */}
              {steps.map((step, i) => {
                const Icon = step.icon;
                const yPositions = [20, 123, 228, 333, 436];
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="absolute flex items-center gap-3"
                    style={{ left: 400, top: yPositions[i], width: 460 }}
                  >
                    {/* Number badge */}
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-lg relative z-10">
                      {step.num}
                    </div>
                    {/* Card */}
                    <div className="bg-primary rounded-2xl px-5 py-4 flex items-center gap-4 flex-1 shadow-md">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-primary-foreground">{step.title}</h3>
                        <p className="text-primary-foreground/60 text-xs mt-1">{step.desc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shrink-0">
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
