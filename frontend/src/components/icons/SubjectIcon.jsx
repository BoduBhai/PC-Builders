import React from "react";

const SubjectIcon = ({ className = "h-full w-full" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="none"
        stroke="currentColor"
      >
        <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
        <path d="M12 11.5v-2"></path>
        <path d="M12 15.5h.01"></path>
      </g>
    </svg>
  );
};

export default SubjectIcon;
