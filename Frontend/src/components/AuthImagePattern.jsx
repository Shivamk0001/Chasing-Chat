const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center space-y-6">
        {/* Skeleton pattern */}
        <div className="flex w-52 flex-col gap-4 mx-auto">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28 mx-auto"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
