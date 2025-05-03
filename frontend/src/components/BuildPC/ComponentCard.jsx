const ComponentCard = ({
  componentType,
  selected,
  required = false,
  getComponentImage,
  getComponentName,
  showComponentModal,
}) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="w-12">
        <img
          src={getComponentImage(componentType)}
          alt={componentType}
          className="h-12 w-12 object-contain"
          onError={(e) => {
            e.target.src = "/accessories.avif";
          }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-medium">{getComponentName(componentType)}</span>
          {required && <span className="text-error ml-1">*</span>}
        </div>
        <div className="truncate text-sm text-gray-600">
          {selected ? selected.modelNo : "No component selected"}
        </div>
      </div>
      {selected ? (
        <div>
          <button
            onClick={() => showComponentModal(componentType)}
            className="btn btn-secondary"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={() => showComponentModal(componentType)}
          className="btn btn-primary"
        >
          Choose
        </button>
      )}
    </div>
  );
};

export default ComponentCard;
