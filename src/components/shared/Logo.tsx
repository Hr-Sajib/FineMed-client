import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMortarPestle } from "@fortawesome/free-solid-svg-icons";

/**
 * The mortar & pestle is the historical, still-current international
 * symbol for a pharmacy/apothecary — used here as the brand mark instead
 * of a generic cross or heartbeat icon.
 */
export default function Logo({
  onDark = false,
  admin = false,
  href = "/",
}: {
  onDark?: boolean;
  admin?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          onDark ? "bg-white/10 text-white" : "bg-pharmacy-light text-pharmacy-deep"
        }`}
      >
        <FontAwesomeIcon icon={faMortarPestle} className="h-4 w-4" />
      </span>
      <span
        className={`font-display text-xl font-semibold leading-none ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        Fine<span className="text-pharmacy">Med</span>
      </span>
      {admin && (
        <span className="ml-0.5 rounded-full bg-rx-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rx-deep">
          Admin
        </span>
      )}
    </Link>
  );
}
