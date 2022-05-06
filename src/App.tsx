import React from "react";
import { useSelector } from "react-redux";

import "./App.scss";

import ReactiveParagraph from "./Components/ReactiveParagraph";
import ReactiveGraph from "./Components/ReactiveGraph";
import RawData from "./Components/RawData";
import Filter from "./Components/Filter";
import StoryInput from "./Components/StoryInput";
import ClickOption from "./Components/ClickOption";
import { ReportSectionLabel, ReportDivider } from "./Components/Utility";

import { RootStoreI } from "./Store";

function App() {
  const { sourced } = useSelector((store: RootStoreI) => store.dataReducer);

  return (
    <div className="App">
      <StoryInput></StoryInput>
      {sourced && (
        <div className="report--content">
          <ReportSectionLabel text="Click Type" />
          <ClickOption></ClickOption>

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
        </div>
      )}
    </div>
  );
}

export default App;
