import * as React from "react";
import { LoadingSpinner } from "../atoms/shadcn/loading-spinner";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">

        <LoadingSpinner size="sm" />
        {/* Remove the loading message from this component and use it in the parent component instead, so that we can have more control over the loading */}
      </div>
    </div>
  );
}
