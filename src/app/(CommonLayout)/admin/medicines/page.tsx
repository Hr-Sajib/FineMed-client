
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMedicines, setMedicines } from "@/redux/features/medicine/medicineSlice";
import { IMedicine } from "@/types";
import UpdateMedicineModal from "@/components/admin/UpdateProductModal";
import AddMedicineModal from "@/components/admin/AddMedicineModal";
import { useGetAllMedicinesQuery } from "@/redux/features/medicine/medicineApi";

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
    if (medicinesData?.data?.medicines) {
      dispatch(setMedicines(medicinesData.data.medicines));
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
    <div className="min-h-[70vh] p-6 space-y-12 mb-10">
      {/* Medicines Table */}
      <div>
        <h1 className="text-3xl font-bold text-gray-700 text-center mb-8">All Medicines</h1>
        <div className="flex my-2 justify-center">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-200 p-2 rounded-md"
          >
            Add Medicine
          </button>
        </div>
        {medicines && medicines.length > 0 ? (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
              <table className="min-w-full bg-white table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Brand
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMedicines.map((med) => (
                    <tr key={med._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">{med.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{med.brand}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{med.quantity}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">${med.price}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleUpdateMedicine(med)}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">No medicines found.</p>
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
