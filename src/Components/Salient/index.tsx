import React from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

import { FlexBox, FlexItem } from "@/Components/Utils/FlexBox";
import Paragraph from "./ReactiveParagraph";
import ReactiveGraph from "./Graph";

import "./index.scss";

const Salient = () => {
  const { eventMajorList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  return (
    <div className="salient-content">
      <Paragraph eventList={eventMajorList} />
      <ReactiveGraph eventList={eventMajorList}></ReactiveGraph>
    </div>
  );
};

export default Salient;
