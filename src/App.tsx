import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "./App.scss";

import Salient from "./Components/Salient";
import Character from "./Components/Character";
import StoryInput from "./Components/StoryInput";

import { ReportBackToTop } from "./Components/Utility";

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
          <Tabs>
            <TabList>
              <Tab>Salient EVENTS</Tab>
              <Tab>GENDER</Tab>
              <Tab>CHARACTER</Tab>
            </TabList>
            <TabPanel>
              <Salient />
            </TabPanel>
            <TabPanel>
              <h1>TODO: GENDER</h1>
            </TabPanel>
            <TabPanel>
              <Character />
            </TabPanel>
          </Tabs>

          <ReportBackToTop></ReportBackToTop>
        </div>
      )}
    </div>
  );
}

export default App;
