import React from "react";
import ReactJson from "react-json-view";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

const RawData = ({ data }: { data: any }) => {
  const { characterMeta } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  return (
    <ReactJson
      src={data}
      theme="monokai"
      groupArraysAfterLength={5}
      collapsed
      style={{
        width: "100%",
        textAlign: "left",
        marginBottom: "60px",
      }}
    />
  );
};

export default RawData;
