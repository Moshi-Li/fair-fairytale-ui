import React from "react";
import { useSelector } from "react-redux";

import { RootStoreI, useAppDispatch } from "../Store";

import { updateFilterKey } from "../Slices/FilterSlice";
import { updateAnimationType } from "../Slices/AnimationSlice";

import { ReactiveSpan } from "./ReactiveParagraph";

const Filter = () => {
  const appDispatchAction = useAppDispatch();
  const { animationType } = useSelector(
    (store: RootStoreI) => store.animationReducer
  );
  const { filterKey, filteredOccurrences } = useSelector(
    (store: RootStoreI) => store.filterReducer
  );

  // appDispatchAction(updateFilterKey("gender"));
  return (
    <div className="paragraph--filter">
      <div className="selector">
        <label>
          <input
            type="radio"
            value="gender"
            checked={filterKey === "gender"}
            onChange={(e) => {
              appDispatchAction(
                updateFilterKey(e.target.value as "" | "gender" | "race")
              );
            }}
          />
          Gender
        </label>
        <label>
          <input
            type="radio"
            value="race"
            checked={filterKey === "race"}
            onChange={(e) => {
              appDispatchAction(
                updateFilterKey(e.target.value as "" | "gender" | "race")
              );
            }}
          />
          Race
        </label>
      </div>
      <div className="selector">
        <label>
          <input
            type="radio"
            value="self"
            checked={animationType === "self"}
            onChange={(e) => {
              appDispatchAction(updateAnimationType(e.target.value));
            }}
          />
          Color Self
        </label>
        <label>
          <input
            type="radio"
            value="relative"
            checked={animationType === "relative"}
            onChange={(e) => {
              appDispatchAction(updateAnimationType(e.target.value));
            }}
          />
          Color Relatives
        </label>
      </div>
      <div className="filter--content">
        {Object.keys(filteredOccurrences).map((sectionName: string) => {
          return (
            <div key={sectionName}>
              <h2>{sectionName}</h2>

              <div className="filter--content--module">
                {filteredOccurrences[sectionName].map((item) => {
                  return (
                    <p key={item.startIndex}>
                      <ReactiveSpan
                        id={item.id}
                        type={item.type}
                        occurrenceText={item.occurrenceText}
                      ></ReactiveSpan>
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
