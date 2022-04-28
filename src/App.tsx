import React from "react";
import Data from "./MockData";
import "./App.scss";

import ReactiveParagraph from "./Components/ReactiveParagraph";
import ReactiveGraph from "./Components/ReactiveGraph";
import RawData from "./Components/RawData";

function App() {
  return (
    <div className="App">
      <header className="paragraph">
        <p className="paragraph--content">{Data.paragraph}</p>
        <ReactiveParagraph
          paragraph={Data.paragraph}
          occurrenceList={Data.occurrenceList ? Data.occurrenceList : []}
        ></ReactiveParagraph>

        <h1>Double Click on text to try interaction</h1>
        <ReactiveGraph
          occurrences={Data.characters.occurrences}
          occurrenceMap={Data.occurrenceMap}
        ></ReactiveGraph>
        <h1>Raw Data</h1>
        <RawData></RawData>
      </header>
    </div>
  );
}

export default App;
