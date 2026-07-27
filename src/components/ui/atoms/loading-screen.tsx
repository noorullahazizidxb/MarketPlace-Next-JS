interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Please wait..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}
