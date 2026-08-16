import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import cartReducer from './features/cart/cartSlice';
import orderReducer from './features/order/orderSlice';
import medicineReducer from './features/medicine/medicineSlice';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';        // 👤 Single logged-in user
import allUserReducer from './features/allUsers/allUserSlice';  // 👥 All users
import { baseApi } from './api/baseApi';

// Persist configs
const authPersistConfig = {
  key: 'auth',
  storage,
};

const cartPersistConfig = {
  key: 'cart',
  storage,
};

const ordersPersistConfig = {
  key: 'orders',
  storage,
};

const medicinePersistConfig = {
  key: 'medicines',
  storage,
};

const userPersistConfig = {
  key: 'user',
  storage,
};

// Persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedOrdersReducer = persistReducer(ordersPersistConfig, orderReducer);
const persistedMedicineReducer = persistReducer(medicinePersistConfig, medicineReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
// Note: allUsers is intentionally NOT persisted — it holds admin-only PII
// (all users' names/emails/phones/addresses) and must never survive in
// localStorage across sessions or user switches.

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    orders: persistedOrdersReducer,
    medicines: persistedMedicineReducer,
    user: persistedUserReducer,   // 👤 Persisted single user
    allUsers: allUserReducer,     // 👥 NOT persisted (admin-only PII)
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
