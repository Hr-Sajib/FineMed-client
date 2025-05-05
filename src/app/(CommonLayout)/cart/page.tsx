"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import Image from "next/image";
import { clearCart, removeFromCart, updateQuantity } from "@/redux/features/cart/cartSlice";

const CartPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      if (newQuantity > 0 && newQuantity <= (item.stockQuantity || 99)) {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      }
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Safe calculation of total with fallback for price
  const total = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  const prescriptionRequired = items.some((item) => item.prescriptionRequired);

  return (
    <div className="bg-gray-100 min-h-[70vh]">
      <div className="flex items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-semibold text-teal-800 mb-8 text-center">
            Your Shopping Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center text-gray-600">
              <p className="text-lg mb-6">Your cart is empty.</p>
              <Link
                href="/shop"
                className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold transition hover:bg-teal-700"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {prescriptionRequired && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                  <p className="font-semibold">
                    Some medicines in your cart require a prescription to proceed.
                  </p>
                </div>
              )}

              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClearCart}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition"
                >
                  Clear Cart
                </button>
              </div>

              {items.map((item) => {
                // Safe price calculation with fallback
                const price = item.price || 0;
                const quantity = item.quantity || 0;
                const totalPrice = price * quantity;

                return (
                  <div
                    key={item._id}
                    className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6 w-full md:w-2/3">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={item.image || "/default-medicine.jpg"}
                          alt={item.name || "Medicine"}
                          layout="fill"
                          objectFit="cover"
                          priority
                        />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {item.name || "Unknown Product"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Unit Price: ${price.toFixed(2)}
                        </p>
                        <p className="text-sm text-teal-600 font-semibold">
                          Total: ${totalPrice.toFixed(2)}
                        </p>

                        {item.prescriptionRequired && (
                          <p className="text-sm text-red-600 font-semibold">
                            * Prescription Required
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex gap-5 items-center">
                        <label
                          htmlFor={`quantity-${item._id}`}
                          className="text-sm text-gray-700 mb-2 font-semibold"
                        >
                          Quantity
                        </label>
                        <input
                          id={`quantity-${item._id}`}
                          type="number"
                          min="1"
                          max={item.stockQuantity || 99}
                          value={quantity}
                          onChange={(e) =>
                            handleQuantityChange(item._id!, Number(e.target.value))
                          }
                          className="w-24 text-center rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        />
                      </div>

                      <button
                        onClick={() => handleRemove(item._id!)}
                        className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between items-center border-t-2 border-gray-300 pt-8 mt-12">
                <h2 className="text-3xl font-bold text-gray-800">
                  Total: ${total.toFixed(2)}
                </h2>
                <Link
                  href="/checkout"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-full shadow-lg font-semibold transition"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;