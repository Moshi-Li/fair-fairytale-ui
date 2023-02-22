import React, { useEffect, useCallback } from "react";
import Plotly from "plotly.js-dist-min";

const RatioGraph = () => {
  var trace1: Plotly.Data = {
    x: ["2020-10-04", "2021-11-04", "2023-12-04"],
    y: [90, 40, 60],
    type: "scatter",
  };

  var data = [trace1];

  var layout = {
    title: "Scroll and Zoom",
    showlegend: false,
  };

  useEffect(() => {
    Plotly.newPlot("plotly--mount", data, layout, { scrollZoom: true });
  });

  return <div id="plotly--mount" className="ratio--graph"></div>;
};

export default RatioGraph;
