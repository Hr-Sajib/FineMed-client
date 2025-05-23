"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/components/banner/page";
import Branding from "@/components/branding/page";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import AboutUs from "./about/page";
import Review from "@/components/review/Review";
import ContactUs from "@/components/extra/ContactUs";
import DiscountCouponSection from "@/components/extra/DiscountCouponSection";
import BMICalculatorSection from "@/components/extra/BMICalculatorSection";
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
    <div className="mt-5 w-full">
      <div data-aos="fade-down" className="w-[80vw] lg:!mt-14 mt-8 mx-auto flex justify-center items-center gap-2 mb-5 bg-white rounded-full">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines according to name, simptoms, category etc.."
            className="border border-gray-300 rounded-l-full px-4 py-2 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded-r-full hover:bg-teal-700"
          >
            Search
          </button>
        </form>
      </div>
      <Banner />
      <Branding />
      <FeaturedProducts />
      <AboutUs />
      <DiscountCouponSection/>
      <BMICalculatorSection/>
      <ContactUs/>
      <Review />
    </div>
  );
};

export default HomePageClient;