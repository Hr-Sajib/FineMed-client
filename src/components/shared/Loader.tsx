import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMortarPestle } from "@fortawesome/free-solid-svg-icons";

const Loader = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-pharmacy-light border-t-pharmacy" />
          <FontAwesomeIcon icon={faMortarPestle} className="h-5 w-5 text-pharmacy" />
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Loading</p>
      </div>
    </div>
  );
};

export default Loader;
