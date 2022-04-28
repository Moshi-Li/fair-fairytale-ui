import React from "react";
import ReactJson from "react-json-view";
import { rawData } from "../MockData";

const RawData = () => {
  return (
    <ReactJson
      src={rawData}
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
