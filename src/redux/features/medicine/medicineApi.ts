import { IMedicine } from "@/types";
import { baseApi } from "../../api/baseApi";

// Response Types
export interface MedicineResponse {
  success: boolean;
  message: string;
  data: IMedicine;
}

export interface MedicinesResponse {
  success: boolean;
  message: string;
  data: IMedicine[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  data: null;
}

// Query params for filtering/pagination/sorting
export interface GetAllMedicinesQueryParams {
  search?: string;
  filter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  fields?: string;
}

const medicineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all medicines
    getAllMedicines: builder.query<MedicinesResponse, GetAllMedicinesQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append("search", params.search);
        if (params.filter) queryParams.append("filter", params.filter);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.fields) queryParams.append("fields", params.fields);

        console.log(`/products?${queryParams.toString()}`);
        return {
          url: `/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
          method: "GET",
        };
      },
    }),

    // GET single medicine by ID
    getSingleMedicine: builder.query<MedicineResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    }),

    // CREATE a medicine
    createMedicine: builder.mutation<MedicineResponse, Partial<IMedicine>>({
      query: (medicineData) => ({
        url: "/products",
        method: "POST",
        body: medicineData,
      }),
    }),

    // UPDATE a medicine
    updateMedicine: builder.mutation<
      MedicineResponse,
      { medicineId: string; data: Partial<IMedicine> }
    >({
      query: ({ medicineId, data }) => ({
        url: `/products/${medicineId}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // DELETE a medicine
    deleteMedicine: builder.mutation<DeleteResponse, string>({
      query: (medicineId) => ({
        url: `/products/${medicineId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllMedicinesQuery,
  useGetSingleMedicineQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = medicineApi;

export default medicineApi;
