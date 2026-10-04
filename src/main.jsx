import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { PresentationMode } from "./components/PresentationMode";
import { usePresentationData } from "./hooks/usePresentationData";
import "./styles.css";

const EditPortal = lazy(() => import("./components/EditPortal").then((module) => ({ default: module.EditPortal })));
const StoryPresentationMode = lazy(() => import("./components/StoryPresentationMode").then((module) => ({ default: module.StoryPresentationMode })));

function App() {
  const [data, actions] = usePresentationData();
  if (!actions.ready) return <div role="status" className="min-h-screen bg-slate-950 p-8 text-white">Opening presentation…</div>;
  const path = window.location.pathname;
  const recoveryNotice = actions.storage.mode === "error" && <div role="status" className="fixed right-5 top-5 z-40 max-w-md rounded-xl bg-amber-100 p-3 text-sm text-amber-950 shadow-lg">{actions.storage.message}</div>;
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
        {recoveryNotice}
        <StoryPresentationMode data={data} />
      </Suspense>
    );
  }
  return <>{recoveryNotice}<PresentationMode data={data} /></>;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
