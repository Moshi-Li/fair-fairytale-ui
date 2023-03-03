import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Plotly from "plotly.js-dist-min";
import { RootStoreI } from "../../Store";

const RatioGraph = () => {
  const { topEvents } = useSelector(
    (store: RootStoreI) => store.dataReducer.storyMeta
  );

  const dataPack = useMemo<any[][]>(
    () =>
      Object.entries(topEvents)
        .filter((item) => {
          const [, events] = item;
          return events.length >= 1;
        })
        .map((item) => {
          const [, events] = item;
          return [
            {
              y: events
                .filter((events) => events.argument === "subject")
                .map((item) => item.odds),
              x: events
                .filter((events) => events.argument === "subject")
                .map((item) => item.eventLemma),
              type: "bar",
              text: events
                .filter((events) => events.argument === "subject")
                .map((item) => {
                  return item.odds;
                }),
              textPosition: "outside",
              /*orientation: "h",*/
            },
            {
              y: events
                .filter((events) => events.argument === "direct_object")
                .map((item) => item.odds),
              x: events
                .filter((events) => events.argument === "direct_object")
                .map((item) => item.eventLemma),
              type: "bar",
              text: events
                .filter((events) => events.argument === "direct_object")
                .map((item) => {
                  return item.odds;
                }),
              textPosition: "outside",
              /*orientation: "h",*/
            },
          ];
        }),
    [topEvents]
  );

  const layouts = useMemo<Plotly.Layout[]>(
    () =>
      Object.entries(topEvents)
        .map((item) => {
          const [key, events] = item;
          return events.length
            ? {
                title: `Top ${key} character events`,
                showlegend: false,
                xaxis: { title: { text: "odds ratio" }, visible: true },
              }
            : undefined;
        })
        .filter((item) => item !== undefined) as Plotly.Layout[],
    [topEvents]
  );

  useEffect(() => {
    dataPack.forEach((data, index) => {
      Plotly.newPlot(
        `plotly--mount--${layouts[index].title}`,
        [...data],
        layouts[index],
        {
          scrollZoom: true,
        }
      );
    });
  }, [dataPack, layouts]);

  return (
    <React.Fragment>
      {layouts.map((item) => (
        <div id={`plotly--mount--${item.title}`} className="ratio--graph"></div>
      ))}
    </React.Fragment>
  );
};

export default RatioGraph;
