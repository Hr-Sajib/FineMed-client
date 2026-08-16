import { IOrderData } from "@/app/(CommonLayout)/checkout/page";
import { baseApi } from "../../api/baseApi"; // Adjust path

type TOrder = {
  _id: string
  PaymentGatewayPageURL?: string
  userName: string;
  userEmail: string;
  products: {
    // GET /orders returns this populated as a full product object;
    // it may still be a plain string id in other contexts (e.g. before
    // population, or when creating an order).
    productId: string | { _id: string; name: string; [key: string]: unknown };
    quantity: number;
  }[];
  totalPrice: number;
  address: string;
  contactNumber: string;
  status: "pending" | "processing" | "delivered" | "shipped"; // before payment -> "pending"
  prescriptionRequired: boolean; // ✅ always required
  prescriptionVarified?: boolean; // ✅ optional
  prescriptionImageLink?: string; // ✅ optional
  createdAt: Date;
  updatedAt: Date;
  transactionId: string;
  paymentMethod: "cashOnDelivery" | "sslcommerz";
};

// Define response types based on backend sendResponse
interface OrderResponse {
  success: boolean;
  message: string;
  data: TOrder;
  PaymentGatewayPageURL?:string
}

interface OrdersResponse {
  success: boolean;
  message: string;
  data: TOrder[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
  data: null;
}

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new order (POST /orders/)
    createOrder: builder.mutation<OrderResponse, IOrderData>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
    }),

    // Get all orders (GET /orders/)
    getAllOrders: builder.query<OrdersResponse, void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
    }),

    // Get a single order by ID (GET /orders/:orderId)
    getSingleOrder: builder.query<OrderResponse, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
    }),

    // Update an order by ID (PATCH /orders/:orderId)
    updateOrder: builder.mutation<OrderResponse, { orderId: string; data: Partial<TOrder> }>({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Delete an order by ID (DELETE /orders/:orderId)
    deleteOrder: builder.mutation<DeleteResponse, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
    }),

    // Get my orders (GET /myOrders) - new endpoint
    getMyOrders: builder.query<OrdersResponse, void>({
      query: () => ({
        url: "/orders/myOrders",
        method: "GET",
      }),
    }),

    // Verify an order's prescription (PATCH /orders/verify-prescription/:orderId)
    verifyPrescription: builder.mutation<OrderResponse, string>({
      query: (orderId) => ({
        url: `/orders/verify-prescription/${orderId}`,
        method: "PATCH",
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetMyOrdersQuery,  // Hook for the new endpoint
  useVerifyPrescriptionMutation,
} = orderApi;

export default orderApi;
