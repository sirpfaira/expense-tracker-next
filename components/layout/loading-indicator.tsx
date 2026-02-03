import { Loader2 } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <div className="flex space-x-2 items-center">
        <Loader2 className="size-12 text-primary animate-spin" />
      </div>
    </div>
  );
};

export default LoadingIndicator;
