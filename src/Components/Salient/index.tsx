import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

import Paragraph from "./ReactiveParagraph";
import ReactiveGraph from "./Graph";

import "./index.scss";

const Salient = () => {
  const { eventMajorList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  return (
    <div className="salient-container">
      <div className="salient-content">
        <Paragraph eventList={eventMajorList} />
        <ReactiveGraph eventList={eventMajorList}></ReactiveGraph>
      </div>
    </div>
  );
};

export default Salient;
