"use client";

import React, { useEffect, useState } from "react";
import { IMedicine } from "@/types";
import {
  useDeleteMedicineMutation,
  useUpdateMedicineMutation,
  useGetAllMedicinesQuery,
} from "@/redux/features/medicine/medicineApi";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectMedicines, setMedicines } from "@/redux/features/medicine/medicineSlice";
import { postImage } from "@/utils/postImage";

interface UpdateMedicineModalProps {
  medicine: IMedicine;
  onClose: () => void;
}

const UpdateMedicineModal: React.FC<UpdateMedicineModalProps> = ({ medicine, onClose }) => {
  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 20,
    });
  }, []);

  // State to hold the form data, initialized with all fields from the medicine
  const [formData, setFormData] = useState({
    name: medicine.name || "",
    generic: medicine.generic || "",
    brand: medicine.brand || "",
    price: medicine.price || 0,
    image: medicine.image || "",
    form: (medicine.form || "Tablet") as "Tablet" | "Syrup" | "Capsule" | "Injection" | "Ointment",
    category: (medicine.category || "Antibiotic") as
      | "Antibiotic"
      | "Painkiller"
      | "Antacid"
      | "Antiseptic"
      | "Antiviral",
    description: medicine.description || "",
    simptoms: medicine.simptoms?.join(", ") || "",
    quantity: medicine.quantity || 0,
    prescriptionRequired: medicine.prescriptionRequired || false,
    manufacturer: medicine.manufacturer || "",
    expiryDate: medicine.expiryDate
      ? new Date(medicine.expiryDate).toISOString().split("T")[0]
      : "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [search] = useState<string>("");
  const { refetch } = useGetAllMedicinesQuery({ search: search || undefined });
  const [updateMedicine, { isLoading: isUpdating, error: updateError }] =
    useUpdateMedicineMutation();
  const [deleteMedicine, { isLoading: isDeleting, error: deleteError }] =
    useDeleteMedicineMutation();
  const dispatch = useAppDispatch();
  const medicineState = useAppSelector(selectMedicines);
  const medicines = medicineState.medicines;

  // Handle form data change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submission for updating the medicine
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;

      // Upload new image if provided
      if (imageFile) {
        console.log("Uploading new image...");
        imageUrl = await postImage(imageFile);
        console.log("New image uploaded:", imageUrl);
      }

      // Prepare medicine data
      const medicineData = {
        ...formData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        price: parseFloat(formData.price as any) || 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        quantity: parseInt(formData.quantity as any, 10) || 0,
        image: imageUrl,
        simptoms: formData.simptoms
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      // Update medicine via API
      console.log("Updating medicine with data:", medicineData);
      const response = await updateMedicine({
        medicineId: medicine._id!,
        data: medicineData,
      }).unwrap();
      console.log("Medicine updated successfully:", response.data);

      // Refetch medicines and update Redux store
      const refetchedMedicinesDataResponse = await refetch();
      console.log("Refetched medicines:", refetchedMedicinesDataResponse);
      if (refetchedMedicinesDataResponse?.data?.data) {
        dispatch(setMedicines(refetchedMedicinesDataResponse.data.data));
      }

      toast("✅ Medicine updated successfully");
      onClose();
    } catch (err) {
      console.error("Failed to update medicine:", err);
      toast("❌ Failed to update medicine");
    }
  };

  // Handle deletion of the medicine
  const handleDelete = async () => {
    try {
      console.log("Deleting medicine with ID:", medicine._id);
      await deleteMedicine(medicine._id!).unwrap();
      console.log("Medicine deleted successfully");

      // Optimistically update Redux store
      if (Array.isArray(medicines)) {
        const updatedMedicines = medicines.filter((m) => m._id !== medicine._id);
        dispatch(setMedicines(updatedMedicines));
      } else {
        console.warn("Medicines is not an array:", medicines);
      }

      toast("🗑️ Medicine deleted successfully");
      await refetch();
      onClose();
    } catch (err) {
      console.error("Failed to delete medicine:", err);
      toast("❌ Failed to delete medicine");
    }
  };

  // Display API errors
  useEffect(() => {
    if (updateError) {
      toast(`❌ Update error: ${JSON.stringify(updateError)}`);
    }
    if (deleteError) {
      toast(`❌ Delete error: ${JSON.stringify(deleteError)}`);
    }
  }, [updateError, deleteError]);

  return (
    <div
      data-aos="zoom-in"
      className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Medicine</h2>
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Generic Name</label>
            <input
              type="text"
              name="generic"
              value={formData.generic}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
            {imageFile ? (
              <p className="text-sm text-gray-500 mt-1">Selected: {imageFile.name}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Current: {formData.image}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Form</label>
            <select
              name="form"
              value={formData.form}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="Tablet">Tablet</option>
              <option value="Syrup">Syrup</option>
              <option value="Capsule">Capsule</option>
              <option value="Injection">Injection</option>
              <option value="Ointment">Ointment</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="Antibiotic">Antibiotic</option>
              <option value="Painkiller">Painkiller</option>
              <option value="Antacid">Antacid</option>
              <option value="Antiseptic">Antiseptic</option>
              <option value="Antiviral">Antiviral</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              rows={3}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Symptoms (comma-separated)
            </label>
            <input
              type="text"
              name="simptoms"
              value={formData.simptoms}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="e.g., Fever,Cough,Pain"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="prescriptionRequired"
                checked={formData.prescriptionRequired}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Prescription Required</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="flex justify-between space-x-2 sticky bottom-0 bg-white pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
              className={`py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 ${
                isDeleting || isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || isDeleting}
                className={`py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                  isUpdating || isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedicineModal;