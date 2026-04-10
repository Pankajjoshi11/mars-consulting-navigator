import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner"; // 1. Import toast from sonner

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/**
 * Replace the URL below with your live Render/Railway URL after deployment.
 * Keep http://localhost:5000 for local testing.
 */
const BACKEND_URL = "https://mars-consulting-navigator-ey2f.vercel.app";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 2. Use toast.promise for a high-end Loading -> Success/Error flow
    toast.promise(
      async () => {
        const response = await fetch(`${BACKEND_URL}/api/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to send message");
        }
        
        // Clear form on success
        setFormData({ name: "", email: "", phone: "", message: "" });
        return data;
      },
      {
        loading: 'Sending your inquiry to Mars Consulting...',
        success: 'Thank you! Your message has been sent successfully.',
        error: (err) => `${err.message}`,
      }
    );

    setIsSubmitting(false);
  };

  return (
    <div className="pt-16">
      <section className="section-padding bg-secondary min-h-[80vh]">
        <div className="container-mars">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-border bg-card p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-6 lg:grid-cols-5 lg:p-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 overflow-hidden rounded-[1.75rem] border border-border bg-white"
            >
              <div className="border-b border-border bg-secondary px-8 py-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Start The Conversation</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5 p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Phone No</label>
                  <input
                    type="tel"
                    maxLength={20}
                    placeholder="+91 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
                  <textarea
                    required
                    maxLength={1000}
                    rows={6}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Processing..." : "Submit Inquiry"}
                </button>
              </form>
            </motion.div>

            {/* Presence */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 flex flex-col gap-5"
            >
              <div className="rounded-[1.75rem] bg-primary p-8 text-primary-foreground shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Our Presence</p>
                <h3 className="mt-3 text-2xl font-bold">India and Australia</h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
                  Reach out for project delivery support, offshore resourcing or an initial conversation about your priorities.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    location: "Pune, Maharashtra, India",
                    email: "aditya@marsconsulting.in",
                  },
                  {
                    location: "Sydney/Newcastle, NSW, Australia",
                    email: "aditya@mars-consulting.com.au",
                  },
                ].map((office) => (
                  <div key={office.location} className="rounded-[1.5rem] border border-border bg-secondary p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">{office.location}</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 shrink-0 text-accent" />
                          <a
                            href={`mailto:${office.email}`}
                            className="transition-colors hover:text-foreground"
                          >
                            {office.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
