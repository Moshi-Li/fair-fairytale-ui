import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootStoreI } from "../Store";
import { rawData as Data } from "../MockData";

export interface PersonalInformationI {
  [key: string | number]: {
    name: string;
    gender: "male" | "female";
    race: "foo" | "non-foo";
    age: number;

    // occurrenceId could be traced and generated from occurrences.
    occurrenceIds: number[];
  };
}

interface RawDataI {
  paragraph: string;
  people: {
    personalInformation: PersonalInformationI;
    occurrences: OccurrenceI[];
  };
  characters: {
    occurrences: OccurrenceI[];
  };
}

interface DataI extends RawDataI {
  occurrenceMap: Record<string | number, OccurrenceI>;
  occurrenceList: OccurrenceI[];
  sourced: boolean;
  fetching: boolean;
}

export interface OccurrenceI {
  id: number;
  type: string;
  occurrenceText: string;
  occurrenceTextLength?: number;
  startIndex: number;

  // nextOccurrenceId is used to generate graph
  nextOccurrenceId: number[];

  //name of the character for person occurrence
  //original text of character for character occurrence
  originalText: string;

  //Ids of corresponding person for character occurrence
  //Ids of corresponding character for person occurrence
  correspondingOccurrenceIds: number[];
}

const dataDefaultState: DataI = {
  paragraph: "",
  people: { personalInformation: {}, occurrences: [] },
  characters: {
    occurrences: [],
  },
  occurrenceMap: {},
  occurrenceList: [],
  sourced: false,
  fetching: false,
};

export const fetchData = createAsyncThunk<
  RawDataI,
  string,
  { state: RootStoreI }
>("dataSlice/fetchData", async (text, thunkAPI) => {
  const res: RawDataI = await new Promise((resolve) =>
    setTimeout(() => resolve(JSON.parse(JSON.stringify(Data))), 1000)
  );

  return res;
});

export const dataSlice = createSlice({
  name: "dataSlice",
  initialState: dataDefaultState,
  reducers: {
    sourceData: (state: DataI, action: PayloadAction<void>) => {
      state.occurrenceList = [];
      state.occurrenceMap = {};

      state.people.occurrences.forEach((item: OccurrenceI) => {
        item.occurrenceTextLength = item.occurrenceText.length;

        state.occurrenceList.push(item);

        if (state.occurrenceMap) state.occurrenceMap[item.id] = item;

        state.people.personalInformation[item.originalText].occurrenceIds.push(
          item.id
        );
      });

      state.characters.occurrences.forEach((item: OccurrenceI) => {
        item.occurrenceTextLength = item.occurrenceText.length;
        state.occurrenceList?.push(item);
        if (state.occurrenceMap) state.occurrenceMap[item.id] = item;
      });

      state.characters.occurrences.forEach((item: OccurrenceI) => {
        item.correspondingOccurrenceIds.forEach((id: number) => {
          if (state.occurrenceMap)
            state.occurrenceMap[id].correspondingOccurrenceIds.push(item.id);
        });
      });

      state.occurrenceList.sort(
        (a: OccurrenceI, b: OccurrenceI) => a.startIndex - b.startIndex
      );

      state.sourced = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.characters = { occurrences: [] };
      state.people = { personalInformation: {}, occurrences: [] };
      state.occurrenceList = [];
      state.occurrenceMap = {};

      state.paragraph = "";
      state.fetching = true;
      state.sourced = false;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.characters = action.payload.characters;
      state.people = action.payload.people;
      state.paragraph = action.payload.paragraph;

      state.occurrenceList = [];
      state.occurrenceMap = {};

      state.people.occurrences.forEach((item: OccurrenceI) => {
        item.occurrenceTextLength = item.occurrenceText.length;

        state.occurrenceList.push(item);

        if (state.occurrenceMap) state.occurrenceMap[item.id] = item;

        state.people.personalInformation[item.originalText].occurrenceIds.push(
          item.id
        );
      });

      state.characters.occurrences.forEach((item: OccurrenceI) => {
        item.occurrenceTextLength = item.occurrenceText.length;
        state.occurrenceList?.push(item);
        if (state.occurrenceMap) state.occurrenceMap[item.id] = item;
      });

      state.characters.occurrences.forEach((item: OccurrenceI) => {
        item.correspondingOccurrenceIds.forEach((id: number) => {
          if (state.occurrenceMap)
            state.occurrenceMap[id].correspondingOccurrenceIds.push(item.id);
        });
      });

      state.occurrenceList.sort(
        (a: OccurrenceI, b: OccurrenceI) => a.startIndex - b.startIndex
      );

      state.sourced = true;
      state.fetching = false;
    });
    builder.addCase(fetchData.rejected, (state, action) => {});
  },
});

export const { sourceData } = dataSlice.actions;
export default dataSlice.reducer;
