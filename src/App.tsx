import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { ReactNotifications } from "react-notifications-component";

import "react-tabs/style/react-tabs.css";
import "react-notifications-component/dist/theme.css";
import "./App.scss";

import StoryInput from "./Components/StoryInput";
import Report from "./Components/Report";
import SideBar from "./Components/Sidebar";
import PageNotFound from "./Components/404";

const router = createBrowserRouter([
  {
    path: "/fair-fairytale-ui",
    element: (
      <>
        <SideBar />
        <StoryInput />
      </>
    ),
  },
  {
    path: "/fair-fairytale-ui/:storyId",
    element: (
      <>
        <SideBar />
        <Report />
      </>
    ),
  },
  { path: "/fair-fairytale-ui/404", element: <PageNotFound /> },
]);

const chakraTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: "#319795",
          solidHoverBg: "#2C7A7B",
          solidActiveBg: "#285E61",
          outlinedColor: "#2C7A7B",
          outlinedBorder: "#2C7A7B",
          outlinedHoverBorder: undefined,
          outlinedHoverBg: "#E6FFFA",
          outlinedActiveBg: "#B2F5EA",
        },
        focusVisible: "rgba(66, 153, 225, 0.6)",
      },
    },
  },
  focus: {
    default: {
      outlineWidth: "3px",
    },
  },
  fontFamily: {
    body: "Inter, var(--chakra-fontFamily-fallback)",
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          "&:focus": theme.focus.default,
          fontWeight: 600,
          ...(ownerState.size === "md" && {
            borderRadius: "0.375rem",
            paddingInline: "1rem",
          }),
        }),
      },
    },
  },
});

function App() {
  return (
    <CssVarsProvider theme={chakraTheme}>
      <div className="app">
        <ReactNotifications></ReactNotifications>

        {<RouterProvider router={router}></RouterProvider>}
      </div>
    </CssVarsProvider>
  );
}

export default App;
