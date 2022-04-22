export const ANIMATION_UPDATE_TYPE = "ANIMATION_UPDATE_TYPE";
export const ANIMATION_UPDATE_ANIMATION = "ANIMATION_UPDATE_ANIMATION";

interface AnimationUpdateType {
  type: typeof ANIMATION_UPDATE_TYPE;
  payload: "self" | "relative";
}

interface AnimationUpdateAnimation {
  type: typeof ANIMATION_UPDATE_ANIMATION;
  payload: "self" | "relative";
}

export type AnimationDispatchType =
  | AnimationUpdateType
  | AnimationUpdateAnimation;
