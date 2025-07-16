import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function ErrorBoundary({ error, onRetry, title = "Something went wrong", description }: ErrorBoundaryProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm">
                {description || error?.message || "An unexpected error occurred. Please try again."}
              </p>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export function ErrorCard({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error loading content</h3>
          <p className="text-sm text-red-700 mt-1">{error.message}</p>
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}