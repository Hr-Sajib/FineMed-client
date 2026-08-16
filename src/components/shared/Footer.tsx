import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import Logo from "./Logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/profile?tab=orders", label: "Orders" },
];

const socials = [
  { href: "https://www.facebook.com/", icon: faFacebookF, label: "Facebook" },
  { href: "https://www.instagram.com/", icon: faInstagram, label: "Instagram" },
  { href: "https://x.com/?lang=en", icon: faXTwitter, label: "X" },
];

const Footer = () => {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo onDark href="/" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            FineMed is your trusted online pharmacy — genuine medicines, verified
            prescriptions, and licensed pharmacist oversight, delivered safely to
            your doorstep.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-pharmacy hover:text-white"
              >
                <FontAwesomeIcon icon={s.icon} className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-white">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-white">Contact us</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FontAwesomeIcon icon={faPhone} className="mt-0.5 h-3.5 w-3.5 text-pharmacy" />
              <span className="font-mono">+1 (415) 555-0198</span>
            </li>
            <li className="flex items-start gap-3">
              <FontAwesomeIcon icon={faEnvelope} className="mt-0.5 h-3.5 w-3.5 text-pharmacy" />
              support@finemed.com
            </li>
            <li className="flex items-start gap-3">
              <FontAwesomeIcon icon={faLocationDot} className="mt-0.5 h-3.5 w-3.5 text-pharmacy" />
              <span>742 Evergreen Terrace, Springfield, IL 62704</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} FineMed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
