"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  FiMenu,
  FiBell,
  FiRefreshCw,
  FiUser,
  FiChevronRight,
  FiGrid,
  FiFileText,
  FiBriefcase,
  FiCircle,
  FiType,
  FiRotateCcw,
  FiBarChart2,
  FiSun,
  FiMoon,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiZoomIn,
  FiZoomOut,
  FiAlignJustify,
  FiClipboard,
  FiList,
} from "react-icons/fi";

// Constants
const LANGUAGES = [
  { key: "en", label: "English", icon: "/english.svg" },
  { key: "vi", label: "Việt Nam", icon: "/vietnam.svg" },
] as const;

const MODAL_TABS = ["Lệnh/Giao dịch", "Quản trị", "Hệ thống"] as const;

const MENU_ITEMS = [
  { icon: FiGrid, label: "Thị trường" },
  { icon: FiFileText, label: "Quản lý đặt lệnh" },
  { icon: FiBriefcase, label: "Quản lý tài khoản" },
  { divider: true },
  { icon: FiCircle, label: "Giao diện" },
  { icon: FiType, label: "Kích thước" },
  { icon: FiRotateCcw, label: "Đặt lại giao diện" },
  { divider: true },
  { icon: FiBarChart2, label: "Báo cáo" },
] as const;

const SUBMENU_ITEMS: Record<string, Array<{ label: string; icon?: any }>> = {
  "Thị trường": [{ label: "Bảng giá", icon: FiClipboard }],
  "Quản lý đặt lệnh": [
    { label: "Đặt lệnh", icon: FiCheckCircle },
    { label: "Quản lý đặt lệnh", icon: FiList },
  ],
  "Quản lý tài khoản": [
    { label: "Trạng thái mở", icon: FiCheckCircle },
    { label: "Trạng thái tất toán", icon: FiXCircle },
    { label: "Chi tiết tài khoản", icon: FiInfo },
  ],
  "Giao diện": [
    { label: "Giao diện sáng", icon: FiSun },
    { label: "Giao diện tối", icon: FiMoon },
  ],
  "Kích thước": [
    { label: "Nhỏ", icon: FiZoomOut },
    { label: "Trung bình", icon: FiAlignJustify },
    { label: "Lớn", icon: FiZoomIn },
  ],
  "Báo cáo": [
    { label: "Báo cáo giao dịch" },
    { label: "Báo cáo lịch sử nộp rút tiền" },
    { label: "Báo cáo sao kê khách hàng" },
  ],
};

const MENU_DELAY = 200;
const ANIMATION_DURATION = 300;

// Memoized Components
const MenuItem = memo(({ icon: Icon, label }: { icon: any; label: string }) => {
  const hasSubmenu = SUBMENU_ITEMS[label];
  const [hovered, setHovered] = useState(false);
  const showArrow = hasSubmenu && label !== "Đặt lại giao diện";

  return (
    <div
      className="flex items-center px-6 py-2 gap-3 text-gray-700 cursor-pointer transition-colors duration-150 group hover:text-blue-600 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="w-5 h-5 flex items-center justify-center">
        <Icon size={16} />
      </span>
      <span className="flex-1 text-base font-normal">{label}</span>
      {showArrow && (
        <FiChevronRight
          size={16}
          className="text-gray-700 font-bold group-hover:text-blue-600"
        />
      )}
      {hasSubmenu && hovered && showArrow && (
        <div
          className={`absolute left-full top-0 ${
            label === "Báo cáo"
              ? "min-w-[220px]"
              : label === "Quản lý tài khoản"
              ? "min-w-[160px]"
              : "min-w-[160px]"
          } bg-white z-50 flex flex-col rounded-lg py-1 px-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.24)]`}
          style={{ marginLeft: "-16px" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {SUBMENU_ITEMS[label].map((sub) => (
            <div
              key={sub.label}
              className={`flex items-center px-2 py-2 gap-2 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors text-sm rounded-lg${
                label === "Báo cáo" || label === "Quản lý tài khoản"
                  ? " whitespace-nowrap"
                  : ""
              }`}
            >
              {sub.icon && (
                <span className="w-4 h-4 flex items-center justify-center">
                  <sub.icon size={16} />
                </span>
              )}
              <span className="flex-1">{sub.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
MenuItem.displayName = "MenuItem";

const LanguageDropdown = memo(({ onClose }: { onClose: () => void }) => (
  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg border z-20 animate-slide-down">
    {LANGUAGES.map((lang, idx) => (
      <React.Fragment key={lang.key}>
        {idx > 0 && <div className="border-t" />}
        <button
          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <img src={lang.icon} alt={lang.label} className="w-6 h-6" />
          <span className="text-black">{lang.label}</span>
        </button>
      </React.Fragment>
    ))}
  </div>
));
LanguageDropdown.displayName = "LanguageDropdown";

const MegaMenu = memo(() => (
  <div className="absolute left-[-8px] top-[48px] w-[290px] bg-white rounded-lg shadow-xl border z-50 animate-slide-down">
    {/* Arrow */}
    <div className="absolute -top-2 left-2 w-0 h-0" style={{ zIndex: 51 }}>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path
          d="M12 0L0 12H24L12 0Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="1"
        />
      </svg>
    </div>

    {/* Menu Items */}
    <div className="py-2">
      {MENU_ITEMS.map((item, idx) =>
        "divider" in item ? (
          <div key={`divider-${idx}`} className="flex justify-center my-2">
            <div className="border-t w-2/3" />
          </div>
        ) : (
          <MenuItem key={item.label} icon={item.icon} label={item.label} />
        )
      )}
    </div>
  </div>
));
MegaMenu.displayName = "MegaMenu";

const ModalContent = memo(
  ({
    activeTab,
    onTabChange,
    indicatorStyle,
    tabRefs,
  }: {
    activeTab: number;
    onTabChange: (idx: number) => void;
    indicatorStyle: { left: number; width: number };
    tabRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  }) => (
    <>
      <div className="flex items-center justify-between px-6 pt-4 pb-4">
        <span className="text-lg text-black font-bold">Thông báo</span>
      </div>
      <div className="border-b" />

      {/* Tabs */}
      <div className="flex items-center px-6 pt-2 pb-0 gap-0 relative">
        {MODAL_TABS.map((tab, idx) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            className={`text-sm pb-2 px-4 transition-colors duration-200 relative cursor-pointer hover:text-blue-500 ${
              activeTab === idx ? "text-blue-600" : "text-gray-700"
            }`}
            onClick={() => onTabChange(idx)}
          >
            {tab}
          </button>
        ))}
        <span
          className="absolute bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
      <div className="border-b mt-2" />
      <div className="h-[300px]" />
    </>
  )
);
ModalContent.displayName = "ModalContent";

// Main Header Component
const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState<
    (typeof LANGUAGES)[number] | null
  >(null);
  const [isMounted, setIsMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Memoized callbacks
  const handleOpenModal = useCallback(() => {
    setShowModal(true);
    setIsModalClosing(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsModalClosing(false);
    }, ANIMATION_DURATION);
  }, []);

  const handleMouseEnterMenu = useCallback(() => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setShowMegaMenu(true);
  }, []);

  const handleMouseLeaveMenu = useCallback(() => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    menuTimeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, MENU_DELAY);
  }, []);

  const handleTabChange = useCallback((idx: number) => {
    setActiveTab(idx);
  }, []);

  const toggleDropdown = useCallback(() => {
    setShowDropdown((v) => !v);
  }, []);

  const closeDropdown = useCallback(() => {
    setShowDropdown(false);
  }, []);

  const handleSelectLang = useCallback((lang: (typeof LANGUAGES)[number]) => {
    setCurrentLang(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedLang", lang.key);
    }
    setShowDropdown(false);
  }, []);

  // Update tab indicator
  useEffect(() => {
    if (showModal && tabRefs.current[activeTab]) {
      const tab = tabRefs.current[activeTab];
      if (tab) {
        setIndicatorStyle({
          left: tab.offsetLeft,
          width: tab.offsetWidth,
        });
      }
    }
  }, [activeTab, showModal]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (showDropdown || showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown, showModal, handleCloseModal]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const savedLangKey = localStorage.getItem("selectedLang");
      const foundLang = LANGUAGES.find((l) => l.key === savedLangKey);
      setCurrentLang(foundLang || LANGUAGES[1]);
    }
  }, []);

  return (
    <header className="h-[50px] bg-white shadow-md flex items-center px-6 relative z-10 justify-between">
      {/* Left: Menu icon */}
      <div
        ref={menuContainerRef}
        className="flex items-center relative"
        onMouseEnter={handleMouseEnterMenu}
        onMouseLeave={handleMouseLeaveMenu}
      >
        <FiMenu size={24} className="text-gray-700 cursor-pointer" />
        {showMegaMenu && <MegaMenu />}
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <FiBell
          size={22}
          className="text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
          onClick={handleOpenModal}
        />
        <span className="mx-1 text-gray-300">|</span>
        <FiRefreshCw
          size={22}
          className="text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
        />
        <span className="mx-1 text-gray-300">|</span>

        {/* Language Selector */}
        <div className="relative" ref={dropdownRef}>
          {isMounted && currentLang ? (
            <img
              src={currentLang.icon}
              alt={currentLang.label}
              className="w-6 h-6 border-none cursor-pointer hover:opacity-80 transition-opacity"
              onClick={toggleDropdown}
            />
          ) : (
            <div className="w-6 h-6" />
          )}
          {showDropdown && isMounted && currentLang && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg border z-20 animate-slide-down">
              {LANGUAGES.map((lang, idx) => (
                <React.Fragment key={lang.key}>
                  {idx > 0 && <div className="border-t" />}
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => handleSelectLang(lang)}
                  >
                    <img src={lang.icon} alt={lang.label} className="w-6 h-6" />
                    <span className="text-black">{lang.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <span className="mx-1 text-gray-300">|</span>
        <FiUser
          size={22}
          className="text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center pt-[60px] transition-opacity duration-300 ${
            isModalClosing ? "opacity-0" : "opacity-100"
          }`}
          style={{ background: "rgba(0,0,0,0.06)" }}
        >
          <div
            ref={modalRef}
            className={`bg-white rounded-lg shadow-xl w-[600px] max-w-full p-0 relative transition-all duration-300 ease-out ${
              isModalClosing
                ? "opacity-0 -translate-y-12"
                : "opacity-100 translate-y-0"
            }`}
          >
            <button
              className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-xl z-10"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <ModalContent
              activeTab={activeTab}
              onTabChange={handleTabChange}
              indicatorStyle={indicatorStyle}
              tabRefs={tabRefs}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
