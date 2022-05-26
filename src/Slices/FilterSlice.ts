import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { RootStoreI } from "../Store";
import { OccurrenceI } from "./DataSlice";

interface FilterStateI {
  filterKey: "gender" | "race" | "";
  filteredOccurrences: Record<string | number, OccurrenceI[]>;
  occurrenceHighlightColor: Record<string | number, string>;
}

const dataDefaultState: FilterStateI = {
  filterKey: "",
  filteredOccurrences: {},
  occurrenceHighlightColor: {},
};

const rndHex = () =>
  "#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);

const blendHexColors = (color1: any, color2: any, percentage: number = 0.5) => {
  const int_to_hex = (num: number) => {
    var hex = Math.round(num).toString(16);
    if (hex.length === 1) hex = "0" + hex;
    return hex;
  };
  // check input
  color1 = color1 || "#000000";
  color2 = color2 || "#ffffff";

  // 1: validate input, make sure we have provided a valid hex
  if (color1.length !== 4 && color1.length !== 7)
    throw new Error("colors must be provided as hexes");

  if (color2.length !== 4 && color2.length !== 7)
    throw new Error("colors must be provided as hexes");

  if (percentage > 1 || percentage < 0)
    throw new Error("percentage must be between 0 and 1");

  // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
  //      the three character hex is just a representation of the 6 hex where each character is repeated
  //      ie: #060 => #006600 (green)
  if (color1.length === 4)
    color1 =
      color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
  else color1 = color1.substring(1);
  if (color2.length === 4)
    color2 =
      color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
  else color2 = color2.substring(1);

  //console.log("valid: c1 => " + color1 + ", c2 => " + color2);

  // 3: we have valid input, convert colors to rgb
  color1 = [
    parseInt(color1[0] + color1[1], 16),
    parseInt(color1[2] + color1[3], 16),
    parseInt(color1[4] + color1[5], 16),
  ];
  color2 = [
    parseInt(color2[0] + color2[1], 16),
    parseInt(color2[2] + color2[3], 16),
    parseInt(color2[4] + color2[5], 16),
  ];

  // 4: blend
  var color3: any = [
    (1 - percentage) * color1[0] + percentage * color2[0],
    (1 - percentage) * color1[1] + percentage * color2[1],
    (1 - percentage) * color1[2] + percentage * color2[2],
  ];

  //console.log("c3 => [" + color3.join(", ") + "]");

  // 5: convert to hex
  color3 =
    "#" + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

  // return hex
  return color3;
};

export const updateFilterKey = createAsyncThunk<
  {
    nextOccurrenceHighlightColor: Record<string | number, string>;
    nextFilteredOccurrences: Record<string | number, OccurrenceI[]>;
    filterKey: "gender" | "race" | "";
  },
  "gender" | "race" | "",
  { state: RootStoreI }
>("filterSlice/updateFilterKey", async (filterKey, thunkAPI) => {
  const { characters, occurrenceMap } = thunkAPI.getState().dataReducer;
  const { personalInformation } = thunkAPI.getState().dataReducer.people;

  const nextFilteredOccurrences: Record<string | number, OccurrenceI[]> = {};
  const nextOccurrenceHighlightColor: Record<string | number, string> = {};

  try {
    //Generate sorted characters.
    if (filterKey) {
      characters.occurrences.forEach((character) => {
        const values = character.correspondingOccurrenceIds.map((personId) => {
          const { originalText } = occurrenceMap[personId];
          const value = personalInformation[originalText][filterKey];
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

      //Generate colors.
      const colorTable: Record<string, string> = {};
      let blended: undefined | string = undefined;
      Object.keys(nextFilteredOccurrences).forEach((key) => {
        if (key !== "combined") {
          colorTable[key] = rndHex();
          if (blended) {
            blended = blendHexColors(colorTable[key], blended);
          } else {
            blended = colorTable[key];
          }
        }
      });
      if (blended) {
        colorTable["combined"] = blended;
      }

      //Assign colors
      Object.keys(nextFilteredOccurrences).forEach((key) => {
        nextFilteredOccurrences[key].forEach((occurrence) => {
          nextOccurrenceHighlightColor[occurrence.id] = colorTable[key];
          occurrence.correspondingOccurrenceIds.forEach((correspondingId) => {
            nextOccurrenceHighlightColor[correspondingId] =
              colorTable[
                personalInformation[
                  occurrenceMap[correspondingId].originalText
                ][filterKey]
              ];
          });
        });
      });
    }
  } catch (e) {
    console.log(e);
  }

  return { filterKey, nextFilteredOccurrences, nextOccurrenceHighlightColor };
});

export const filterSlice = createSlice({
  name: "filterSlice",
  initialState: dataDefaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateFilterKey.fulfilled, (state, action) => {
      const {
        filterKey,
        nextFilteredOccurrences,
        nextOccurrenceHighlightColor,
      } = action.payload;

      state.filterKey = filterKey;
      state.filteredOccurrences = nextFilteredOccurrences;
      state.occurrenceHighlightColor = nextOccurrenceHighlightColor;
    });
  },
});

export default filterSlice.reducer;
