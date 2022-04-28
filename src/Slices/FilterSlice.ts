import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { RootStoreI } from "../Store";
import { OccurrenceI } from "./DataSlice";

interface FilterStateI {
  filterKey: "gender" | "race" | "";
  filteredOccurrences: Record<string | number, OccurrenceI[]>;
}

const dataDefaultState: FilterStateI = {
  filterKey: "",
  filteredOccurrences: {},
};

export const updateFilterKey = createAsyncThunk<
  {
    nextFilteredOccurrences: Record<string | number, OccurrenceI[]>;
    key: "gender" | "race" | "";
  },
  "gender" | "race" | "",
  { state: RootStoreI }
>("filterSlice/updateFilterKey", async (key, thunkAPI) => {
  const { occurrences } = thunkAPI.getState().dataReducer.characters;
  const { personalInformation } = thunkAPI.getState().dataReducer.people;
  const { occurrenceMap } = thunkAPI.getState().dataReducer;

  const nextFilteredOccurrences: Record<string | number, OccurrenceI[]> = {};

  try {
    if (key) {
      occurrences.forEach((character) => {
        const values = character.correspondingOccurrenceIds.map((personId) => {
          const { originalText } = occurrenceMap[personId];
          const value = personalInformation[originalText][key];
          return value;
        });

        const uniqueValues = values.filter((c, index) => {
          return values.indexOf(c) === index;
        });

        if (uniqueValues.length > 1) {
          if (!nextFilteredOccurrences["combined"]) {
            nextFilteredOccurrences["combined"] = [];
          }
          nextFilteredOccurrences["combined"].push(character);
        } else if (uniqueValues.length === 1) {
          if (!nextFilteredOccurrences[values[0]]) {
            nextFilteredOccurrences[values[0]] = [];
          }
          nextFilteredOccurrences[values[0]].push(character);
        }
      });
    }
  } catch (e) {
    console.log(e);
  }

  return { key, nextFilteredOccurrences };
});

export const filterSlice = createSlice({
  name: "filterSlice",
  initialState: dataDefaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateFilterKey.fulfilled, (state, action) => {
      const { key, nextFilteredOccurrences } = action.payload;

      state.filterKey = key;
      state.filteredOccurrences = nextFilteredOccurrences;
    });
  },
});

export default filterSlice.reducer;
