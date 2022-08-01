const eventMajorList = require("./ali-baba-and-forty-thieves.major_characters_temporal_events.json");
const eventList = require("./ali-baba-and-forty-thieves.characters_temporal_events.json");

let map = {};
console.log(eventList.length);
console.log(eventMajorList.length);

eventMajorList.forEach((item) => {
  if (!map[item.gender]) map[item.gender] = 0;

  map[item.gender] = map[item.gender] + 1;
});

eventList.forEach((item) => {
  if (!map[item.gender]) map[item.gender] = 0;
  map[item.gender] = map[item.gender] + 1;
});

console.log(map);
