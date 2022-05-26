import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import "./App.scss";

import ReactiveParagraph from "./Components/ReactiveParagraph";
import ReactiveGraph from "./Components/ReactiveGraph";
import RawData from "./Components/RawData";
import Filter from "./Components/Filter";
import StoryInput from "./Components/StoryInput";
import ClickOption from "./Components/ClickOption";
import {
  ReportSectionLabel,
  ReportDivider,
  ReportBackToTop,
} from "./Components/Utility";

import { RootStoreI } from "./Store";

function App() {
  const { sourced } = useSelector((store: RootStoreI) => store.dataReducer);
  const scrollDestination = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (sourced) {
      scrollDestination.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [sourced]);

  return (
    <div className="app">
      <StoryInput></StoryInput>
      {sourced && (
        <div ref={scrollDestination} className="report--content">
          <ReportSectionLabel text="Filter" />
          <Filter></Filter>
          <ReportDivider />

          <ReportSectionLabel text="Story" />
          <ReactiveParagraph></ReactiveParagraph>
          <ReportDivider />

          <ReportSectionLabel text="Graph" />
          <ReactiveGraph></ReactiveGraph>
          <ReportDivider />

          <ReportSectionLabel text="Raw Data" />
          <RawData></RawData>
          <ReportBackToTop></ReportBackToTop>
        </div>
      )}
    </div>
  );
}

export default App;
