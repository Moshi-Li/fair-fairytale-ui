import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Input from "@mui/joy/Input";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import "./Sidebar.scss";
import storyNames from "../storynames.json";

export default function SideBar() {
  const [toggled, setToggled] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [displayingResults, setDisplayingResults] = useState<Array<string>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const nextDisplayingResults =
      searchString === ""
        ? storyNames
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
    <>
      {!toggled && (
        <span className="menu--icon" onClick={() => setToggled(true)}>
          <HiMenu />
        </span>
      )}
      <Sidebar
        onBackdropClick={() => setToggled(false)}
        toggled={toggled}
        breakPoint="always"
        width={window.innerWidth < 500 ? "100%" : "500px"}
        collapsedWidth={"0px"}
        rootStyles={{
          background:
            "linear-gradient(115.4deg, #d2fff4 3.64%, #ffffff 118.6%)",
        }}
      >
        <span className="delete--icon" onClick={() => setToggled(false)}>
          <HiX />
        </span>
        <Menu>
          <div className="input--container">
            <Input onChange={(e) => setSearchString(e.target.value)} />
          </div>

          {displayingResults.map((name) => (
            <MenuItem
              onClick={() => {
                setToggled(false);
                navigate(`/fair-fairytale-ui/${name.split(" ").join("-")}`);
              }}
              color="white"
              rootStyles={{
                fontSize: "24px",
                background:
                  "linear-gradient(115.4deg, #d2fff4 3.64%, #ffffff 118.6%)",
              }}
            >
              <span title={name}>{name}</span>
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>
    </>
  );
}
