import React from "react";
import ComponentCard from "./ComponentCard";

const ComponentSection = ({
  title,
  components,
  selectedComponents,
  getComponentImage,
  getComponentName,
  showComponentModal,
  requiredComponents = [],
}) => {
  return (
    <div className="card bg-base-100 mb-6 shadow-lg">
      <div className="card-body">
        <h2 className="card-title bg-base-200 -mx-6 -mt-6 p-4 text-lg font-semibold tracking-wide uppercase">
          {title}
        </h2>
        <div className="mt-4">
          {components.map((component) => (
            <ComponentCard
              key={component}
              componentType={component}
              selected={selectedComponents[component]}
              required={requiredComponents.includes(component)}
              getComponentImage={getComponentImage}
              getComponentName={getComponentName}
              showComponentModal={showComponentModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentSection;
