import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface ExportModalProps {
  isShown: boolean;
  progress: number;
  offset: number;
  total: number;
  isComplete?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
}

export const ExportModal = ({
  isShown,
  progress,
  offset,
  total,
  isComplete = false,
  onCancel,
  onOk,
}: ExportModalProps) => {
  return (
    <Dialog open={isShown} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] z-[9999]">
        <DialogHeader>
          <DialogTitle>Exporting Data</DialogTitle>
          <DialogDescription>
            Progress: {progress}%
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isComplete ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Export data completed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4 animate-spin text-[#087F5B]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Mengekspor data...</span>
            </div>
          )}

          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-3 bg-[#087F5B] rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-600">
            Export {offset} dari {total} data
            {!isComplete && (
              <span className="inline-flex ml-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:150ms]">.</span>
                <span className="animate-bounce [animation-delay:300ms]">.</span>
              </span>
            )}
          </p>

          <div className="flex justify-end">
            {isComplete ? (
              <button
                onClick={onOk}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                OK
              </button>
            ) : (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-[#D95D43] text-[#D95D43] rounded hover:bg-[#FFF5F2] text-sm"
              >
                Batalkan
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};