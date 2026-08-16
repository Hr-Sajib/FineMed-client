import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMortarPestle, faHeadset, faShieldHeart, faTruckMedical } from "@fortawesome/free-solid-svg-icons";

const highlights = [
  { icon: faHeadset, label: "24/7 Support" },
  { icon: faShieldHeart, label: "100% Genuine Products" },
  { icon: faTruckMedical, label: "Fast Delivery" },
];

/**
 * `bg-fixed` (background-attachment: fixed) only stays fixed relative to the
 * viewport if nothing between it and the viewport is transformed — so the
 * AOS animation (which applies a CSS transform while animating in) has to
 * live on an inner wrapper, never on the element that carries the fixed
 * background image itself, or the "parallax" effect breaks.
 */
const Branding = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[url('/images/medic.jpg')] bg-fixed bg-cover bg-center bg-no-repeat shadow-[var(--shadow-card)] mb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-pharmacy-deep/90 via-ink/75 to-ink/90" />
      <div
        data-aos="fade-down"
        className="relative z-10 mx-auto flex min-h-[360px] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[420px] lg:min-h-[480px]"
      >
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
          <FontAwesomeIcon icon={faMortarPestle} className="h-6 w-6" />
        </span>
        <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
          Fine<span className="text-pharmacy-light">Med</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/85">
          Your trusted online pharmacy for genuine medicines, health products, and wellness care.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {highlights.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-pharmacy-deep shadow-[var(--shadow-card)]"
            >
              <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Branding;
