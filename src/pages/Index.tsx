import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import aboutTeam from "@/assets/HomePage.jpeg";
import iconFit from "@/assets/icon-fit.jpg";
import iconDelivery from "@/assets/icon-delivery.jpg";
import iconOffshore from "@/assets/icon-offshore.jpg";
import iconValue from "@/assets/icon-value.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Index = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [selectedOffice, setSelectedOffice] = useState<"pune" | "australia">("pune");

  const offices = [
    {
      id: "pune" as const,
      location: "Pune, Maharashtra, India",
      email: "info@marsconsulting.in",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.204898!2d73.856743!3d18.520430!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07f4e4f0e0d%3A0x4f0e4e4e4e4e4e4e!2sPune%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sin!4v1690000000000",
    },
    {
      id: "australia" as const,
      location: "Sydney/Newcastle, NSW, Australia",
      email: "info@mars-consulting.com.au",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212795.48699639665!2d150.52092912650396!3d-33.010126486548835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b7313c1074cc4f9%3A0xc773bf8e128c0f36!2sNewcastle%20NSW%2C%20Australia!5e0!3m2!1sen!2sin!4v1774828266000",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover object-[50%_30%] md:object-center" />
        <div className="absolute inset-0 bg-primary/40" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-6"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4">
            Mars Consulting
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-primary-foreground/80 mb-10 tracking-wide">
            Enlightening your path to success
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              to="/#what-we-do"
              className="px-8 py-3 border-2 border-primary-foreground/30 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Scale Teams Section */}
      <section className="section-padding bg-card">
        <div className="container-mars">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Scale teams with offshore efficiency and deliver projects with certainty.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed text-lg">
                Mars Consulting specialises in project delivery and offshore resourcing, combining streamlined
                execution with flexible, contract‑based talent to get faster value realisation with confidence.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img src={aboutTeam} alt="Team collaboration" className="rounded-2xl shadow-lg w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section id="what-we-do" className="section-padding scroll-mt-24 bg-secondary">
        <div className="container-mars">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Do
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Project Delivery Services",
                desc: "Business analysis, solution fit planning, execution and hypercare — we partner with you at every step to deliver the right outcomes.",
                link: "/services/project-delivery",
              },
              {
                title: "Offshore Resourcing",
                desc: "Contract‑based specialists (Dev, Test, Data, PMO) that integrate with your teams to accelerate delivery and optimise cost.",
                link: "/services/offshore-resourcing",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{item.desc}</p>
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Mars */}
      <section className="section-padding bg-card">
        <div className="container-mars">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
          >
            Why Choose Mars
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: iconFit,
                title: "Fit‑for‑purpose solutions",
                desc: "We align with your business, operating environment and industry landscape.",
              },
              {
                img: iconDelivery,
                title: "Delivery certainty",
                desc: "Clear milestones, budgets and resources keep progress visible and on track.",
              },
              {
                img: iconOffshore,
                title: "Offshore efficiency",
                desc: "Scale up quickly with vetted talent while managing cost and risk.",
              },
              {
                img: iconValue,
                title: "Value realisation & hypercare",
                desc: "Support continues beyond go‑live to ensure outcomes stick.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-secondary rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <img src={item.img} alt={item.title} className="w-16 h-16 mx-auto mb-4 rounded-xl object-cover" />
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="section-padding bg-secondary" id="contact">
        <div className="container-mars">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
          >
            Get in Touch
          </motion.h2>
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-card rounded-2xl p-8 shadow-sm"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone No</label>
                  <input
                    type="tel"
                    maxLength={20}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                  <textarea
                    required
                    maxLength={1000}
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  Submit
                </button>
              </form>
            </motion.div>

            {/* Presence */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-primary rounded-2xl p-8 text-primary-foreground flex flex-col"
            >
              <h3 className="text-xl font-bold mb-6">Our Presence</h3>
              <div className="space-y-4">
                {offices.map((office) => (
                  <button
                    key={office.id}
                    type="button"
                    onClick={() => setSelectedOffice(office.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      selectedOffice === office.id
                        ? "border-white/30 bg-white/12"
                        : "border-primary-foreground/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary-foreground">{office.location}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/80">
                          <Mail className="w-4 h-4 shrink-0" />
                          <a
                            href={`mailto:${office.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-primary-foreground transition-colors"
                          >
                            {office.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-primary-foreground/10 flex-1 min-h-[240px]">
                <iframe
                  title={`${selectedOffice === "pune" ? "Pune" : "Australia"} office map`}
                  src={offices.find((office) => office.id === selectedOffice)?.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(0.3) contrast(1.1)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-80"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
