import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Data from "../MockData";

const { occurrenceMap } = Data;

export interface AnimationStateI {
  animatedOccurrence: Record<string | number, boolean>;
  animationType: string;
}

export const animationDefaultState: AnimationStateI = {
  animatedOccurrence: {},
  animationType: "self",
};

export const animationSlice = createSlice({
  name: "animationSlice",
  initialState: animationDefaultState,
  reducers: {
    updateAnimationType: (
      state: AnimationStateI,
      action: PayloadAction<string>
    ) => {
      state.animationType = action.payload;
    },
    updateAnimationOccurrences: (
      state: AnimationStateI,
      action: PayloadAction<string | number>
    ) => {
      state.animatedOccurrence = {};
      state.animatedOccurrence[action.payload] = true;
      if (
        state.animationType === "relative" &&
        occurrenceMap[action.payload] !== undefined
      ) {
        occurrenceMap[action.payload].correspondingOccurrenceIds.forEach(
          (id) => {
            state.animatedOccurrence[id] = true;
          }
        );
      }
    },
  },
});

export const { updateAnimationType, updateAnimationOccurrences } =
  animationSlice.actions;
export default animationSlice.reducer;
