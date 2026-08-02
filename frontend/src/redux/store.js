// Redux store with selective persistence — only product state (cart, wishlist, addresses) is persisted.
// User state is intentionally NOT persisted: the server session (HttpOnly cookie) is the source of truth.

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Only persist product state (cart, wishlist, addresses).
// User auth state is re-validated server-side on every app load.
const persistConfig = {
  key: "Ekart",
  version: 1,
  storage: storage.default || storage,
  whitelist: ["product"], // ← user slice intentionally excluded
};

const rootReducer = combineReducers({
  user:    userReducer,
  product: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
