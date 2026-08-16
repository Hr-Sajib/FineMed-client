
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMedicines, setMedicines } from "@/redux/features/medicine/medicineSlice";
import { IMedicine } from "@/types";
import UpdateMedicineModal from "@/components/admin/UpdateProductModal";
import AddMedicineModal from "@/components/admin/AddMedicineModal";
import { useGetAllMedicinesQuery } from "@/redux/features/medicine/medicineApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faChevronLeft, faChevronRight, faCapsules } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PriceTag from "@/components/ui/PriceTag";
import SectionHeading from "@/components/ui/SectionHeading";

const Medicines = () => {
  const dispatch = useDispatch();
  const medicines = useSelector(selectMedicines).medicines;
  const [selectedMedicine, setSelectedMedicine] = useState<IMedicine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const { data: medicinesData, refetch } = useGetAllMedicinesQuery({});

  // Set medicines in store
  useEffect(() => {
    if (medicinesData?.data) {
      dispatch(setMedicines(medicinesData.data));
    }
  }, [medicinesData, dispatch]);

  // Handle empty medicines
  useEffect(() => {
    if (medicines.length === 0 && !medicinesData) {
      dispatch(setMedicines([]));
    }
  }, [dispatch, medicines.length, medicinesData]);

  // Refetch medicines when Redux medicines change
  useEffect(() => {
    refetch();
  }, [medicines, refetch]);

  // Pagination logic
  const totalPages = Math.ceil(medicines.length / pageSize);
  const paginatedMedicines = medicines.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleUpdateMedicine = (medicine: IMedicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeUpdateMedicineModal = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  const closeAddMedicineModal = () => {
    setIsAddModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-[70vh] space-y-8 mb-10 max-w-7xl mx-auto">
      {/* Medicines Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SectionHeading eyebrow="Inventory" title="All Medicines" />
          <Button onClick={() => setIsAddModalOpen(true)} icon={<FontAwesomeIcon icon={faPlus} />}>
            Add Medicine
          </Button>
        </div>
        {medicines && medicines.length > 0 ? (
          <>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-paper-deep">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Brand
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Price
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedMedicines.map((med) => (
                      <tr key={med._id} className="hover:bg-paper-deep/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-ink font-medium whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            <FontAwesomeIcon icon={faCapsules} className="h-3.5 w-3.5 text-pharmacy" />
                            {med.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-ink-soft whitespace-nowrap">{med.brand}</td>
                        <td className="py-3 px-4 text-sm font-mono text-ink-soft whitespace-nowrap">
                          {med.quantity <= 10 ? (
                            <Badge variant="danger">{med.quantity} left</Badge>
                          ) : (
                            med.quantity
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <PriceTag value={med.price} size="sm" />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={<FontAwesomeIcon icon={faPenToSquare} />}
                            onClick={() => handleUpdateMedicine(med)}
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-pharmacy-light hover:text-pharmacy-deep"
                }`}
                aria-label="Previous page"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-pharmacy text-white"
                      : "bg-surface border border-border text-ink-soft hover:bg-pharmacy-light hover:text-pharmacy-deep"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-pharmacy-light hover:text-pharmacy-deep"
                }`}
                aria-label="Next page"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted mt-4">No medicines found.</p>
        )}
      </div>

      {isModalOpen && selectedMedicine && (
        <UpdateMedicineModal onClose={closeUpdateMedicineModal} medicine={selectedMedicine} />
      )}
      {isAddModalOpen && <AddMedicineModal onClose={closeAddMedicineModal} />}
    </div>
  );
};

export default Medicines;
