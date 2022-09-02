import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataI {
  open: boolean;
  selectedEventKey: string;
}

const dataDefaultState: DataI = {
  open: false,
  selectedEventKey: "",
};

export const modalSlice = createSlice({
  name: "modalSlice",
  initialState: dataDefaultState,
  reducers: {
    openModal: (
      state: DataI,
      action: PayloadAction<{
        targetEventKey: string;
      }>
    ) => {
      state.open = true;
      state.selectedEventKey = action.payload.targetEventKey;
    },
    closeModal: (state: DataI, action: PayloadAction<void>) => {
      state.open = false;
      state.selectedEventKey = "";
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
