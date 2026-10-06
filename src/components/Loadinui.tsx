const LoadingUI = () => {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

        {/* Text */}
        <p className="text-sm font-medium text-gray-500">
          Wait a moment...
        </p>
      </div>
    </div>
  );
};

export default LoadingUI;