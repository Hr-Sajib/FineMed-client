
"use client";

import { useState, useRef, useEffect } from "react";
import { FiCopy, FiX } from "react-icons/fi";
import { toast } from "sonner";

const DiscountCouponSection = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [buttonText, setButtonText] = useState("Collect Coupon");
  const [couponCode, setCouponCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const generateRandomString = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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

    setButtonText("Generating...");
    const namePrefix = name.slice(0, 3).toUpperCase();
    const randomPart = generateRandomString(4);
    const newCoupon = `${namePrefix}${age}-${randomPart}`;
    setCouponCode(newCoupon);

    setTimeout(() => {
      setButtonText("Generated Your Coupon");
      setIsModalOpen(true);
    }, 500);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    toast("✅ Coupon code copied to clipboard!");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setButtonText("Collect Coupon");
    setName("");
    setAge("");
    setCouponCode("");
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  return (
    <div className="bg-white py-10 px-4">
      <div
        className="max-w-7xl mx-auto bg-cover bg-center rounded-xl bg-teal-100 p-8 relative lg:mt-20 lg:mb-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1587855721660-8d58f48f62a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", // Pharmacy-themed background
        }}
      >
        <div className="bg-white bg-opacity-80 rounded-xl p-6 max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-teal-700 mb-4 text-center">
          🤗 Get Your Discount Coupon!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your details to receive a personalized discount on your next purchase.
          </p>
          <form onSubmit={handleGenerateCoupon} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                aria-label="Name"
                required
              />
              <input
                type="number"
                placeholder="Your Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                aria-label="Age"
                min="18"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full text-lg font-semibold"
              disabled={buttonText === "Generating..."}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-teal-700">😃 Your Coupon Code</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-teal-600"
                aria-label="Close modal"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
            You can use this code when special offer email is sent to you..
            </p>
            <div className="bg-teal-50 p-4 rounded-lg text-center text-teal-700 font-semibold text-lg">
              {couponCode}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleCopyCoupon}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                Copy Code
                <FiCopy className="text-xl" />
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCouponSection;
