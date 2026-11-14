import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "../styles.css";
import "./burgeraya.css";

function SiteWithLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 950);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <App />
      {loading && <PageLoader />}
    </>
  );
}

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="جارٍ تحميل برجراية">
      <img className="page-loader-logo" src="/assets/burgeraya-logo.png" alt="" />
      <span className="page-loader-name">برجراية</span>
      <span className="page-loader-caption">طعمها حكاية</span>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SiteWithLoader />
  </React.StrictMode>
);
