import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="w-full">
      <div className="animate-pulse">
        <div className="bg-gray-300 rounded-lg h-48 w-full"></div>
        <div className="flex items-start mt-2">
          <div className="bg-gray-300 rounded-full h-10 w-10"></div>
          <div className="ml-2 flex-1">
            <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/2 rounded mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;