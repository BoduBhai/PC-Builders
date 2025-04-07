const LoadingSpinner = () => {
  return (
    <div className="bg-base-100 flex min-h-screen items-center justify-center">
      <div className="relative">
        <div className="border-primary h-20 w-20 rounded-full border-2" />
        <div className="border-accent absolute top-0 left-0 h-20 w-20 animate-spin rounded-full border-t-2" />
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
