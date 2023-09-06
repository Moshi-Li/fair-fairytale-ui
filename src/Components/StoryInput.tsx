import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/joy/Button";
import storyNames from "./storynames.json";

import "./StoryInput.scss";

const randomSelectFromArray = (arr: Array<any>, count: number) => {
  if (count > arr.length) return [];
  const result: any[] = [];

  result.push("cnn200");
  result.push("cnn201");
  result.push("cnn202");
  for (let i = 0; i < count; i++) {
    result.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return result;
};

const StoryInput = () => {
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();
  const [displayingResults, setDisplayingResults] = useState<Array<string>>([]);

  useEffect(() => {
    const nextDisplayingResults =
      searchString === ""
        ? randomSelectFromArray(storyNames, 2).map((name) =>
            name.split("-").join(" ")
          )
        : storyNames
            .filter((name) => {
              return name
                .split("-")
                .join(" ")
                .includes(searchString.toLocaleLowerCase());
            })
            .slice(0, 20)
            .map((name) => name.split("-").join(" "));

    setDisplayingResults(nextDisplayingResults);
  }, [searchString]);

  return (
    <div className="story--input--container">
      <h1>NECE: Narrative Event Chain Extraction Toolkit</h1>
      <div className="example--container">
        <h2>Story examples</h2>
        <p>
          Type in the name of a story or click on one below to see NECE results
        </p>
        <div className="search--bar--container">
          <div className="form-field">
            <input
              className="search--bar--input"
              onChange={(e) => setSearchString(e.target.value)}
            ></input>
            <span className="icon">🔍</span>
          </div>
          <p className="search--bar--result">
            {searchString === ""
              ? "displaying randomly selected 5 example results"
              : `displaying ${displayingResults.length} results for query "${searchString}"`}
          </p>
        </div>

        <div className="example--container--list">
          {displayingResults.map((name) => (
            <Button
              key={name}
              onClick={() =>
                navigate(`/fair-fairytale-ui/${name.split(" ").join("-")}`)
              }
              size={window.innerWidth > 1024 ? "lg" : "sm"}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryInput;
