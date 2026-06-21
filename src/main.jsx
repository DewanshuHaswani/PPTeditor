import React from "react";
import { createRoot } from "react-dom/client";
import { EditPortal } from "./components/EditPortal";
import { PresentationMode } from "./components/PresentationMode";
import { StoryPresentationMode } from "./components/StoryPresentationMode";
import { usePresentationData } from "./hooks/usePresentationData";
import "./styles.css";

function App() {
  const [data, actions] = usePresentationData();
  const path = window.location.pathname;
  if (path === "/edit") return <EditPortal data={data} actions={actions} />;
  if (path === "/story") return <StoryPresentationMode data={data} />;
  return <PresentationMode data={data} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
