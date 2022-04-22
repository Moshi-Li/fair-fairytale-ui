import { combineReducers } from "redux";
import animationReducer from "./AnimationReducer";

const RootReducer = combineReducers({
  animationConfig: animationReducer,
});

export default RootReducer;
