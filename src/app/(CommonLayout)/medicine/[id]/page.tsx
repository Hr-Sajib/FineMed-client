
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { addToCart } from "@/redux/features/cart/cartSlice";
import { useGetAllMedicinesQuery, useGetSingleMedicineQuery } from "@/redux/features/medicine/medicineApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { IMedicine } from "@/types";

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

// Skeleton component for the medicine details page
const MedicineDetailsSkeleton = () => {
  return (
    <div className="bg-[#f7fafc]">
      <div className="container mx-auto px-6 py-12 min-h-[70vh] lg:w-[60vw] flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden animate-pulse">
          {/* Left Side: Image Placeholder */}
          <div className="bg-[#e6f4f1] flex items-center justify-center p-8">
            <div className="relative w-full h-96 bg-gray-200 rounded-2xl"></div>
          </div>

          {/* Right Side: Info Placeholder */}
          <div className="flex flex-col justify-between p-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-16 bg-gray-200 rounded w-full mb-6"></div>
              <div className="mb-6">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            {/* Quantity Selector and Button Placeholder */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center">
                <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicineDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const { data: singleMedicineData, isLoading: isSingleLoading, error: singleError } = useGetSingleMedicineQuery(id);
  const medicine: IMedicine | undefined = singleMedicineData?.data;

  // Fetch suggested medicines (no filter, client-side category filtering)
  const { data: suggestedMedicinesData, isLoading: isSuggestedLoading } = useGetAllMedicinesQuery({});

  console.log("categoryFilter ", medicine?.category);
  console.log("suggestedMedicinesData ", suggestedMedicinesData);

  const suggestedMedicines = (suggestedMedicinesData?.data as unknown as any[]).filter(
    (med: IMedicine) => med._id !== medicine?._id && med.category === medicine?.category
  ) || [];

  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCart);

  const handleAddToCart = (medicineToAdd: IMedicine) => {
    if (medicineToAdd) {
      dispatch(
        addToCart({
          _id: medicineToAdd._id!,
          name: medicineToAdd.name,
          price: medicineToAdd.price,
          quantity,
          stockQuantity: medicineToAdd.quantity,
          image: medicineToAdd.image,
          prescriptionRequired: medicineToAdd.prescriptionRequired,
          generic: medicineToAdd.generic,
          brand: medicineToAdd.brand,
          form: medicineToAdd.form,
          category: medicineToAdd.category,
          description: medicineToAdd.description,
          simptoms: medicineToAdd.simptoms,
          manufacturer: medicineToAdd.manufacturer,
          expiryDate: medicineToAdd.expiryDate,
        })
      );
      toast.success(`${medicineToAdd.name} added to cart!`);
    }
  };

  const handleIncrease = () => {
    if (quantity < (medicine?.quantity || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isSingleLoading) {
    return <MedicineDetailsSkeleton />;
  }

  if (!medicine) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Medicine Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            Sorry, the medicine you are looking for is unavailable.
          </p>
        </div>
      </div>
    );
  }

  if (singleError) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">
            Something went wrong!
          </h2>
          <p className="text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7fafc]">
      {/* Medicine Details */}
      <div className="container mx-auto px-6 py-12 min-h-[70vh] lg:w-[60vw] flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Side: Image */}
          <div className="bg-[#e6f4f1] flex items-center justify-center p-8">
            <div className="relative w-full h-96">
              <Image
                src={medicine.image}
                alt={medicine.name}
                layout="fill"
                objectFit="contain"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Right Side: Info */}
          <div className="flex flex-col justify-between p-8 w-full">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1a365d] mb-2">
                {medicine.name}
              </h1>
              <p className="text-lg text-[#319795] mb-4">
                {medicine.brand} • {medicine.form}
              </p>

              <p className="text-4xl font-bold text-[#38a169] mb-6">
                ${medicine.price.toFixed(2)}
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {medicine.description}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-1">Symptoms:</h3>
                <div className="flex flex-wrap gap-2">
                  {medicine.simptoms?.map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="bg-[#bee3f8] text-[#2c5282] px-3 py-1 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm mb-6">
                <p>
                  <strong className="text-gray-800">Manufacturer:</strong>{" "}
                  {medicine.manufacturer}
                </p>
                <p>
                  <strong className="text-gray-800">Expiry:</strong>{" "}
                  {medicine.expiryDate}
                </p>
                <p>
                  <strong className="text-gray-800">Category:</strong>{" "}
                  {medicine.category}
                </p>
                <p>
                  <strong className="text-gray-800">Stock:</strong>{" "}
                  {medicine.quantity}
                </p>
                <p>
                  <strong className="text-gray-800">Prescription:</strong>{" "}
                  {medicine.prescriptionRequired ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Quantity Selector and Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-[#edf2f7]">
                <button
                  onClick={handleDecrease}
                  className="px-2 py-2 text-lg font-bold text-[#3182ce] hover:bg-[#ebf8ff]"
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-8 text-center bg-transparent outline-none border-none text-lg font-medium"
                />
                <button
                  onClick={handleIncrease}
                  className="px-2 py-2 text-lg font-bold text-[#3182ce] hover:bg-[#ebf8ff]"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(medicine)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#68d391] to-[#4fd1c5] hover:from-[#48bb78] hover:to-[#38b2ac] transition-all text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md"
              >
                <ShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Medicines */}
      <div className="container mx-auto px-6 py-12 lg:w-[80vw]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          You may also need
        </h2>
        {isSuggestedLoading ? (
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
            {[...Array(4)].map((_, index) => (
              <MedicineCardSkeleton key={index} />
            ))}
          </div>
        ) : suggestedMedicines.length > 0 ? (
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
            {suggestedMedicines.map((suggestedMedicine: IMedicine) => {
              const isInCart = cartItems.some((item) => item._id === suggestedMedicine._id);
              const isOutOfStock = suggestedMedicine.quantity === 0;

              return (
                <div
                  key={suggestedMedicine._id}
                  className=" bg-[#e6f4f1] shadow-md rounded-md overflow-hidden p-4"
                >
                  <div className="relative w-full h-[200px] mb-4 rounded-md overflow-hidden">
                    <Image
                      src={suggestedMedicine.image}
                      alt={suggestedMedicine.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>

                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {suggestedMedicine.name}
                  </h3>

                  <div className="flex gap-0 mb-1">
                    <p className="bg-red-800 text-white px-2">Generic -</p>
                    <p className="bg-red-100 px-2">{suggestedMedicine.generic}</p>
                  </div>

                  <div className="flex gap-0">
                    <p className="bg-blue-100 px-2">Category</p>
                    <p className="bg-blue-100 px-2">{suggestedMedicine.category}</p>
                  </div>

                  <p className="text-xl font-bold text-blue-600 mt-2">
                    ${suggestedMedicine.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <p>Prescription</p>
                    <p className="text-2xl relative bottom-1 text-red-600">
                      {suggestedMedicine.prescriptionRequired ? "✔" : "✘"}
                    </p>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Link
                      href={`/medicine/${suggestedMedicine._id}`}
                      className="bg-blue-200 text-black py-1 px-3 rounded-full hover:bg-blue-800 hover:text-white"
                    >
                      Details
                    </Link>
                    <button
                      disabled={isInCart || isOutOfStock}
                      onClick={() => handleAddToCart(suggestedMedicine)}
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
        ) : (
          <p className="text-center text-gray-500">No related medicines found.</p>
        )}
      </div>
    </div>
  );
};

export default MedicineDetailsPage;
