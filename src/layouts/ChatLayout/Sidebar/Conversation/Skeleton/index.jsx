function Skeleton() {
    return (
    <div className="rounded-sm py-[3px] px-[5px] w-full">
      <div className="flex items-center gap-3 animate-pulse">
        
        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        {/* Text */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>

      </div>
    </div>
  );
}

export default Skeleton