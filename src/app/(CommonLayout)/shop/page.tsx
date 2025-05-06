
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
import { FiMenu, FiX } from "react-icons/fi";
import { IMedicine } from "@/types";

// Define the expected response type for the query
interface MedicinesResponse {
  data: IMedicine[] | { medicines: IMedicine[] };
}

const MedicineCardSkeleton = () => {
  return (
    <div className="border border-gray-200 shadow-md rounded-xl overflow-hidden p-6 animate-pulse">
      <div className="relative w-full h-[200px] mb-4 rounded-md overflow-hidden bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="flex gap-0">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex gap-0 mt-2">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mt-3"></div>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

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

  // Reset currentPage when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory, filterForm, filterPrescription, sortPrice]);

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

  // Pagination logic
  const totalPages = Math.ceil(sortedMedicines.length / itemsPerPage);
  console.log("totalPages: ",totalPages)
  const paginatedMedicines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedMedicines.slice(start, end);
  }, [sortedMedicines, currentPage]);

  // Generate page numbers (show up to 5 pages)
  const pageNumbers = useMemo(() => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] py-12 px-6 lg:px-8 max-w-7xl mx-auto mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          All Medicines
        </h2>
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-8 lg:gap-3">
          {[...Array(8)].map((_, index) => (
            <MedicineCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-[70vh] text-center py-12 px-6 text-red-600 max-w-7xl mx-auto mt-6">
        Error loading medicines: {JSON.stringify(error)}
      </div>
    );

  return (
    <div className="min-h-[70vh] py-12 px-6 lg:px-8 max-w-7xl mx-auto mt-6">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        All Medicines
      </h2>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Sidebar Toggle Button (Mobile) */}
        <button
          className="md:hidden fixed top-4 left-4 bg-teal-600 text-white p-3 rounded-full flex items-center justify-center z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          id="sidebar"
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 lg:w-72 max-w-xs bg-white fixed p-4 md:p-6 rounded-xl shadow-md space-y-4 md:space-y-6 mt-12 md:mt-0`}
        >
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Filters</h3>

          <div>
            <label htmlFor="search" className="block text-teal-700 font-semibold mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 border border-teal-200 rounded-full bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Search medicines"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-teal-700 font-semibold mb-2">
              Category
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-5 py-3 border border-teal-200 rounded-full bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Painkiller">Painkiller</option>
              <option value="Antacid">Antacid</option>
              <option value="Antiseptic">Antiseptic</option>
              <option value="Antiviral">Antiviral</option>
            </select>
          </div>

          <div>
            <label htmlFor="form" className="block text-teal-700 font-semibold mb-2">
              Form
            </label>
            <select
              id="form"
              value={filterForm}
              onChange={(e) => setFilterForm(e.target.value)}
              className="w-full px-5 py-3 border border-teal-200 rounded-full bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Filter by form"
            >
              <option value="">All Forms</option>
              <option value="Capsule">Capsule</option>
              <option value="Tablet">Tablet</option>
              <option value="Liquid">Liquid</option>
              <option value="Gel">Gel</option>
              <option value="Cream">Cream</option>
            </select>
          </div>

          <div>
            <label htmlFor="prescription" className="block text-teal-700 font-semibold mb-2">
              Prescription
            </label>
            <select
              id="prescription"
              value={filterPrescription}
              onChange={(e) => setFilterPrescription(e.target.value)}
              className="w-full px-5 py-3 border border-teal-200 rounded-full bg-teal-50 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-teal-400"
              aria-label="Filter by prescription requirement"
            >
              <option value="">Prescription Required</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortPrice" className="block text-teal-700 font-semibold mb-2">
              Sort by Price
            </label>
            <select
              id="sortPrice"
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="w-full px-5 py-3 border border-teal-200 rounded-full bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Sort by price"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="flex-1 px-4 ml-[20vw]">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-8 lg:gap-3 mb-12">
            {paginatedMedicines.map((medicine) => {
              const isInCart = cartItems.some((item) => item._id === medicine._id);
              const isOutOfStock = medicine.quantity === 0;

              return (
                <div
                  key={medicine._id}
                  className="bg-[#e6f4f1] shadow-md rounded-xl overflow-hidden p-6"
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

                  <h3 className="font-semibold text-lg text-gray-800 mb-3">
                    {medicine.name}
                  </h3>

                  <div className="flex gap-0 mb-2">
                    <p className="bg-red-800 text-white px-2 py-1">Generic -</p>
                    <p className="bg-red-100 px-2 py-1">{medicine.generic}</p>
                  </div>

                  <div className="flex gap-0 mb-2">
                    <p className="bg-blue-100 px-2 py-1">Category</p>
                    <p className="bg-blue-100 px-2 py-1">{medicine.category}</p>
                  </div>

                  <p className="text-xl font-bold text-blue-600 mt-3 mb-2">
                    ${medicine.price}
                  </p>
                  <div className="flex gap-2 mb-3">
                    <p>Prescription</p>
                    <p className="text-2xl relative bottom-1 text-red-600">
                      {medicine.prescriptionRequired ? "✔" : "✘"}
                    </p>
                  </div>

                  <div className="flex justify-between mt-4 gap-3">
                    <Link
                      href={`/medicine/${medicine._id}`}
                      className="bg-red-200 text-black py-2 px-4 rounded-full hover:bg-red-300 transition-colors"
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
                      className={`py-2 px-4 rounded-full text-white ${
                        isInCart || isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      } transition-colors`}
                    >
                      {isInCart ? "Added" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full text-white ${
                  currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
                } transition-colors`}
                aria-label="Go to previous page"
              >
                Previous
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === page
                      ? "bg-teal-600 text-white"
                      : "bg-teal-50 text-teal-700 hover:bg-teal-200"
                  } transition-colors`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full text-white ${
                  currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
                } transition-colors`}
                aria-label="Go to next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllMedicinesPage;
