import characterMeta from "./ali-baba-and-forty-thieves.characters_statistics.json";
import eventMeta from "./ali-baba-and-forty-thieves.events_statistics.json";
import eventList from "./ali-baba-and-forty-thieves.characters_temporal_events.json";
import eventSalientInfo from "./ali-baba-and-forty-thieves.major_events_temporal_ranks..json";

const paragraph = `The story takes place in Baghdad during the Abbasid era. Ali Baba and his elder brother Cassim are the sons of a merchant. After the death of their father, the greedy Cassim marries a wealthy woman and becomes well-to-do, building on their father's business - but Ali Baba marries a poor woman and settles into the trade of a woodcutter. One day Ali Baba is at work collecting and cutting firewood in the forest, and he happens to overhear a group of forty thieves visiting their treasure store. The treasure is in a cave, the mouth of which is sealed by magic. It opens on the words "Open, Simsim", and seals itself on the words "Close, Simsim". When the thieves are gone, Ali Baba enters the cave himself, and takes some of the treasure home. Ali Baba borrows his sister-in-law's scales to weigh this new wealth of gold coins. Unbeknownst to Ali, she puts a blob of wax in the scales to find out what Ali is using them for, as she is curious to know what kind of grain her impoverished brother-in-law needs to measure. To her shock, she finds a gold coin sticking to the scales and tells her husband, Ali Baba's rich and greedy brother, Cassim. Under pressure from his brother, Ali Baba is forced to reveal the secret of the cave. Cassim goes to the cave and enters with the magic words, but in his greed and excitement over the treasures forgets the magic words to get back out again. The thieves find him there, and kill him. When his brother does not come back, Ali Baba goes to the cave to look for him, and finds the body, quartered and with each piece displayed just inside the entrance of the cave to discourage any similar attempts in the future. Ali Baba brings the body home, where he entrusts Morgiana, a clever slave-girl in Cassim's household, with the task of making others believe that Cassim has died a natural death. First, Morgiana purchases medicines from an apothecary, telling him that Cassim is gravely ill. Then, she finds an old tailor known as Baba Mustafa whom she pays, blindfolds, and leads to Cassim's house. There, overnight, the tailor stitches the pieces of Cassims' body back together, so that no one will be suspicious. Ali and his family are able to give Cassim a proper burial without anyone asking awkward questions. The thieves, finding the body gone, realize that yet another person must know their secret, and set out to track him down. One of the thieves goes down to the town and comes across Baba Mustafa, who mentions that he has just sewn a dead man's body back together. Realizing that the dead man must have been the thieves' victim, the thief asks Baba Mustafa to lead the way to the house where the deed was performed. The tailor is blindfolded again, and in this state he is able to retrace his steps and find the house. The thief marks the door with a symbol. The plan is for the other thieves to come back that night and kill everyone in the house. However, the thief has been seen by Morgiana and she, loyal to her master, foils his plan by marking all the houses in the neighborhood with a similar marking. When the 40 thieves return that night, they cannot identify the correct house and the head thief kills the lesser thief. The next day, another thief revisits Baba Mustafa and tries again, only this time, a chunk is chipped out of the stone step at Ali Baba's front door. Again Morgiana foils the plan by making similar chips in all the other doorsteps. The second thief is killed for his stupidity as well. At last, the head thief goes and looks for himself. This time, he memorizes every detail he can of the exterior of Ali Baba's house. The chief of the thieves pretends to be an oil merchant in need of Ali Baba's hospitality, bringing with him Forty thieves hiding in oil jarsmules loaded with thirty-eight oil jars, one filled with oil, the other thirty-seven hiding the other remaining thieves. Once Ali Baba is asleep, the thieves plan to kill him. Again, Morgiana discovers and foils the plan, killing the thirty-seven thieves in their oil jars by pouring boiling oil on them. When their leader comes to rouse his men, he discovers that they are dead, and escapes. To exact revenge, after some time the thief establishes himself as a merchant, befriends Ali Baba's son (who is now in charge of the late Cassim's business), and is invited to dinner at Ali Baba's house. The thief is recognized by Morgiana, who performs a dance with a dagger for the diners and plunges it into the heart of the thief when he is off his guard. Ali Baba is at first angry with Morgiana, but when he finds out the thief tried to kill him, he gives Morgiana her freedom and marries her to his son. Ali Baba is then left as the only one knowing the secret of the treasure in the cave and how to access it. Thus, the story ends happily for everyone except the forty thieves and Cassim.`;

const processCharacterMeta = (characters: any) => {
  Object.keys(characters).map((key) => {
    const {
      clustered_names,
      name_mentions,
      pronoun_mentions,
      total,
      easy_name,
      gender,
      gender_certainty,
      importance,
      event_n,
      direct_object_n,
      subject_n,
    } = characters[key];
    characters[key] = {
      clustered_names,
      easy_name,

      event_n,
      direct_object_n,
      subject_n,

      name_mentions,
      pronoun_mentions,
      total,

      gender,
      gender_certainty,
      importance,
    };
  });
};

//Todo
const processEventMeta = (events: any) => {};

const processEventList = (events: any) => {
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

processCharacterMeta(characterMeta);

const Data = {
  characterMeta,
  eventList: processEventList(eventList),
  eventSalientInfo,
  paragraph,
};

export default Data;
