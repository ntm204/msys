import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";

interface CustomerStatementReportProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const CustomerStatementReport: React.FC<CustomerStatementReportProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!startDate) {
      toast.error(t("Report.Vui lòng chọn ngày bắt đầu"));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Downloading customer statement report:", {
        startDate,
        fileType,
      });
    } catch (error) {
      console.error("Error generating customer statement report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 rounded-lg shadow-xl bg-white">
        {/* Header */}
        <div className="flex items-center px-8 pt-8 pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Báo cáo thống kê khách hàng
          </h2>
        </div>

        <div className="p-6">
          {/* Date Section - Only start date */}
          <div className="mb-6">
            <div className="flex items-start gap-6">
              {/* Left side - Labels */}
              <div className="w-32">
                <h3 className="text-sm font-medium mb-3 text-gray-700">
                  Ngày thực hiện
                </h3>
              </div>

              {/* Right side - Date input */}
              <div className="flex-1 flex gap-3 items-end">
                <div className="flex-1 max-w-xs">
                  <label className="block text-xs font-medium mb-1 text-gray-600">
                    Ngày bắt đầu
                  </label>
                  <div className="relative h-10">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      style={{ colorScheme: "light" }}
                    />
                    <div
                      className={`w-full h-full px-3 py-2 rounded-md border text-sm bg-white flex items-center hover:border-blue-400 transition-colors ${
                        startDate
                          ? "border-gray-900 text-gray-900"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      <span className="flex-1">
                        {startDate || "Chọn ngày bắt đầu"}
                      </span>
                      <FiCalendar className="text-gray-400" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Type Section - Compact */}
          <div className="flex items-start gap-6 mb-6">
            {/* Left side - Labels */}
            <div className="w-32">
              <h3 className="text-sm font-medium mb-3 text-gray-700">
                Loại tập tin
              </h3>
            </div>

            {/* Right side - File type options */}
            <div className="flex-1 space-y-2">
              <label className="flex items-center cursor-pointer group py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="fileType"
                  value="pdf"
                  checked={fileType === "pdf"}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  style={{ colorScheme: "light" }}
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  Adobe Acrobat (.pdf)
                </span>
              </label>

              <label className="flex items-center cursor-pointer group py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="fileType"
                  value="docx"
                  checked={fileType === "docx"}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  style={{ colorScheme: "light" }}
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  Microsoft Office Word (.docx)
                </span>
              </label>

              <label className="flex items-center cursor-pointer group py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="fileType"
                  value="xlsx"
                  checked={fileType === "xlsx"}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  style={{ colorScheme: "light" }}
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  Microsoft Office Excel (.xlsx)
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Download report"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatementReport;
