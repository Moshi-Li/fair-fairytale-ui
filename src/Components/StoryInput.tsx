import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import StatusIndicator from "react-status-indicator";
import { RootStoreI, useAppDispatch } from "../Store";
import { fetchData } from "../Slices/DataSlice";

import "./StoryInput.scss";

const storyNames = [
  "a-fish-story",
  "a-french-puck",
  "a-legend-of-confucius",
  "a-legend-of-knockmany",
  "ali-baba-and-forty-thieves",
  "alleleiraugh-or-the-many-furred-creature",
];

const StoryInput = () => {
  const { fetching } = useSelector((store: RootStoreI) => store.dataReducer);
  const appDispatchAction = useAppDispatch();
  return (
    <div className="story--input--container">
      <div className="example--container">
        <p>Examples:</p>
        <div className="example--container--list">
          {storyNames.map((name) => (
            <button onClick={() => appDispatchAction(fetchData(name))}>
              {name}
            </button>
          ))}
        </div>
        <div className="example--container--status">
          <p>Server Status:</p>
          <StatusIndicator Negative Pulse />
        </div>
      </div>

      <textarea className="story--input--textarea"></textarea>
      {!fetching && (
        <button className="story--input--btn" disabled title="Server is down">
          Test
        </button>
      )}
      {fetching && <AiOutlineLoading3Quarters className="loader" />}
    </div>
  );
};

export default StoryInput;
