import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";

const persistConfig = {
  key: "root",
  storage,
};

const combinedReducers = combineReducers({
  auth: authReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
combineReducers;
