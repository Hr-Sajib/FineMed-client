
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faXmark, faTicket, faCopy, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/Button";
import { Label, Input } from "@/components/ui/Field";

const generateCouponCode = (length: number) => {
  // Capital letters + digits only, per the coupon's intended format.
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Fixed, always-on-screen coupon widget (bottom-right chat-widget style
 * anchor) rather than a scroll-in homepage section — it stays visible no
 * matter which part of the home page the user has scrolled to, and can be
 * collapsed back down to just the floating button.
 */
const CouponWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const openWidget = () => {
    setIsOpen(true);
    setHasInteracted(true);
  };

  const handleGenerateCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast("❌ Please enter your name");
      return;
    }
    if (!age || isNaN(Number(age)) || Number(age) < 18) {
      toast("❌ Please enter a valid age (18 or older)");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setCouponCode(generateCouponCode(6));
      setIsGenerating(false);
    }, 500);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    toast("✅ Coupon code copied to clipboard!");
  };

  const handleReset = () => {
    setCouponCode("");
    setName("");
    setAge("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      <div
        className={`w-[calc(100vw-3rem)] max-w-sm origin-bottom-right rounded-2xl border border-border bg-surface shadow-[var(--shadow-card-hover)] transition-all duration-300 ease-out ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between rounded-t-2xl bg-amber-light px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-amber">
              <FontAwesomeIcon icon={faGift} className="h-4 w-4" />
            </span>
            <h3 className="font-display text-base font-semibold text-ink">Discount Coupon</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-white/50"
            aria-label="Collapse coupon widget"
          >
            <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-5">
          {couponCode ? (
            <div className="text-center">
              <p className="mb-3 text-sm text-ink-soft">
                Use this code at checkout for a special discount.
              </p>
              <div className="rounded-xl bg-pharmacy-light p-4 font-mono text-2xl font-semibold tracking-[0.25em] text-pharmacy-deep">
                {couponCode}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleCopyCoupon}
                  className="flex-1"
                  icon={<FontAwesomeIcon icon={faCopy} />}
                >
                  Copy Code
                </Button>
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  icon={<FontAwesomeIcon icon={faRotateLeft} />}
                >
                  New Code
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerateCoupon} className="space-y-3">
              <p className="mb-1 text-sm text-ink-soft">
                Tell us a little about yourself for a personalized code.
              </p>
              <div>
                <Label htmlFor="widget-coupon-name">Your Name</Label>
                <Input
                  id="widget-coupon-name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="widget-coupon-age">Your Age</Label>
                <Input
                  id="widget-coupon-age"
                  type="number"
                  placeholder="18+"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  required
                />
              </div>
              <Button
                type="submit"
                fullWidth
                loading={isGenerating}
                icon={<FontAwesomeIcon icon={faTicket} />}
              >
                {isGenerating ? "Generating..." : "Get My Coupon"}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        onClick={() => (isOpen ? setIsOpen(false) : openWidget())}
        aria-label={isOpen ? "Close discount coupon widget" : "Open discount coupon widget"}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-pharmacy text-white shadow-[var(--shadow-card-hover)] transition-colors hover:bg-pharmacy-deep ${
          !isOpen && !hasInteracted ? "animate-gentle-float" : ""
        }`}
      >
        {!isOpen && !hasInteracted && (
          <span className="absolute inset-0 -z-10 rounded-full bg-pharmacy animate-ping opacity-60" />
        )}
        <FontAwesomeIcon icon={isOpen ? faXmark : faGift} className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CouponWidget;
