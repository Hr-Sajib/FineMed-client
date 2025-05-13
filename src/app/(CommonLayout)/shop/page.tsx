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
import { FiX } from "react-icons/fi";
import { IMedicine } from "@/types";
import { toast } from "sonner";
import { FaFilter } from "react-icons/fa";
import Aos from "aos";
import "aos/dist/aos.css";

// Define the expected response type for the query
interface MedicinesResponse {
  data: IMedicine[] | { medicines: IMedicine[] };
}

const MedicineCardSkeleton = () => {
  return (
    <div className="bg-[#e6f4f1] shadow-md rounded-xl overflow-hidden p-4 animate-pulse">
      <div className="relative w-full h-[200px] mb-4 rounded-md overflow-hidden bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="flex gap-0 mb-1">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex gap-0 mb-1">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mt-2 mb-2"></div>
      <div className="flex gap-2 mb-2">
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

  // Initialize AOS animations
  useEffect(() => {
    Aos.init({
      duration: 600,
      once: true,
      offset: 20,
    });
  }, []);

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
    );
    toast.success(`${medicine.name} added to cart!`);
  };

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
      <div className="min-h-[70vh] py-12 px-6 max-w-7xl mx-auto mt-9 flex flex-col lg:flex-row gap-6">
        {/* Skeleton Sidebar for Large Screens */}
        <div className="hidden lg:block lg:w-80 lg:!h-[58vh] sticky top-50 bg-white p-6 shadow-lg rounded-lg">
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Skeleton Main Content */}
        <div className="w-full lg:w-3/4">
          <h2 className="text-3xl font-semibold text-teal-800 text-center mb-8">
            All Medicines
          </h2>
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
            {[...Array(8)].map((_, index) => (
              <MedicineCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-[70vh] text-center py-12 px-6 text-red-600 max-w-7xl mx-auto mt-9">
        Error loading medicines: {JSON.stringify(error)}
      </div>
    );

  return (
    <div className="min-h-[70vh] px-6 mx-auto mt-9 flex flex-col lg:flex-row gap-6">
      {/* Sticky Left Sidebar for Large Screens */}
      <div className="hidden mb-3 lg:block lg:w-80 lg:!h-[58vh] sticky top-50 bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-lg font-semibold text-teal-700 mb-4">Filters</h3>
        <div className="space-y-4">
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
      </div>

      {/* Main Content */}
      <div className="w-full mb-10">
        <h2 data-aos="fade-up" className="text-3xl font-semibold text-teal-800 text-center mb-8">
          All Medicines
        </h2>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-24 right-0 bg-teal-600 text-white p-3 rounded-l-xl flex items-center justify-center z-50"
          title="Filter"
        >
          <FaFilter size={24} />
        </button>

        {/* Mobile Sidebar Modal */}
        {isSidebarOpen && (
          <div data-aos="fade-left" className="fixed inset-0 z-50 md:hidden">
            <div className="fixed top-20 right-0 w-80 h-full bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-teal-700">Filters</h3>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Close"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="searchMobile" className="block text-teal-700 font-semibold mb-2">
                    Search
                  </label>
                  <input
                    id="searchMobile"
                    type="text"
                    placeholder="Search medicines..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-5 py-3 border border-teal-200 rounded-full bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    aria-label="Search medicines"
                  />
                </div>

                <div>
                  <label htmlFor="categoryMobile" className="block text-teal-700 font-semibold mb-2">
                    Category
                  </label>
                  <select
                    id="categoryMobile"
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
                  <label htmlFor="formMobile" className="block text-teal-700 font-semibold mb-2">
                    Form
                  </label>
                  <select
                    id="formMobile"
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
                  <label htmlFor="prescriptionMobile" className="block text-teal-700 font-semibold mb-2">
                    Prescription
                  </label>
                  <select
                    id="prescriptionMobile"
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
                  <label htmlFor="sortPriceMobile" className="block text-teal-700 font-semibold mb-2">
                    Sort by Price
                  </label>
                  <select
                    id="sortPriceMobile"
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
            </div>
          </div>
        )}

        {/* Medicines Grid */}
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 mb-12">
          {paginatedMedicines.map((medicine) => {
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
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0 });
              }}
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
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0 });
                }}
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
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0 });
              }}
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
  );
};

export default AllMedicinesPage;