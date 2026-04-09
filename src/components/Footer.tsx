import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-mars section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mars Consulting</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Enlightening your path to success. Specialising in project delivery and offshore resourcing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Project Delivery Services", path: "/services/project-delivery" },
                { label: "Offshore Resourcing", path: "/services/offshore-resourcing" },
                { label: "About Us", path: "/about" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Our Presence</h4>
            <div className="space-y-4 text-sm text-primary-foreground/70">
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
                <div key={office.location} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{office.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a
                      href={`mailto:${office.email}`}
                      className="hover:text-primary-foreground transition-colors"
                    >
                      {office.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Mars Consulting. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
