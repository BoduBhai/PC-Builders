import { useState } from "react";

const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  objectFit = "cover",
  loading = "lazy",
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // If priority is true, override loading to eager
  const loadingStrategy = priority ? "eager" : loading;

  // Handle successful image load
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
      }}
    >
      <img
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        loading={loadingStrategy}
        className={`${objectFit === "cover" ? "object-cover" : "object-contain"} h-full w-full transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={handleImageLoad}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-100">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
