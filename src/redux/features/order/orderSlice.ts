import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";

// Define the product in the order
export type TProduct = {
  productId: string;
  quantity: number;
};

// Pharmacy order interface
export interface IOrder {
  _id:string;
  userName: string;
  userEmail: string;
  products: TProduct[];
  totalPrice: number;
  address: string;
  contactNumber: string;
  status: "pending" | "processing" | "delivered" | "shipped";
  prescriptionRequired: boolean;
  prescriptionVarified?: boolean;
  prescriptionImageLink?: string;
  createdAt: Date;
  updatedAt: Date;
  transactionId: string;
  paymentMethod: "cashOnDelivery" | "sslcommerz";
}

// Define the state for the orders
type TOrderState = {
  orders: IOrder[];
};

// Initial state for orders
const initialState: TOrderState = {
  orders: [],
};

// Create the order slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set orders from an external source
    setOrders: (state, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },

    // Add a new order to the orders state
    addOrder: (state, action: PayloadAction<IOrder>) => {
      state.orders.push(action.payload);
    },

    // Update the status of an order
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: IOrder['status'] }>
    ) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.transactionId === orderId);
      if (order) {
        order.status = status;
      }
    },

    // Clear all orders (for example, after logging out)
    clearOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    // Clear orders data whenever the user logs out, so a previous
    // admin's view of ALL orders doesn't linger in memory for a
    // different logged-in user in the same session.
    builder.addCase(logout, () => initialState);
  },
});

// Export the actions to be used outside
export const { setOrders, addOrder, updateOrderStatus, clearOrders } = orderSlice.actions;

// Export the reducer to be used in store
export default orderSlice.reducer;

// Selector to get all orders
export const selectOrders = (state: { orders: TOrderState }) => state.orders.orders;

// Selector to get a single order by its transactionId
export const selectOrderById = (state: { orders: TOrderState }, orderId: string) => 
  state.orders.orders.find(order => order.transactionId === orderId);
