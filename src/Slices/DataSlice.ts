import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rawData as Data } from "../MockData";
interface RawDataI {
  paragraph: string;
  people: {
    personalInformation: {
      [key: string | number]: {
        name: string;
        gender: "male" | "female";
        race: "foo" | "non-foo";
        age: number;

        // occurrenceId could be traced and generated from occurrences.
        occurrenceIds: number[];
      };
    };
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
  ...Data,
  occurrenceMap: {},
  occurrenceList: [],
  sourced: false,
};

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
});

export const { sourceData } = dataSlice.actions;
export default dataSlice.reducer;
