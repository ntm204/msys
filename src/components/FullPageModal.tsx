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
      <div className="relative flex items-center rounded-none bg-[#e3e8ef] h-[30px] min-h-[30px] max-h-[30px]">
        <div className="flex items-center h-full">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`flex items-center h-full cursor-pointer rounded-none px-2 py-0 mr-1 min-h-[30px] text-[15px] font-medium text-[#888] ${
                activeTab === tab.key
                  ? "bg-white border-t-2 border-t-[#39ff14]"
                  : "bg-[#e3e8ef] border-t-transparent"
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              <span className="pr-1 text-[#888]">{tab.label}</span>
              <button
                className="ml-1 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-sm border-none bg-transparent p-0 text-[#888]"
                onClick={(e) => {
                  e.stopPropagation();
                  // Đóng tab: nếu còn nhiều tab thì chỉ đóng tab đó, nếu là tab cuối thì đóng modal
                  if (tabs.length > 1) {
                    if (typeof window !== "undefined") {
                      // Nếu có hàm onCloseTab thì gọi
                      if (typeof (window as any).onCloseTab === "function") {
                        (window as any).onCloseTab(tab.key);
                      }
                    }
                  } else {
                    onClose();
                  }
                }}
                tabIndex={-1}
              >
                <FiX size={16} className="font-bold text-[#888]" />
              </button>
            </div>
          ))}
        </div>
        {/* Close modal button căn giữa header modal */}
        <button
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-[22px] text-[#888]"
          onClick={onClose}
        >
          <FiX size={22} className="font-bold" />
        </button>
      </div>
      {/* Modal Content: cách header 5px, không bo góc */}
      <div className="flex-1 overflow-auto bg-white rounded-none mt-[5px]">
        {children}
      </div>
    </div>
  );
};

export default FullPageModal;
