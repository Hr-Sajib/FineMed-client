"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faMortarPestle } from "@fortawesome/free-solid-svg-icons";
import Banner from "@/components/banner/page";
import Branding from "@/components/branding/page";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import AboutUs from "@/components/AboutUs/AboutUs";
import Review from "@/components/review/Review";
import ContactUs from "@/components/extra/ContactUs";
import CouponWidget from "@/components/extra/CouponWidget";
import Aos from "aos";
import "aos/dist/aos.css";


const HomePageClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

    // Initialize AOS animations
    useEffect(() => {
      Aos.init({
        duration: 600,
        once: true,
        offset: 20,
      });
    }, []);

  return (
    <div className="w-full">
      {/* Hero — the site's one bold signature moment */}
      <section className="rx-pad relative overflow-hidden bg-paper-deep">
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <span
            data-aos="fade-down"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-pharmacy-deep shadow-[var(--shadow-card)]"
          >
            <FontAwesomeIcon icon={faMortarPestle} className="h-3.5 w-3.5" />
            Digital Apothecary
          </span>
          <h1
            data-aos="fade-up"
            className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Genuine medicines, <span className="text-pharmacy">delivered to your door.</span>
          </h1>
          <p data-aos="fade-up" className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
            Search our full catalog by name, symptom, or category — trusted sourcing,
            fast delivery, and prescription checks built in.
          </p>

          <form
            data-aos="fade-up"
            onSubmit={handleSearch}
            className="mx-auto mt-9 flex w-full max-w-2xl items-center gap-2 rounded-full bg-surface p-2 shadow-[var(--shadow-card)]"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-3 h-4 w-4 shrink-0 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines, symptoms, or categories…"
              className="w-full min-w-0 bg-transparent px-2 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-pharmacy px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-pharmacy-deep"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="pt-10 sm:pt-14">
        <Banner />
      </div>
      <Branding />
      <FeaturedProducts />
      <AboutUs />
      <ContactUs/>
      <Review />
      <CouponWidget />
    </div>
  );
};

export default HomePageClient;
