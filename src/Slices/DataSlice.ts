import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import camelcaseKeys from "camelcase-keys";
import { Store as notificationStore } from "react-notifications-component";

import { RootStoreI } from "../Store";
import { processStory } from "../Data";
import Axios from "axios";

export interface TextOccurrenceI {
  type: string;
  occurrenceText: string;

  textStartIndex: number;
  textEndIndex: number;
  textLength: number;
  targetEventKey: string | undefined;

  // nextOccurrenceId is used to generate graph
  //nextOccurrenceId: number[];

  //name of the character for person occurrence
  //original text of character for character occurrence
  //originalText: string;

  //TextStartIndexes of corresponding TextOccurrenceI for character occurrence
  //TextStartIndexes of corresponding TextOccurrenceI for person occurrence
  associatedStartIndex: number[];
}

export interface StoryMetaCountI {
  directObject: number;
  gender: string;
  importance: string;
  subject: number;
  total: number;
}

export interface StoryMetaTopEventI {
  argument: string;
  eventLemma: string;
  odds: number;
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
  relatedEvents?: EventI[];
}

export interface EventMetaI {
  eventN: string;
  femaleEventN: string;
  maleEventN: string;
  [`group/nonbinaryEventN`]: string;
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

interface RawDataI {
  characterMeta: Record<string | number, CharacterMetaI>;
  eventMeta: Record<string, EventMetaI>;
  storyMeta: {
    counts: StoryMetaCountI[];
    topEvents: Record<string, StoryMetaTopEventI[]>;
  };
  eventMajorList: EventI[];
  paragraph: string;
}

interface DataI extends RawDataI {
  sourced: boolean;
  fetching: boolean;
  serverStatus: number;
}

export interface CharacterStatI {
  name: string;
  gender: string;
  importance: string;
  appearance: number;
  corefId: string;
}

const dataDefaultState: DataI = {
  storyMeta: { counts: [], topEvents: {} },
  characterMeta: {},
  eventMeta: {},
  eventMajorList: [],
  paragraph: "",

  sourced: false,
  fetching: false,
  serverStatus: 0,
};

//const API_URL = "http://192.168.0.12:8000";
const API_URL = "https://d3tvz53x8u8tnu.cloudfront.net";

export const fetchData = createAsyncThunk<
  RawDataI,
  string,
  { state: RootStoreI }
>("dataSlice/fetchData", async (storyName, thunkAPI) => {
  const urlGenerator = (storyName: string, fileName: string) =>
    `https://fairytale-examples.s3.amazonaws.com/${storyName}/${storyName}.${fileName}`;

  const storyMeta = (
    await Axios.get(urlGenerator(storyName, "story_statistics.json"))
  ).data;

  const characterMeta = (
    await Axios.get(urlGenerator(storyName, "character_attributes.json"))
  ).data;

  const eventMeta = (
    await Axios.get(urlGenerator(storyName, "events_major_statistics.json"))
  ).data;

  const eventMajorList = (
    await Axios.get(
      urlGenerator(storyName, "major_characters_temporal_events.json")
    )
  ).data;

  const paragraph = (await Axios.get(urlGenerator(storyName, "txt"))).data;

  let result = {};

  try {
    let rawData = processStory({
      name: storyName,
      storyMeta,
      characterMeta,
      eventMeta,
      eventMajorList,
      paragraph,
    });
    result = camelcaseKeys(rawData, { deep: true });
  } catch (e) {
    console.log(e);
  }
  return result as RawDataI;
});

export const runPipeline = createAsyncThunk<
  RawDataI,
  string,
  { state: RootStoreI }
>("dataSlice/runPipeline", async (storyInput, thunkAPI) => {
  try {
    const response = await Axios.post(`${API_URL}/result`, {
      story_content: storyInput,
    });
    const storyMeta = response.data.story_statistics;

    const characterMeta = response.data.character_attributes;

    const eventMeta = response.data.events_major_statistics;

    const eventMajorList = response.data.major_characters_temporal_events;

    const paragraph = response.data.paragraph;

    let rawData = processStory({
      name: "User input story",
      storyMeta,
      characterMeta,
      eventMeta,
      eventMajorList,
      paragraph,
    });
    let result = camelcaseKeys(rawData, { deep: true });
    return result as RawDataI;
  } catch (e) {
    throw e;
  }
});

export const checkServerStatus = createAsyncThunk<
  number,
  void,
  { state: RootStoreI }
>("dataSlice/checkServerStatus", async (args, thunkAPI) => {
  try {
    const { data } = await Axios.get(`${API_URL}/status`);
    return data.taskStartTime;
  } catch (e) {
    return 0;
  }
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
      state.storyMeta = { counts: [], topEvents: {} };
      state.characterMeta = {};
      state.eventMeta = {};
      state.eventMajorList = [];
      state.paragraph = "";
      state.fetching = true;
      state.sourced = false;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const { storyMeta, characterMeta, eventMeta, eventMajorList, paragraph } =
        action.payload;

      Object.keys(characterMeta).forEach((key: string) => {
        characterMeta[key].relatedEvents = [];
      });

      eventMajorList.forEach((item) => {
        const { corefId } = item;

        if (characterMeta[corefId]) {
          characterMeta[corefId].relatedEvents?.push(item);
        }
      });

      state.storyMeta = storyMeta;
      state.characterMeta = characterMeta;
      state.eventMeta = eventMeta;
      state.eventMajorList = eventMajorList;

      state.paragraph = paragraph;
      state.sourced = true;
      state.fetching = false;
    });
    builder.addCase(fetchData.rejected, (state, action) => {
      state.fetching = false;
      state.sourced = false;
      notificationStore.addNotification({
        message: "Request Failed, check console for more info",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          onScreen: true,
        },
        width: 600,
      });
    });

    //Run pipeline
    builder.addCase(runPipeline.pending, (state, action) => {
      state.storyMeta = { counts: [], topEvents: {} };
      state.characterMeta = {};
      state.eventMeta = {};
      state.eventMajorList = [];
      state.paragraph = "";

      state.fetching = true;
      state.sourced = false;
    });

    builder.addCase(runPipeline.fulfilled, (state, action) => {
      const { storyMeta, characterMeta, eventMeta, eventMajorList, paragraph } =
        action.payload;

      Object.keys(characterMeta).forEach((key: string) => {
        characterMeta[key].relatedEvents = [];
      });

      eventMajorList.forEach((item) => {
        const { corefId } = item;
        if (characterMeta[corefId]) {
          characterMeta[corefId].relatedEvents?.push(item);
        }
      });

      state.storyMeta = storyMeta;
      state.characterMeta = characterMeta;
      state.eventMeta = eventMeta;
      state.eventMajorList = eventMajorList;

      state.paragraph = paragraph;
      state.sourced = true;
      state.fetching = false;
    });

    builder.addCase(runPipeline.rejected, (state, action) => {
      state.storyMeta = { counts: [], topEvents: {} };
      state.characterMeta = {};
      state.eventMeta = {};
      state.eventMajorList = [];
      state.paragraph = "";

      state.fetching = false;
      state.sourced = false;
      notificationStore.addNotification({
        message: "Request Failed, check console for more info",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 10000,
          onScreen: true,
        },
        width: 600,
      });
    });

    builder.addCase(checkServerStatus.fulfilled, (state, action) => {
      state.serverStatus = action.payload;
    });
    builder.addCase(checkServerStatus.rejected, (state, action) => {
      state.serverStatus = 0;
    });
  },
});

export const { sourceData } = dataSlice.actions;
export default dataSlice.reducer;
