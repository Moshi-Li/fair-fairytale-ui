import React from "react";
import { useSelector } from "react-redux";

import { RootStoreI, useAppDispatch } from "../Store";

import { updateFilterKey } from "../Slices/FilterSlice";

import { ReactiveSpan } from "./ReactiveParagraph";

import "./Filter.scss";

const Filter = () => {
  const appDispatchAction = useAppDispatch();

  const { filterKey, filteredOccurrences, occurrenceHighlightColor } =
    useSelector((store: RootStoreI) => store.filterReducer);

  return (
    <div className="report--filter">
      <div>
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
                        color={occurrenceHighlightColor[item.id]}
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
