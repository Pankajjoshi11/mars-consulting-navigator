import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import aboutGrid from "@/assets/about-grid.jpg";
import aboutTeam from "@/assets/about-team.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const values = [
  { title: "Value-Driven", desc: "Every engagement is designed around measurable outcomes, not just deliverables." },
  { title: "Fit-for-Purpose", desc: "Solutions shaped to your context — not a one-size-fits-all approach." },
  { title: "Partnership", desc: "We walk with clients at every step of delivery, from strategy to hypercare." },
  { title: "Transparency", desc: "Clear communication, honest timelines, and full visibility throughout." },
];

const FlipCard = ({ title, desc }: { title: string; desc: string }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-48 cursor-pointer"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-primary rounded-2xl flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="text-xl font-bold text-primary-foreground text-center">{title}</h3>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 bg-accent rounded-2xl flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-accent-foreground text-sm text-center leading-relaxed">{desc}</p>
        </div>
      </motion.div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="section-padding bg-card">
        <div className="container-mars">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <img src={aboutGrid} alt="About Mars Consulting" className="rounded-2xl shadow-lg w-full" />
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Your partner from strategy to value realisation.
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed text-lg">
                Mars Consulting is a consulting firm specialising in project implementation and offshore resourcing.
                We partner with you at every step, so delivery is not only completed, but adopted, supported and measured.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding bg-secondary">
      <div className="container-mars">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Consulting Firm Built on Delivery
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed mb-4">
                Mars Consulting was founded on a simple belief: that great consulting is about more than advice — it's about walking alongside clients through the full journey of transformation and delivery.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed mb-4">
                We bring together experienced project delivery professionals and a vetted offshore talent network to give organisations the execution capability they need, when they need it.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed">
                Our value-driven approach means we are always focused on outcomes — not just outputs. We measure success by the value realised, the adoption achieved, and the confidence our clients feel at every stage.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img src={aboutTeam} alt="Mars Consulting team" className="rounded-2xl shadow-lg w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Flip Cards */}
      <section className="section-padding bg-card">
        <div className="container-mars">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
          >
            Our Values
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-muted-foreground text-center mb-12">
            Hover to discover what drives us
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <FlipCard title={v.title} desc={v.desc} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Offshore Stats */}
      <section className="section-padding bg-primary">
        <div className="container-mars text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-primary-foreground mb-12"
          >
            Why Offshore?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "40–60%", label: "Typical cost savings vs local teams" },
              { stat: "Rapid", label: "Scale-up without lengthy recruitment cycles" },
              { stat: "Global", label: "Access to a deep pool of specialised talent" },
            ].map((item, i) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-accent mb-2">{item.stat}</p>
                <p className="text-primary-foreground/70">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Partner With Us?
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
