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
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faMagnifyingGlass,
  faPrescriptionBottleMedical,
  faTriangleExclamation,
  faXmark,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Aos from "aos";
import "aos/dist/aos.css";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PriceTag from "@/components/ui/PriceTag";
import SectionHeading from "@/components/ui/SectionHeading";
import { Label, Select, Input } from "@/components/ui/Field";

// Define the expected response type for the query
interface MedicinesResponse {
  data: IMedicine[] | { medicines: IMedicine[] };
}

const MedicineCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 h-[200px] w-full rounded-xl bg-paper-deep" />
      <div className="mb-2 h-5 w-3/4 rounded bg-paper-deep" />
      <div className="mb-3 h-3 w-1/2 rounded bg-paper-deep" />
      <div className="mb-3 h-5 w-20 rounded-full bg-paper-deep" />
      <div className="mb-4 h-6 w-1/3 rounded bg-paper-deep" />
      <div className="flex justify-between gap-2">
        <div className="h-9 w-20 rounded-full bg-paper-deep" />
        <div className="h-9 w-28 rounded-full bg-paper-deep" />
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
      return [...filteredMedicines].sort((a, b) => b.price - a.price);
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

  const filterFields = (idPrefix: string) => (
    <div className="space-y-5">
      <div>
        <Label htmlFor={`search${idPrefix}`}>Search</Label>
        <Input
          id={`search${idPrefix}`}
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search medicines"
        />
      </div>

      <div>
        <Label htmlFor={`category${idPrefix}`}>Category</Label>
        <Select
          id={`category${idPrefix}`}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="Antibiotic">Antibiotic</option>
          <option value="Painkiller">Painkiller</option>
          <option value="Antacid">Antacid</option>
          <option value="Antiseptic">Antiseptic</option>
          <option value="Antiviral">Antiviral</option>
        </Select>
      </div>

      <div>
        <Label htmlFor={`form${idPrefix}`}>Form</Label>
        <Select
          id={`form${idPrefix}`}
          value={filterForm}
          onChange={(e) => setFilterForm(e.target.value)}
          aria-label="Filter by form"
        >
          <option value="">All Forms</option>
          <option value="Capsule">Capsule</option>
          <option value="Tablet">Tablet</option>
          <option value="Liquid">Liquid</option>
          <option value="Gel">Gel</option>
          <option value="Cream">Cream</option>
        </Select>
      </div>

      <div>
        <Label htmlFor={`prescription${idPrefix}`}>Prescription</Label>
        <Select
          id={`prescription${idPrefix}`}
          value={filterPrescription}
          onChange={(e) => setFilterPrescription(e.target.value)}
          aria-label="Filter by prescription requirement"
        >
          <option value="">Prescription Required</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <Label htmlFor={`sortPrice${idPrefix}`}>Sort by Price</Label>
        <Select
          id={`sortPrice${idPrefix}`}
          value={sortPrice}
          onChange={(e) => setSortPrice(e.target.value)}
          aria-label="Sort by price"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </Select>
      </div>
    </div>
  );

  const renderMedicineCard = (medicine: IMedicine, animate = true) => {
    const isInCart = cartItems.some((item) => item._id === medicine._id);
    const isOutOfStock = medicine.quantity === 0;

    return (
      <Card
        {...(animate ? { "data-aos": "zoom-in" } : {})}
        key={medicine._id}
        hoverable
        padding="sm"
        className="flex flex-col"
      >
        <div className="relative mb-4 h-[190px] w-full overflow-hidden rounded-xl bg-paper-deep">
          <Image
            src={medicine.image}
            alt={medicine.name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-xl"
          />
          {medicine.prescriptionRequired && (
            <Badge
              variant="danger"
              icon={<FontAwesomeIcon icon={faPrescriptionBottleMedical} />}
              className="absolute left-2 top-2"
            >
              Rx
            </Badge>
          )}
        </div>

        <h3 className="line-clamp-1 font-display text-lg font-semibold text-ink">
          {medicine.name}
        </h3>
        <p className="mb-2 line-clamp-1 text-xs text-muted">
          {medicine.generic}
          {medicine.brand ? ` · ${medicine.brand}` : ""}
        </p>

        <div className="mb-3">
          <Badge variant="neutral">{medicine.category}</Badge>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceTag value={medicine.price} />
          <div className="flex items-center gap-2">
            <Button href={`/medicine/${medicine._id}`} variant="outline" size="sm">
              Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isInCart || isOutOfStock}
              onClick={() => handleAddToCart(medicine)}
            >
              {isInCart ? "Added" : isOutOfStock ? "Out of Stock" : "Add"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
        {/* Skeleton Sidebar for Large Screens */}
        <div className="sticky top-28 hidden h-fit w-full shrink-0 animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] lg:block lg:w-72">
          <div className="mb-6 h-6 w-1/2 rounded bg-paper-deep" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-10 w-full rounded-xl bg-paper-deep" />
            ))}
          </div>
        </div>

        {/* Skeleton Main Content */}
        <div className="w-full">
          <div className="mb-8 h-8 w-1/3 rounded bg-paper-deep" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <MedicineCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="mx-auto min-h-[70vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card padding="lg" className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rx-light text-rx">
            <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6" />
          </span>
          <h2 className="font-display text-xl font-semibold text-ink">Couldn&apos;t load medicines</h2>
          <p className="text-sm text-muted">Something went wrong while fetching the catalog. Please try again shortly.</p>
        </Card>
      </div>
    );

  return (
    <div className="min-h-[70vh] bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8 lg:py-14">
        {/* Sticky Left Sidebar for Large Screens */}
        <Card
          padding="lg"
          className="sticky top-28 hidden h-fit w-full shrink-0 lg:block lg:w-72"
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-ink">Filters</h3>
          {filterFields("")}
        </Card>

        {/* Main Content */}
        <div className="w-full">
          <div className="mb-8 flex items-center justify-between gap-4">
            <SectionHeading eyebrow="Catalog" title="All Medicines" />
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faFilter} />}
              className="lg:hidden"
            >
              Filters
            </Button>
          </div>

          {/* Mobile Sidebar Modal */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                aria-label="Close filters"
                className="absolute inset-0 bg-ink/40"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div
                data-aos="fade-left"
                className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-surface p-6 shadow-[var(--shadow-card-hover)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink">Filters</h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-paper-deep"
                    title="Close"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                  </button>
                </div>
                {filterFields("Mobile")}
                <Button
                  onClick={() => setIsSidebarOpen(false)}
                  variant="primary"
                  fullWidth
                  className="mt-6"
                >
                  Show results
                </Button>
              </div>
            </div>
          )}

          {/* Medicines Grid */}
          {paginatedMedicines.length === 0 ? (
            <Card padding="lg" className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-pharmacy-light text-pharmacy-deep">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="h-6 w-6" />
              </span>
              <h3 className="font-display text-xl font-semibold text-ink">No medicines found</h3>
              <p className="max-w-sm text-sm text-muted">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </Card>
          ) : (
            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedMedicines.map((medicine) => renderMedicineCard(medicine))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0 });
                }}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0 });
                  }}
                  className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-pharmacy text-white"
                      : "bg-pharmacy-light text-pharmacy-deep hover:bg-[#d3ecdd]"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <Button
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0 });
                }}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                icon={<FontAwesomeIcon icon={faChevronRight} />}
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllMedicinesPage;
