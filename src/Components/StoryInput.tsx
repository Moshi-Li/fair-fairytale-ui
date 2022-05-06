import React from "react";
import { useSelector } from "react-redux";

import { RootStoreI, useAppDispatch } from "../Store";
import { fetchData } from "../Slices/DataSlice";

import "./StoryInput.scss";

const StoryInput = () => {
  const { fetching } = useSelector((store: RootStoreI) => store.dataReducer);
  const appDispatchAction = useAppDispatch();
  return (
    <div className="story--input--container">
      <textarea className="story--input--textarea"></textarea>
      {!fetching && (
        <button
          className="story--input--btn"
          onClick={() => appDispatchAction(fetchData(""))}
        >
          Test
        </button>
      )}
      {fetching && <p>loading</p>}
    </div>
  );
};

export default StoryInput;
