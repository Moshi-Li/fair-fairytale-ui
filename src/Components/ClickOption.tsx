import React from "react";
import { useSelector } from "react-redux";

import { RootStoreI, useAppDispatch } from "../Store";
import { updateAnimationType } from "../Slices/AnimationSlice";

const ClickOption = () => {
  const appDispatchAction = useAppDispatch();
  const { animationType } = useSelector(
    (store: RootStoreI) => store.animationReducer
  );

  return (
    <div>
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
  );
};

export default ClickOption;
