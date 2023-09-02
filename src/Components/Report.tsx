import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchData } from "../Slices/DataSlice";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Salient from "./Salient";
import Gender from "./Gender";
import Character from "./Character";
import Loader from "./Utils/Loader";

import { RootStoreI, useAppDispatch } from "../Store";
import "./Report.scss";

const TabBackground: any = {
  0: "salient-event",
  1: "gender",
  2: "character",
};

export default function Report() {
  const appDispatchAction = useAppDispatch();
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { sourced, error } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    if (storyId) appDispatchAction(fetchData(storyId));
  }, [appDispatchAction, storyId]);

  useEffect(() => {
    if (error) navigate("/fair-fairytale-ui/404");
  }, [error, navigate]);

  console.log(tabIndex);

  if (!sourced) return <Loader />;
  return (
    <div className={`report--content ${TabBackground[tabIndex.toString()]}`}>
      <h3
        onClick={() => {
          navigate("/fair-fairytale-ui");
        }}
        title="home"
      >
        NECE: Narrative Event Chain Extraction Toolkit
      </h3>
      <Tabs
        className={"tab--container"}
        onSelect={(index) => setTabIndex(index)}
      >
        <TabList className={"tab--list"}>
          <Tab>Salient events</Tab>
          <Tab>Gender</Tab>
          <Tab>Character</Tab>
        </TabList>
        <TabPanel className={tabIndex === 0 ? "salient-container" : ""}>
          <Salient />
        </TabPanel>
        <TabPanel className={tabIndex === 1 ? "gender--container" : ""}>
          <Gender></Gender>
        </TabPanel>
        <TabPanel className={tabIndex === 2 ? "character--container" : ""}>
          <Character />
        </TabPanel>
      </Tabs>
    </div>
  );
}
