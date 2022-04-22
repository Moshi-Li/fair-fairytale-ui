import React from "react";
import { Dispatch } from "redux";
import Data from "../MockData";
import { ANIMATION_UPDATE_TYPE } from "../Actions/AnimationActionTypes";

const { occurrenceMap } = Data;

const updateAnimationType = (nextAnimationType: string) => {
  return {
    type: ANIMATION_UPDATE_TYPE,
    payload: nextAnimationType,
  };
};

const requestAnimation = () => {};
