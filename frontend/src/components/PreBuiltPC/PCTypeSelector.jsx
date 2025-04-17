import React from "react";

const PCTypeSelector = ({
  selectedType,
  setSelectedType,
  typeDescriptions,
}) => {
  return (
    <div className="mb-8">
      <div className="tabs tabs-boxed bg-base-200 max-w-fit p-1">
        <button
          onClick={() => setSelectedType("gaming")}
          className={`tab ${selectedType === "gaming" ? "tab-active" : ""} transition-all`}
        >
          Gaming
        </button>
        <button
          onClick={() => setSelectedType("productivity")}
          className={`tab ${selectedType === "productivity" ? "tab-active" : ""} transition-all`}
        >
          Productivity
        </button>
        <button
          onClick={() => setSelectedType("regular")}
          className={`tab ${selectedType === "regular" ? "tab-active" : ""} transition-all`}
        >
          Home/Office
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
        <p className="text-base-content">
          <span className="font-semibold">
            {selectedType === "gaming"
              ? "Gaming PC"
              : selectedType === "productivity"
                ? "Workstation PC"
                : "Home/Office PC"}
            :
          </span>{" "}
          {typeDescriptions[selectedType]}
        </p>
      </div>
    </div>
  );
};

export default PCTypeSelector;
