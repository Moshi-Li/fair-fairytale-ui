import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { EventI, EventSalientInfoI } from "../../Slices/DataSlice";
import { RootStoreI } from "../../Store";

import "./ReactiveParagraph.scss";

const generateContent = (
  eventListInput: EventI[],
  eventSalientInfo: EventSalientInfoI[],
  paragraph: string,
  gender: "male" | "female" | "mix"
) => {
  let eventList = JSON.parse(JSON.stringify(eventListInput)) as EventI[];
  let result: any = {};
  const salientInfoMap: any = {};
  eventSalientInfo.forEach(
    (info) =>
      (salientInfoMap[info.sentenceId] = { [info.eventId]: info.temporalRank })
  );

  eventList
    .filter((event) => {
      return (
        salientInfoMap[event.sentenceId] &&
        salientInfoMap[event.sentenceId][event.eventId]
      );
    })
    .forEach((event) => {
      const key = `${event.verbStartByteText}:${event.verbEndByteText}`;
      if (!result[key]) {
        result[key] = event.gender;
      } else if (result[key] !== event.gender) {
        result[key] = "mix";
      }
    });
  result = Object.keys(result)
    .map((key) => {
      return [parseInt(key.split(":")[0]), key.split(":")[1], result[key]];
    })
    .filter((item) => {
      return item[2] === gender;
    });
  result.sort((a: any, b: any) => {
    return a[0] - b[0];
  });

  let index = 0;
  result = result
    .map((item: any) => {
      const [startIndex, endIndex, gender] = item;
      const text = (
        <React.Fragment>
          {paragraph.substring(index, startIndex)}
        </React.Fragment>
      );
      const span = (
        <span
          style={{
            backgroundColor:
              gender === "male"
                ? "blue"
                : gender === "female"
                ? "red"
                : "yellow",
          }}
        >
          {paragraph.substring(startIndex, endIndex)}
        </span>
      );
      index = endIndex;
      return [text, span];
    })
    .flat();
  result.push(
    <React.Fragment>
      {paragraph.substring(index, paragraph.length)}
    </React.Fragment>
  );
  return result;
};

const ReactiveParagraph = ({
  gender,
}: {
  gender: "male" | "female" | "mix";
}) => {
  const { paragraph, eventSalientInfo, eventList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  const memoizedContent = useMemo(() => {
    return generateContent(eventList, eventSalientInfo, paragraph, gender);
  }, [gender, eventList, eventSalientInfo, paragraph]);

  return (
    <React.Fragment>
      <p className="report--reactive--paragraph">{memoizedContent}</p>
    </React.Fragment>
  );
};

export default ReactiveParagraph;
