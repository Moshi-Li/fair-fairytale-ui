import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import animationReducer from "./Slices/AnimationSlice";
import dataReducer from "./Slices/DataSlice";

const Store = configureStore({
  reducer: {
    animationReducer,
    dataReducer,
  },
});

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootStoreI = ReturnType<typeof Store.getState>;

export default Store;
