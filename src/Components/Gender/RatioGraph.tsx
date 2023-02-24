import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Plotly from "plotly.js-dist-min";
import { RootStoreI } from "../../Store";

const RatioGraph = () => {
  const { dataReducer } = useSelector((store: RootStoreI) => store);

  //console.log(dataReducer.characterMeta);
  //console.log(dataReducer.eventMajorList);
  //console.log(dataReducer.eventMeta);

  const res: any[] = Object.keys(dataReducer.storyMeta).map((key) => {
    const { topEvents, counts } = dataReducer.storyMeta;

    return {
      tevents: topEvents,
      counts: counts,
    };
  });

  console.log(dataReducer.storyMeta);

  var trace1: Plotly.Data = {
    x: res.map((item) => {
      return item.counts.total;
    }),
    y: res.map((item) => {
      return item.counts.subject;
    }),
    type: "bar",
  };

  var trace2: Plotly.Data = {
    x: [10, 20, 15],
    y: [90, 40, 60],
    type: "bar",
  };

  var data = [trace1, trace2];

  var layout = {
    title: "To be decided",
    showlegend: false,
  };

  useEffect(() => {
    Plotly.newPlot("plotly--mount", data, layout, { scrollZoom: true });
  });

  return <div id="plotly--mount" className="ratio--graph"></div>;
};

export default RatioGraph;
