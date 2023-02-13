import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import dataReducer from "./Slices/DataSlice";
import modalReducer from "./Slices/ModalSlice";
import tabReducer from "./Slices/TabSlice";

const Store = configureStore({
  reducer: {
    dataReducer,
    modalReducer,
    tabReducer,
  },
});

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootStoreI = ReturnType<typeof Store.getState>;

export default Store;
