import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { RootStoreI } from "../Store";
import rawData from "../Data";

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
export interface TextOccurrenceI {
  type: string;
  occurrenceText: string;

  textStartIndex: number;
  textEndIndex: number;
  textLength: number;

  // nextOccurrenceId is used to generate graph
  //nextOccurrenceId: number[];

  //name of the character for person occurrence
  //original text of character for character occurrence
  //originalText: string;

  //Ids of corresponding person for character occurrence
  //Ids of corresponding character for person occurrence
  associatedStartIndex: number;
  associatedEndIndex: number;
}

export interface CharacterMetaI {
  corefId: string;
  clusteredNames: string;
  nameMentions: number;
  pronounMentions: number;
  total: number;
  easyName: string;
  gender: string;
  genderCertainty: number;
  importance: string;
  eventN: number;
  directObjectN: number;
  subjectN: number;
}

export interface EventI {
  eventId: string;
  event: string;
  argument: string;
  argText: string;

  verbStartByteText: number;
  verbEndByteText: number;

  corefId: string;
  argStartByteText: number;
  argEndByteText: number;

  gender: string;
  genderCertainty: number;

  temporalRank: number;
  sentenceId: string;
}

export interface EventSalientInfoI {
  sentenceId: string;
  eventId: string;
  temporalRank: number;
}

interface RawDataI {
  paragraph: string;
  characterMeta: Record<string | number, CharacterMetaI>;
  eventList: EventI[];
  eventSalientInfo: EventSalientInfoI[];
}

interface DataI extends RawDataI {
  textOccurrenceMap: Record<string | number, TextOccurrenceI>;
  sourced: boolean;
  fetching: boolean;
}

const dataDefaultState: DataI = {
  paragraph: "",
  characterMeta: {},
  eventList: [],
  eventSalientInfo: [],
  textOccurrenceMap: {},
  sourced: false,
  fetching: false,
};

export const fetchData = createAsyncThunk<
  RawDataI,
  string,
  { state: RootStoreI }
>("dataSlice/fetchData", async (text, thunkAPI) => {
  const res: any = await new Promise((resolve) =>
    setTimeout(() => resolve(JSON.parse(JSON.stringify(rawData))), 1000)
  );

  return camelcaseKeys(res, { deep: true }) as RawDataI;
});

export const dataSlice = createSlice({
  name: "dataSlice",
  initialState: dataDefaultState,
  reducers: {
    sourceData: (state: DataI, action: PayloadAction<void>) => {
      state.sourced = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.paragraph = "";
      state.characterMeta = {};
      state.eventList = [];
      state.eventSalientInfo = [];
      state.textOccurrenceMap = {};

      state.fetching = true;
      state.sourced = false;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const { characterMeta, eventList, paragraph, eventSalientInfo } =
        action.payload;

      state.paragraph = paragraph;
      state.eventList = eventList;
      state.characterMeta = characterMeta;
      state.eventSalientInfo = eventSalientInfo;
      eventList.forEach(
        ({
          event,
          verbStartByteText,
          verbEndByteText,
          argText,
          argStartByteText,
          argEndByteText,
        }) => {
          state.textOccurrenceMap[verbStartByteText] = {
            type: "event",
            occurrenceText: event,

            textStartIndex: verbStartByteText,
            textEndIndex: verbEndByteText,
            textLength: verbEndByteText - verbStartByteText,

            associatedStartIndex: argStartByteText,
            associatedEndIndex: argEndByteText,
          };
          state.textOccurrenceMap[argStartByteText] = {
            type: "character",
            occurrenceText: argText,

            textStartIndex: argStartByteText,
            textEndIndex: argEndByteText,
            textLength: argEndByteText - argStartByteText,

            associatedStartIndex: verbStartByteText,
            associatedEndIndex: verbEndByteText,
          };
        }
      );

      state.sourced = true;
      state.fetching = false;
    });
    builder.addCase(fetchData.rejected, (state, action) => {});
  },
});

export const { sourceData } = dataSlice.actions;
export default dataSlice.reducer;
