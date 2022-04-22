import { OccurrenceI } from "../MockData";
import {
  AnimationDispatchType,
  ANIMATION_UPDATE_ANIMATION,
  ANIMATION_UPDATE_TYPE,
} from "../Actions/AnimationActionTypes";

interface AnimationStateI {
  animatedOccurrence: Record<string | number, boolean>;
  animationType: "self" | "relative";
}

export const animationDefaultState: AnimationStateI = {
  animatedOccurrence: {},
  animationType: "self",
};

const animationReducer = (
  state: AnimationStateI = animationDefaultState,
  action: AnimationDispatchType
): AnimationStateI => {
  switch (action.type) {
    case ANIMATION_UPDATE_TYPE:
      return { ...state, animationType: action.payload };
    case ANIMATION_UPDATE_ANIMATION:
      return { ...state, animationType: action.payload };
    default:
      return animationDefaultState;
  }
};

export default animationReducer;
