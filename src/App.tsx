import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  ReactNotifications,
  Store as notificationStore,
} from "react-notifications-component";

import "react-tabs/style/react-tabs.css";

import "react-notifications-component/dist/theme.css";
import "./App.scss";

import StoryInput from "./Components/StoryInput";
import Salient from "./Components/Salient";
import Gender from "./Components/Gender";
import Character from "./Components/Character";
import EventModal from "./Components/Modal";

import { ReportBackToTop } from "./Components/Utility";

import { RootStoreI } from "./Store";

const TabBackground: any = {
  0: "salient-event",
  1: "gender",
  2: "character",
};

function App() {
  const { sourced } = useSelector((store: RootStoreI) => store.dataReducer);

  const scrollDestination = useRef<null | HTMLDivElement>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    if (sourced) {
      scrollDestination.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [sourced]);

  useEffect(() => {
    notificationStore.addNotification({
      title: "Welcome to NECE",
      message: (
        <p>
          {`Before you start please note that:`}
          <br></br>
          {`1). Please note that the analytical server is configured to process maximum of one request at any time.`}
          <br></br>
          {`2) All requests will be dropped after 60s`}
        </p>
      ),
      type: "info",
      insert: "top",
      container: "top-center",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 10000,
        onScreen: true,
      },
      width: 600,
    });
  }, []);

  return (
    <div className="app">
      <ReactNotifications></ReactNotifications>
      <h1>NECE: Narrative Event Chain Extraction Toolkit</h1>
      <StoryInput></StoryInput>
      {sourced && (
        <div
          ref={scrollDestination}
          className={`report--content ${TabBackground[tabIndex.toString()]}`}
        >
          <h3>NECE results</h3>
          <Tabs
            className={"tab--container"}
            onSelect={(index) => setTabIndex(index)}
          >
            <TabList className={"tab--list"}>
              <Tab>Salient events</Tab>
              <Tab>Gender</Tab>
              <Tab>Character</Tab>
            </TabList>
            <TabPanel>
              <Salient />
            </TabPanel>
            <TabPanel>
              <Gender></Gender>
            </TabPanel>
            <TabPanel>
              <Character />
            </TabPanel>
          </Tabs>
          <ReportBackToTop></ReportBackToTop>
        </div>
      )}
      <EventModal></EventModal>
    </div>
  );
}

export default App;
