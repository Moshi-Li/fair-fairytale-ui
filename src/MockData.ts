const Data = {
  paragraph:
    "Once upon a time in Snow White’s multiverse, there was a hunter. He was commanded by the Dark Queen to murder the princess. Although the hunter is good at hunting, he had no intention to kill the princess and aimed to save the princess. As a result, the princess was never kidnapped or saved. And in the end, the princess baked a cake the night before the wedding while trying to stop crying. During a sunny afternoon, she and he, wearing clothes, married.",
  people: {
    personalInformation: {
      princess: {
        name: "princess",
        gender: "female",
        race: "foo",
        age: 1,
        occurrenceIds: [],
      },
      hunter: {
        name: "hunter",
        gender: "male",
        race: "foo",
        age: 1,
        occurrenceIds: [],
      },
    },
    occurrences: [
      {
        id: 0,
        type: "character",
        occurrenceText: "hunter",
        startIndex: 57,
        nextOccurrenceId: [],
        originalText: "hunter",
        correspondingOccurrenceIds: [],
      },
      {
        id: 1,
        type: "character",
        occurrenceText: "He",
        startIndex: 65,
        nextOccurrenceId: [],
        originalText: "hunter",
        correspondingOccurrenceIds: [],
      },
      {
        id: 2,
        type: "character",
        occurrenceText: "princess",
        startIndex: 114,
        nextOccurrenceId: [],
        originalText: "princess",
        correspondingOccurrenceIds: [],
      },
      {
        id: 3,
        type: "character",
        occurrenceText: "hunter",
        startIndex: 137,
        nextOccurrenceId: [],
        originalText: "hunter",
        correspondingOccurrenceIds: [],
      },
      {
        id: 6,
        type: "character",
        occurrenceText: "princess",
        startIndex: 196,
        nextOccurrenceId: [],
        originalText: "princess",
        correspondingOccurrenceIds: [],
      },
      {
        id: 8,
        type: "character",
        occurrenceText: "princess",
        startIndex: 227,
        nextOccurrenceId: [],
        originalText: "princess",
        correspondingOccurrenceIds: [],
      },
      {
        id: 9,
        type: "character",
        occurrenceText: "princess",
        startIndex: 254,
        nextOccurrenceId: [],
        originalText: "princess",
        correspondingOccurrenceIds: [],
      },
      {
        id: 12,
        type: "character",
        occurrenceText: "princess",
        startIndex: 313,
        nextOccurrenceId: [],
        originalText: "princess",
        correspondingOccurrenceIds: [],
      },
      {
        id: 15,
        type: "character",
        occurrenceText: "she",
        startIndex: 419,
        nextOccurrenceId: [],
        originalText: "princess",
        correspondingOccurrenceIds: [],
      },
      {
        id: 16,
        type: "character",
        occurrenceText: "he",
        startIndex: 427,
        nextOccurrenceId: [],
        originalText: "hunter",
        correspondingOccurrenceIds: [],
      },
    ],
  },

  characters: {
    occurrences: [
      {
        id: 4,
        type: "event",
        occurrenceText: "hunting",
        startIndex: 155,
        nextOccurrenceId: [17],

        originalText: "hunt",
        correspondingOccurrenceIds: [3],
      },
      {
        id: 5,
        type: "event",
        occurrenceText: "kill",
        startIndex: 187,
        nextOccurrenceId: [7],

        originalText: "kill",
        correspondingOccurrenceIds: [6],
      },
      {
        id: 7,
        type: "event",
        occurrenceText: "save",
        startIndex: 218,
        nextOccurrenceId: [17],

        originalText: "save",
        correspondingOccurrenceIds: [8],
      },
      {
        id: 10,
        type: "event",
        occurrenceText: "kidnapped",
        startIndex: 273,
        nextOccurrenceId: [11],

        originalText: "kidnap",
        correspondingOccurrenceIds: [9],
      },
      {
        id: 11,
        type: "event",
        occurrenceText: "saved",
        startIndex: 286,
        nextOccurrenceId: [13],

        originalText: "save",
        correspondingOccurrenceIds: [],
      },
      {
        id: 13,
        type: "event",
        occurrenceText: "baked",
        startIndex: 322,
        nextOccurrenceId: [17],

        originalText: "bake",
        correspondingOccurrenceIds: [12],
      },
      {
        id: 14,
        type: "event",
        occurrenceText: "crying",
        startIndex: 385,
        nextOccurrenceId: [18],

        originalText: "cry",
        correspondingOccurrenceIds: [12],
      },
      {
        id: 17,
        type: "event",
        occurrenceText: "wearing",
        startIndex: 431,
        nextOccurrenceId: [18],

        originalText: "wear",
        correspondingOccurrenceIds: [15, 16],
      },
      {
        id: 18,
        type: "event",
        occurrenceText: "married",
        startIndex: 448,
        nextOccurrenceId: [],

        originalText: "marry",
        correspondingOccurrenceIds: [15, 16],
      },
    ],
  },
  occurrenceMap: {},
  occurrenceList: [],
};

export const rawData = JSON.parse(JSON.stringify(Data));

export default Data;

/**
 *   const findAllOccurrences = (str: string, substr: string) => {
    let result = [];

    let idx = str.indexOf(substr);

    while (idx !== -1) {
      result.push(idx);
      idx = str.indexOf(substr, idx + 1);
    }
    return result;
  };
 */
