import React, { useState, useEffect, ReactComponentElement } from "react";
import Data, { OccurrenceI } from "./MockData";
import "./App.scss";

const ReactiveSpan = ({ type, occurrenceText }: OccurrenceI) => (
  <span className={`${type}`}>{occurrenceText}</span>
);

function App() {
  const [reactiveParagraph, setReactiveParagraph] = useState<any[]>([]);

  useEffect(() => {
    const content = [];
    let index = 0;
    Data.occurrenceList?.forEach((item) => {
      content.push(
        <React.Fragment key={index}>
          {Data.paragraph.substring(index, item.startIndex)}
        </React.Fragment>
      );
      content.push(<ReactiveSpan key={item.startIndex} {...item} />);
      index = item.startIndex;
      index += item.occurrenceTextLength ? item.occurrenceTextLength : 0;
    });
    content.push(Data.paragraph.substring(index, Data.paragraph.length));

    setReactiveParagraph(content);
  }, []);

  return (
    <div className="App">
      <header className="paragraph">
        <p className="paragraph--content">{Data.paragraph}</p>
        <p className="paragraph--reactive">{reactiveParagraph}</p>
      </header>
    </div>
  );
}

export default App;
