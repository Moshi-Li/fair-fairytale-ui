import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import animationReducer from "./Slices/AnimationSlice";

const Store = configureStore({
  reducer: {
    animationReducer,
  },
});

export type RootStoreI = ReturnType<typeof Store.getState>;

export default Store;
