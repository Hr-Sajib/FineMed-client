
"use client";

import { addToCart } from "@/redux/features/cart/cartSlice";
import { useGetMedicineQuery } from "@/redux/features/medicine/featureMedicineApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IMedicine } from "@/types";
import Aos from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Skeleton component for a single medicine card
const MedicineCardSkeleton = () => {
  return (
    <div className="border border-gray-200 shadow-md rounded-md overflow-hidden p-4 animate-pulse">
      <div className="relative w-full h-[200px] mb-4 rounded-md overflow-hidden bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="flex gap-0">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex gap-0 mt-1">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
      <div className="flex gap-2 mt-2">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-6"></div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-28"></div>
      </div>
    </div>
  );
};

export default function FeaturedProducts() {
  // Destructure the nested data field and rename it to medicineData
  const {
    data: { data: medicineData = [] } = {},
    isLoading,
    error,
  } = useGetMedicineQuery(undefined);
  const [quantity] = useState(1);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // console.log("data: ",medicineData)
  const handleAddToCart = (medicine: IMedicine) => {
    if (!medicine) {
      toast.error("Failed to add to cart: Medicine data is missing");
      return;
    }

    dispatch(
      addToCart({
        _id: medicine._id!,
        name: medicine.name,
        price: medicine.price,
        quantity,
        stockQuantity: medicine.quantity || 1,
        image: medicine.image,
        prescriptionRequired: medicine.prescriptionRequired,
        generic: medicine.generic,
        brand: medicine.brand,
        form: medicine.form,
        category: medicine.category,
        description: medicine.description,
        simptoms: medicine.simptoms,
        manufacturer: medicine.manufacturer,
        expiryDate: medicine.expiryDate,
      })
    );
    toast.success(`${medicine.name} added to cart!`);
  };

      // Initialize AOS animations
      useEffect(() => {
        Aos.init({
          duration: 600,
          once: true,
          offset: 20,
        });
      }, []);

  if (isLoading) {
    return (
      <div className="bg-white container mx-auto lg:my-48 my-30">
        <h3 data-aos="fade-right" className="text-gray-800 text-3xl font-bold px-4 border-l-4 border-teal-600 mb-6">
          <span className="text-teal-600">Featured</span> Medicine
        </h3>
        {/* Skeleton Grid */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2">
          {[...Array(4)].map((_, index) => (
            <MedicineCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>Error loading medicines</div>;

  return (
    <div className="bg-white container mx-auto lg:my-48 my-30 px-5 lg:!px-0">
      <h3 className="text-gray-800 text-3xl font-bold px-4 border-l-4 border-teal-600 mb-6">
        <span className="text-teal-600">Featured</span> Medicine
      </h3>

      {/* 🧾 Medicines Grid */}
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {medicineData.slice(0,12).map((medicine: IMedicine) => {
          const isInCart = cartItems.some((item) => item._id === medicine._id);
          const isOutOfStock = medicine.quantity === 0;

          return (
            <div
              data-aos="zoom-in"
              key={medicine._id}
              className="bg-[#e6f4f1] shadow-md rounded-xl overflow-hidden p-4"
            >
              <div className="relative w-full h-[200px] mb-4 rounded-md overflow-hidden">
                <Image
                  src={medicine.image}
                  alt={medicine.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>

              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {medicine.name}
              </h3>

              <div className="flex gap-0 mb-1">
                    <p className="bg-red-800 text-white px-2">Generic -</p>
                    <p className="bg-red-100 px-2">{medicine.generic}</p>
                  </div>

                  <div className="flex gap-0">
                    <p className="bg-blue-100 px-2">Category</p>
                    <p className="bg-blue-100 px-2">{medicine.category}</p>
              </div>

              <p className="text-xl font-bold text-blue-600 mt-2">
                ${medicine.price}
              </p>
              <div className="flex gap-2">
                <p>Prescription</p>
                <p className="text-2xl relative bottom-1 text-red-600">
                  {medicine.prescriptionRequired ? "✔" : "✘"}
                </p>
              </div>

              <div className="flex justify-between mt-4">
                <Link
                  href={`/medicine/${medicine._id}`}
                  className="bg-blue-200 text-black py-1 px-3 rounded-full hover:bg-blue-800 hover:text-white"
                  >
                  Details
                </Link>
                <button
                  disabled={isInCart || isOutOfStock}
                  onClick={() => handleAddToCart(medicine)}
                  className={`py-1 px-3 rounded-full text-white ${
                    isInCart || isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isInCart ? "Added" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          className="flex items-center gap-2 text-blue-700 text-lg"
          href="/shop"
        >
          View More Medicine...
        </Link>
      </div>
    </div>
  );
}
