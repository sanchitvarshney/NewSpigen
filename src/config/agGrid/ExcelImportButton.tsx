import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileExcel } from "react-icons/fa";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { uploadExcel } from "@/features/salesmodule/createSalesOrderSlice";
import { toast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store";

interface ExcelImportButtonProps {
  onImport: (data: any) => void;
}

const ExcelImportButton: React.FC<ExcelImportButtonProps> = ({ onImport }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setLoading(true);
        setError(null);
        dispatch(uploadExcel({ file }))
          .then((resultAction: any) => {
            if (resultAction.payload?.success) {
              toast({
                title:
                  typeof resultAction?.payload?.message === "string"
                    ? resultAction?.payload?.message
                    : JSON.stringify(resultAction?.payload?.message),
                className: "bg-green-600 text-white items-center",
              });
            }
            //  else {
            //   toast({
            //     title:
            //       typeof resultAction?.error?.message === "string"
            //         ? resultAction?.error?.message
            //         : JSON.stringify(resultAction?.error?.message),
            //     className: "bg-red-600 text-white items-center",
            //   });
            // }
            if (uploadExcel.fulfilled.match(resultAction)) {
              // handleFileRead(file);
              onImport(resultAction.payload); // Pass backend response here
            } else {
              setError("Failed to upload the file. Please try again.");
            }
          })
          .catch(() => setError("Failed to upload the file. Please try again."))
          .finally(() => setLoading(false));
      }
    },
    [dispatch, onImport]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex items-center flex-col justify-center h-full px-5"
    >
      <input {...getInputProps()} accept=".xlsx, .xls" />
      <div className="flex flex-col items-center justify-center w-full h-full border-dashed py-5 rounded border-2 border-slate-400">
        <div className="w-36 h-36 bg-[#21734621] rounded-full flex justify-center items-center">
          {loading ? (
            <ReloadIcon className="h-12 w-12 text-[#217346] animate-spin" />
          ) : (
            <FaFileExcel className="h-12 w-12 text-[#217346]" />
          )}
        </div>
        <p className="text-gray-600 text-lg mt-2">
          {isDragActive
            ? "Drop the file here..."
            : loading
            ? "Uploading..."
            : "Drag and drop your file here"}
        </p>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ExcelImportButton;
