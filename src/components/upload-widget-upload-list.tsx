
import { useUploads, type Upload } from "../store/uploads";
import { UploadWidgetUploadItem } from "./upload-widget-upload-item";

export function UploadWidgetUploadList() {
  const { uploads } = useUploads();

  const isUploadListEmpty = uploads.size === 0;

  return (
    <div className="px-3 flex flex-col gap-3">
      <span className="text-xs font-medium">
        Uploads files{' '}
        <span className="text-zinc-400">({uploads.size})</span>
      </span>

      {isUploadListEmpty ? (
        <span className="text-xs text-zinc-400"> No uploads added</span>
      ) : (
        <div className="flex flex-col gap-2">
          {Array.from(uploads.entries() as Iterable<[string, Upload]>).map(
            ([uploadId, upload]) => (
              <UploadWidgetUploadItem key={uploadId} upload={upload} uploadId={uploadId} />
            )
          )}
        </div>
      )}
    </div>
  );
}