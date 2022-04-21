import React, { useState, useEffect, ReactComponentElement } from "react";
import Data from "./MockData";
import "./App.scss";

import ReactiveParagraph from "./Components/ReactiveParagraph";
import ReactiveGraph from "./Components/ReactiveGraph";

function App() {
  const [animatedOccurrenceId, setAnimatedOccurrenceId] = useState<
    Record<string | number, boolean | undefined>
  >({});
  return (
    <div className="App">
      <header className="paragraph">
        <p className="paragraph--content">{Data.paragraph}</p>
        <ReactiveParagraph
          paragraph={Data.paragraph}
          occurrenceList={Data.occurrenceList ? Data.occurrenceList : []}
          animatedOccurrenceId={animatedOccurrenceId}
        ></ReactiveParagraph>
        <ReactiveGraph
          occurrences={Data.characters.occurrences}
          occurrenceMap={Data.occurrenceMap}
          animatedOccurrenceId={animatedOccurrenceId}
          setAnimatedOccurrenceId={setAnimatedOccurrenceId}
        ></ReactiveGraph>
      </header>
    </div>
  );
}

export default App;
