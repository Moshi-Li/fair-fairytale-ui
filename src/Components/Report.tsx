import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchData } from "../Slices/DataSlice";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Salient from "./Salient";
import Gender from "./Gender";
import Character from "./Character";
import Loader from "./Loader";

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
  const { sourced } = useSelector((store: RootStoreI) => store.dataReducer);
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    if (storyId) appDispatchAction(fetchData(storyId));
  }, [appDispatchAction, storyId]);

  if (!sourced) return <Loader />;
  return (
    <div className={`report--content ${TabBackground[tabIndex.toString()]}`}>
      <h3
        onClick={() => {
          navigate("/");
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
    </div>
  );
}
