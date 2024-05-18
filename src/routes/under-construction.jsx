import { useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function UnderConstruction() {
  useEffect(() => {
    document.title = "Under Construction";
  }, []);

  return (
    <div className="middle-screen flex-column">
      {" "}
      <h1 style={{ fontFamily: "Oswald", fontStyle: "italic" }}>
        This page will be implemented soon!
      </h1>
      <NavLink
        className="go-back mt-3 d-flex align-items-center justify-content-center gap-3"
        to="/"
      >
        <span>Go Back</span>
        <i className="bi bi-arrow-left-circle-fill"></i>
      </NavLink>
    </div>
  );
}
