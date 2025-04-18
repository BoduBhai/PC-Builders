const UserFilterPanel = ({
  isFilterOpen,
  selectedRole,
  onRoleFilterChange,
  onClearFilters,
}) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="bg-base-100 border-base-300 flex flex-col gap-3 border-b p-3 md:flex-row">
        <div className="form-control w-full md:w-1/2">
          <label className="label">
            <span className="label-text font-medium">Role</span>
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={selectedRole}
            onChange={onRoleFilterChange}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>
        </div>

        <div className="mb-2 flex w-full items-end md:w-1/2">
          <button className="btn btn-sm w-full" onClick={onClearFilters}>
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilterPanel;
