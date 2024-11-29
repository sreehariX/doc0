export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-gray-900 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-gray-900">Searching vector database...</p>
        <p className="text-sm text-gray-500">Generating response with AI</p>
      </div>
    </div>
  );
}