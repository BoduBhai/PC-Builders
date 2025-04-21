export const ProductCardSkeleton = () => (
  <div className="card bg-base-100 animate-pulse shadow-xl">
    <div className="h-56 bg-gray-300"></div>
    <div className="card-body">
      <div className="mb-2 h-4 w-3/4 bg-gray-300"></div>
      <div className="mb-4 h-4 w-1/2 bg-gray-300"></div>
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-1/4 bg-gray-300"></div>
      </div>
      <div className="card-actions mt-2 flex gap-2">
        <div className="h-8 w-24 rounded bg-gray-300"></div>
        <div className="h-8 w-24 rounded bg-gray-300"></div>
      </div>
    </div>
  </div>
);
