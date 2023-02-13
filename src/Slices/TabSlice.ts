import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataI {
  selectedEventVerbStart: number | null;
}

const dataDefaultState: DataI = {
  selectedEventVerbStart: null,
};

export const modalSlice = createSlice({
  name: "modalSlice",
  initialState: dataDefaultState,
  reducers: {
    setSelectedEventVerbStart: (
      state: DataI,
      action: PayloadAction<number | null>
    ) => {
      state.selectedEventVerbStart = action.payload;
    },
  },
});

export const { setSelectedEventVerbStart } = modalSlice.actions;
export default modalSlice.reducer;
