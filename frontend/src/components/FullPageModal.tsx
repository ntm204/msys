import React from "react";
import { FiX } from "react-icons/fi";

interface FullPageModalProps {
  tabs: Array<{ key: string; label: string }>;
  activeTab: string;
  onTabChange: (key: string) => void;
  onClose: () => void;
  children: React.ReactNode;
}

const HEADER_HEIGHT = 50; // px
const MODAL_HEADER_OFFSET = 10; // px

const FullPageModal: React.FC<FullPageModalProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onClose,
  children,
}) => {
  return (
    <div
      className="fixed left-0 right-0 z-50 flex flex-col bg-white shadow-xl rounded-none min-w-screen"
      style={{
        top: HEADER_HEIGHT + MODAL_HEADER_OFFSET,
        bottom: 10,
        minHeight: `calc(100vh - ${
          HEADER_HEIGHT + MODAL_HEADER_OFFSET + 10
        }px)`,
      }}
    >
      {/* Modal Header: Tabs + Close */}
      <div className="relative flex items-center rounded-none bg-gray-100 h-[30px] min-h-[30px] max-h-[30px]">
        <div className="flex items-center h-full">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`flex items-center h-full cursor-pointer rounded-none px-2 py-0 min-h-[30px] text-[15px] font-medium text-[#888] ${
                activeTab === tab.key ? "bg-white" : "bg-gray-100"
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              <span
                className={
                  activeTab === tab.key
                    ? "text-[#222] font-medium"
                    : "text-[#888] font-medium"
                }
              >
                {tab.label}
              </span>
              <button
                className="ml-4 rounded-sm border-none bg-transparent p-0 cursor-pointer"
                aria-label="Đóng tab"
                onClick={(e) => {
                  e.stopPropagation();
                  // Chỉ còn 1 tab thì đóng cả modal
                  if (tabs.length === 1) {
                    onClose();
                  } else {
                    // Còn nhiều hơn 1 tab thì chỉ đóng tab này
                    if (typeof window !== "undefined") {
                      if (typeof (window as any).onCloseTab === "function") {
                        (window as any).onCloseTab(tab.key);
                      }
                    }
                  }
                }}
                tabIndex={-1}
              >
                <FiX
                  size={16}
                  className={
                    activeTab === tab.key
                      ? "font-bold text-[#222]"
                      : "font-bold text-[#888]"
                  }
                />
              </button>
            </div>
          ))}
        </div>
        <button
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-[22px] text-[#888]"
          aria-label="Đóng modal"
          onClick={onClose}
        >
          <FiX size={22} className="font-bold" />
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-white rounded-none mt-[5px]">
        {children}
      </div>
    </div>
  );
};

export default FullPageModal;
