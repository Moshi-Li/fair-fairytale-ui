import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootStoreI } from "../Store";
import { OccurrenceI } from "../Slices/DataSlice";

export interface AnimationStateI {
  animatedOccurrence: Record<string | number, boolean>;
  animationType: string;
}

const animationDefaultState: AnimationStateI = {
  animatedOccurrence: {},
  animationType: "self",
};

export const updateAnimationOccurrences = createAsyncThunk<
  { occurrenceMap: Record<string | number, OccurrenceI>; id: number | string },
  number | string,
  { state: RootStoreI }
>("animationSlice/updateAnimationOccurrences", async (id, thunkAPI) => {
  const { occurrenceMap } = thunkAPI.getState().dataReducer;
  return { occurrenceMap, id };
});

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
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(updateAnimationOccurrences.fulfilled, (state, action) => {
      // Add user to the state array

      const { occurrenceMap, id } = action.payload;

      state.animatedOccurrence = {};
      state.animatedOccurrence[id] = true;

      if (occurrenceMap[id] !== undefined) {
        occurrenceMap[id].correspondingOccurrenceIds.forEach((childId) => {
          state.animatedOccurrence[childId] = true;
        });
      }
    });
  },
});

export const { updateAnimationType } = animationSlice.actions;
export default animationSlice.reducer;
