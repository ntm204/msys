import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import { useTheme } from "next-themes";

const PriceBoard: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [subTabs, setSubTabs] = useState<Array<{ id: number; name: string }>>([]);

  // Load saved tabs from localStorage
  React.useEffect(() => {
    if (mounted) {
      const savedTabs = localStorage.getItem("priceBoardTabs");
      const savedActiveTab = localStorage.getItem("priceBoardActiveTab");

      if (savedTabs) {
        try {
          const parsedTabs = JSON.parse(savedTabs);
          setSubTabs(Array.isArray(parsedTabs) ? parsedTabs : []);
        } catch {
          setSubTabs([]);
        }
      }

      if (savedActiveTab && !isNaN(parseInt(savedActiveTab))) {
        setActiveSubTab(parseInt(savedActiveTab));
      }
    }
  }, [mounted]);

  // Save tabs to localStorage whenever tabs change
  React.useEffect(() => {
    if (mounted && subTabs.length > 0) {
      localStorage.setItem("priceBoardTabs", JSON.stringify(subTabs));
      localStorage.setItem("priceBoardActiveTab", activeSubTab.toString());
    }
  }, [mounted, subTabs, activeSubTab]);

  const addSubTab = () => {
    const newTab = {
      id: Date.now(), // Use timestamp for unique ID
      name: "new tab"
    };
    const newTabs = [...subTabs, newTab];
    setSubTabs(newTabs);
    setActiveSubTab(newTabs.length - 1); // Set to the newly added tab
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex items-center justify-between"
        style={{ height: "35px" }}
      >
        {/* Các tab nhỏ */}
        <div className="flex items-center gap-1 pl-2">
          {subTabs.map((tab, index) => (
            <React.Fragment key={tab.id}>
              <button
                className={`px-3 py-1 text-sm font-medium transition-colors cursor-pointer border-none rounded-xs ${
                  activeSubTab === index
                    ? "bg-blue-500 text-white border-b-2 border-blue-600"
                    : isDark
                      ? "text-gray-300 bg-[#262b3f] hover:bg-[#2d3748]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveSubTab(index)}
                style={{
                  minWidth: "60px",
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
                title={tab.name}
              >
                {tab.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Dấu cộng bên phải */}
        <button
          className={`flex items-center justify-center w-12 h-12 rounded-sm border-none bg-transparent cursor-pointer transition-colors ${
            isDark
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={addSubTab}
          title="Thêm tab mới"
        >
          <FiPlus size={22} />
        </button>
      </div>

      {/* Đường line phân cách dưới tab - full width */}
      <div className={`mx-2 h-px ${
        isDark ? "bg-gray-700" : "bg-gray-200"
      }`} style={{ marginTop: "-3px" }} />

      {/* Nội dung chính của bảng giá */}
      <div className="flex-1 p-4 bg-transparent">
        {subTabs.length === 0 ? (
          <div className={`text-center mt-8 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            <div className="mb-4">Chưa có tab nào được tạo</div>
            <div className="text-sm">Nhấn dấu + để tạo tab đầu tiên</div>
          </div>
        ) : (
          <div className={`text-center mt-8 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            Nội dung bảng giá sẽ hiển thị ở đây
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceBoard;
