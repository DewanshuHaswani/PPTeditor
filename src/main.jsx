import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { PresentationMode } from "./components/PresentationMode";
import { usePresentationData } from "./hooks/usePresentationData";
import "./styles.css";

const EditPortal = lazy(() => import("./components/EditPortal").then((module) => ({ default: module.EditPortal })));
const StoryPresentationMode = lazy(() => import("./components/StoryPresentationMode").then((module) => ({ default: module.StoryPresentationMode })));

function App() {
  const [data, actions] = usePresentationData();
  const path = window.location.pathname;
  if (path === "/edit") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <EditPortal data={data} actions={actions} />
      </Suspense>
    );
  }
  if (path === "/story") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <StoryPresentationMode data={data} />
      </Suspense>
    );
  }
  return <PresentationMode data={data} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
