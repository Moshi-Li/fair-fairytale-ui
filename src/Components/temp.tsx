import React from "react";

export const nodes = [
  {
    id: "4",

    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
        </>
      ),
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "5",
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 0, y: 0 },
  },
];

export const edges = [
  { id: "e4-5", source: "4", target: "5", label: "this is an edge label" },
];
