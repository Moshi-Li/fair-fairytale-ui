import React from "react";
import Data from "./MockData";
import "./App.scss";

import ReactiveParagraph from "./Components/ReactiveParagraph";
import ReactiveGraph from "./Components/ReactiveGraph";

function App() {
  return (
    <div className="App">
      <header className="paragraph">
        <p className="paragraph--content">{Data.paragraph}</p>
        <ReactiveParagraph
          paragraph={Data.paragraph}
          occurrenceList={Data.occurrenceList ? Data.occurrenceList : []}
        ></ReactiveParagraph>
        <ReactiveGraph
          occurrences={Data.characters.occurrences}
          occurrenceMap={Data.occurrenceMap}
        ></ReactiveGraph>
      </header>
    </div>
  );
}

export default App;
