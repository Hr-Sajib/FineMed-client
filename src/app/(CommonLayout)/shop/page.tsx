
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllMedicinesQuery } from "@/redux/features/medicine/medicineApi";
import { selectMedicines, setMedicines } from "@/redux/features/medicine/medicineSlice";
import { addToCart, selectCart } from "@/redux/features/cart/cartSlice";
import { IMedicine } from "@/types";

// Define the expected response type for the query
interface MedicinesResponse {
  data: IMedicine[] | { medicines: IMedicine[] };
}

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

const AllMedicinesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const medicines = useSelector(selectMedicines).medicines;
  const cartItems = useSelector(selectCart);

  // Initialize states from URL query parameters
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const [search, setSearch] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterForm, setFilterForm] = useState("");
  const [filterPrescription, setFilterPrescription] = useState("");
  const [sortPrice, setSortPrice] = useState("");

  const { data, isLoading, error } = useGetAllMedicinesQuery({
    search: search || undefined,
  }) as { data?: MedicinesResponse; isLoading: boolean; error: any };

  // Update URL when search or category changes
  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.set("search", encodeURIComponent(search));
    if (filterCategory) query.set("category", encodeURIComponent(filterCategory));
    const queryString = query.toString();
    router.replace(`/shop${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [search, filterCategory, router]);

  // Update medicines in Redux store when data is fetched
  useEffect(() => {
    if (data?.data) {
      const medicinesArray = Array.isArray(data.data)
        ? data.data
        : data.data.medicines;
      dispatch(setMedicines(medicinesArray));
    }
  }, [data, dispatch]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesCategory = filterCategory
        ? medicine.category?.toLowerCase() === filterCategory.toLowerCase()
        : true;

      const matchesForm = filterForm
        ? medicine.form?.toLowerCase() === filterForm.toLowerCase()
        : true;

      const matchesPrescription = filterPrescription
        ? medicine.prescriptionRequired === (filterPrescription === "Yes")
        : true;

      return matchesCategory && matchesForm && matchesPrescription;
    });
  }, [medicines, filterCategory, filterForm, filterPrescription]);

  // Sorting logic
  const sortedMedicines = useMemo(() => {
    if (sortPrice === "asc") {
      return [...filteredMedicines].sort((a, b) => a.price - b.price);
    } else if (sortPrice === "desc") {
      return [...filteredMedicines].sort((a, b) => b.price - b.price);
    }
    return filteredMedicines;
  }, [filteredMedicines, sortPrice]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] py-8 px-4 lg:w-[80vw] mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          All Medicines
        </h2>
        {/* Skeleton Grid */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
          {[...Array(8)].map((_, index) => (
            <MedicineCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-[70vh] text-center py-8 text-red-600">
        Error loading medicines: {JSON.stringify(error)}
      </div>
    );

  return (
    <div className="min-h-[70vh] py-8 px-4 lg:w-[80vw] mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        All Medicines
      </h2>

      {/* 🔍 Search and Filter */}
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="">All Categories</option>
          <option value="Antibiotic">Antibiotic</option>
          <option value="Painkiller">Painkiller</option>
          <option value="Antacid">Antacid</option>
          <option value="Antiseptic">Antiseptic</option>
          <option value="Antiviral">Antiviral</option>
        </select>

        <select
          value={filterForm}
          onChange={(e) => setFilterForm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="">All Forms</option>
          <option value="Capsule">Capsule</option>
          <option value="Tablet">Tablet</option>
          <option value="Liquid">Liquid</option>
          <option value="Gel">Gel</option>
          <option value="Cream">Cream</option>
        </select>

        <select
          value={filterPrescription}
          onChange={(e) => setFilterPrescription(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="">Prescription Required</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select
          value={sortPrice}
          onChange={(e) => setSortPrice(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* 🧾 Medicines Grid */}
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 mb-30">
        {sortedMedicines.map((medicine) => {
          const isInCart = cartItems.some((item) => item._id === medicine._id);
          const isOutOfStock = medicine.quantity === 0;

          return (
            <div
              key={medicine._id}
              className=" bg-[#e6f4f1] shadow-md rounded-md overflow-hidden p-4"
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
                  className="bg-red-200 text-black py-1 px-3 rounded-full hover:bg-red-200"
                >
                  Details
                </Link>
                <button
                  disabled={isInCart || isOutOfStock}
                  onClick={() =>
                    dispatch(
                      addToCart({
                        _id: medicine._id!,
                        name: medicine.name,
                        price: medicine.price,
                        quantity: 1,
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
                    )
                  }
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
    </div>
  );
};

export default AllMedicinesPage;
