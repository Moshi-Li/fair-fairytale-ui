import storyOne from "./ali-baba-and-forty-thieves";
import storyTwo from "./bamboo-cutter-moon-child";

const processStoryMeta = (meta: any) => {
  const data = meta[`events`];
  if (data[`top_events`][`female`]) {
    data[`top_events`][`female`] = data[`top_events`][`female`].map(
      (item: any) => ({
        event_lemma: item[`event_lemma`],
        argument: item[`argument`],
        odds: item[`female_male_odds`],
      })
    );
  }
  if (data[`top_events`][`male`]) {
    data[`top_events`][`male`] = data[`top_events`][`male`].map(
      (item: any) => ({
        event_lemma: item[`event_lemma`],
        argument: item[`argument`],
        odds: item[`male_female_odds`],
      })
    );
  }
  if (data[`top_events`][`unbiased`]) {
    data[`top_events`][`unbiased`] = data[`top_events`][`unbiased`].map(
      (item: any) => ({
        event_lemma: item[`event_lemma`],
        argument: item[`argument`],
        odds: item[`male_female_odds`],
      })
    );
  }

  return data;
};

const processCharacterMeta = (characters: any) => {
  const result: any = {};
  characters.forEach((character: any) => {
    const { coref_idx, total } = character;
    result[coref_idx] = {
      ...character,
      total: parseInt(total),
      coref_id: coref_idx,
    };
  });

  return result;
};

const processEventMeta = (events: any) => {
  console.log(typeof events);
  const result: any = {};
  Object.keys(events).forEach((key) => {
    Object.keys(events[key][`event_occurances`]).forEach((location) => {
      result[`${location.split(":")[0]}+${location.split(":")[1]}`] = {
        key,
        ...events[key],
      };
    });
  });

  return result;
};

const processEventList = (events: any, paragraph: string) => {
  const result = events.map(
    ({
      event_id,
      event,
      argument,

      verb_start_byte_text,
      verb_end_byte_text,

      coref_id,
      arg_start_byte_text,
      arg_end_byte_text,

      gender,
      gender_certainty,

      temporal_rank,
      sentence_id,
    }: any) => ({
      event_id,
      event,

      verb_start_byte_text: parseInt(verb_start_byte_text),
      verb_end_byte_text: parseInt(verb_end_byte_text),

      coref_id,
      argument,
      arg_start_byte_text: parseInt(arg_start_byte_text),
      arg_end_byte_text: parseInt(arg_end_byte_text),
      arg_text: paragraph.slice(
        parseInt(arg_start_byte_text),
        parseInt(arg_end_byte_text)
      ),

      gender,
      gender_certainty,
      temporal_rank: parseInt(temporal_rank),
      sentence_id,
    })
  );

  return result;
};

const result: any = [storyOne, storyTwo];
const Data: any = {};

result.forEach((item: any) => {
  const {
    storyMeta,
    characterMeta,
    eventMeta,
    eventMajorList,
    paragraph,
    name,
  } = item;

  Data[name] = {
    ...item,
    storyMeta: processStoryMeta(storyMeta),
    characterMeta: processCharacterMeta(characterMeta),
    eventMeta: processEventMeta(eventMeta),
    eventMajorList: processEventList(eventMajorList, paragraph),
  };
});

export const processStory = (story: any) => {
  const { storyMeta, characterMeta, eventMeta, eventMajorList, paragraph } =
    story;

  return {
    ...story,
    storyMeta: processStoryMeta(storyMeta),
    characterMeta: processCharacterMeta(characterMeta),
    eventMeta: processEventMeta(eventMeta),
    eventMajorList: processEventList(eventMajorList, paragraph),
  };
};

export default Data;
