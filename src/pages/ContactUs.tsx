import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/**
 * Replace the URL below with your live Render/Railway URL after deployment.
 * Keep http://localhost:5000 for local testing.
 */
const BACKEND_URL = import.meta.env.PROD 
  ? "https://mars-consulting-navigator.onrender.com" 
  : "http://localhost:5000";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Thank you! Your message has been sent. Please check your email for a confirmation.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        console.error("Backend Error:", data);
        alert(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to the server. Please ensure your backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="section-padding bg-card min-h-[80vh]">
        <div className="container-mars">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
          >
            Contact Us
          </motion.h1>

          <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-card rounded-2xl p-8 border"
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                  <textarea
                    required
                    maxLength={1000}
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none resize-none"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </form>
            </motion.div>

            {/* Presence */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-primary rounded-2xl p-8 text-primary-foreground h-fit"
            >
              <h3 className="text-xl font-bold mb-6">Our Presence</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 shrink-0" />
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    Pune, Maharashtra, India<br />
                    Sydney/Newcastle, NSW, Australia
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0" />
                  <a href="mailto:info@marsconsulting.in" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                    info@marsconsulting.in
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;