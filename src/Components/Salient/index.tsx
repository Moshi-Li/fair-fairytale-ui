import React, { useState } from "react";

import Paragraph from "./ReactiveParagraph";
import Graph from "./Graph";

const Salient = () => {
  const [gender, setGender] = useState<"male" | "female" | "mix">("male");
  return (
    <React.Fragment>
      <button
        onClick={(e) => {
          setGender("male");
        }}
      >
        Male
      </button>
      <button
        onClick={(e) => {
          setGender("female");
        }}
      >
        Female
      </button>
      <button
        onClick={(e) => {
          setGender("mix");
        }}
      >
        Mix
      </button>
      <Paragraph gender={gender} />
    </React.Fragment>
  );
};

export default Salient;
