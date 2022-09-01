//import React from 'react';
import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
//import faker from 'faker';
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

export function ChartComp() {
  const [story, setStory] = useState(null);
  //const [data, setData] = useState(null)

  //const [labels, setLabel] = useState(null)

  const genderType = ["female", "male"];
  const labels = ["female", "male", "unknown"];
  useEffect(() => {
    fetch("http://127.0.0.1:5000/result")
      .then((res) => res.json())
      .then((story) => {
        setStory(story);
      });
  }, []);

  const data = () => ({
    labels: ["female", "male", "unknown"],
    datasets: [
      {
        label: "Gender Distribution",
        data: labels.map((item) => story.story.characters[item].n),
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      },
    ],
  });

  return <div>{story && <Bar options={options} data={data()} />}</div>;
}
