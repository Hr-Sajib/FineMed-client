import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-pharmacy-light">
        <FontAwesomeIcon icon={faFileCircleQuestion} className="h-11 w-11 text-pharmacy-deep" />
        <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full bg-rx font-mono text-sm font-bold text-white">
          404
        </span>
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          This page wasn&apos;t on the shelf
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back to something useful.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href="/">Return home</Button>
        <Button href="/shop" variant="outline">
          Browse medicines
        </Button>
      </div>
    </div>
  );
}
