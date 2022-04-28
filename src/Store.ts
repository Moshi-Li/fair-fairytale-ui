import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import animationReducer from "./Slices/AnimationSlice";
import dataReducer from "./Slices/DataSlice";
import filterReducer from "./Slices/FilterSlice";

const Store = configureStore({
  reducer: {
    animationReducer,
    dataReducer,
    filterReducer,
  },
});

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootStoreI = ReturnType<typeof Store.getState>;

export default Store;
