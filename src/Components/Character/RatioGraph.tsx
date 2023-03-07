import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Plotly from "plotly.js-dist-min";
import { RootStoreI } from "../../Store";

const RatioGraph = () => {
  const { dataReducer } = useSelector((store: RootStoreI) => store);

  const result: any[] = Object.keys(dataReducer.characterMeta).map((key) => {
    const { easyName, total } = dataReducer.characterMeta[key];

    return {
      name: easyName,
      appearance: total,
    };
  });

  var trace1: Plotly.Data = {
    x: result.map((item) => {
      return item.appearance;
    }),
    transforms: [
      {
        type: "sort",
        target: "x",
        order: "ascending",
      },
      {
        type: "filter",
        target: "x",
        operation: ">",
        value: 0,
      },
    ],
    y: result.map((item) => {
      return item.name;
    }),
    type: "bar",
    text: result.map((item) => {
      return item.appearance;
    }),
    textposition: "outside",
    orientation: "h",
  };

  var data = [trace1];

  var layout = {
    title: "Total appearances by character",
    showlegend: false,
    width: 670,
    height: 450,
    margin: {
      l: 330,
      r: 50,
    },
    xaxis: {
      visible: false,
      range: [
        0,
        result.map((item) => {
          return item.appearance;
        }).length - 1,
      ],
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      range: [
        0,
        result.map((item) => {
          return item.name;
        }).length - 1,
      ],
    },
  };

  useEffect(() => {
    Plotly.newPlot("plotly--mount", data, layout, { responsive: true }); //
  });

  return <div id="plotly--mount" className="ratio--graph"></div>;
};

export default RatioGraph;
