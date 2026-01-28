import { Loader2 } from "lucide-react";

type Props = {};

const LoadingIndicator = (props: Props) => {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <div className="flex space-x-2 items-center">
        <Loader2 className="size-6 text-primary animate-spin" />
        <span>Loading data...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
