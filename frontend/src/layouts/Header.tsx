"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import {
  FiMenu,
  FiBell,
  FiRefreshCw,
  FiUser,
  FiChevronRight,
  FiGrid,
  FiFileText,
  FiBriefcase,
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
  FiX,
} from "react-icons/fi";
import FullPageModal from "@/components/FullPageModal";
import PriceBoard from "@/components/market/PriceBoard";
import OrderManage from "@/components/order/OrderManage";
import PlaceOrder from "@/components/order/PlaceOrder";
import AccountDetail from "@/components/account/AccountDetail";
import OpenPositions from "@/components/account/OpenPositions";
import SettlePosition from "@/components/account/SettlePosition";
import { useTheme } from "next-themes";

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
  // { icon: FiCircle, label: "Giao diện" }, // Removed - theme toggle now handled by direct button
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
  // "Giao diện": [ // Removed - theme toggle now handled by direct button
  //   { label: "Giao diện sáng", icon: FiSun },
  //   { label: "Giao diện tối", icon: FiMoon },
  // ],
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

const TAB_CONFIG: Record<
  string,
  { label: string; component: React.ReactNode }
> = {
  "price-board": { label: "Bảng giá", component: <PriceBoard /> },
  "order-manage": { label: "Quản lý đặt lệnh", component: <OrderManage /> },
  "place-order": { label: "Đặt lệnh", component: <PlaceOrder /> },
  "account-detail": {
    label: "Chi tiết tài khoản",
    component: <AccountDetail />,
  },
  "open-positions": { label: "Trạng thái mở", component: <OpenPositions /> },
  "settle-position": {
    label: "Trạng thái tất toán",
    component: <SettlePosition />,
  },
};

// Memoized Components
const MenuItem = memo(({ icon: Icon, label, onSubmenuClick, theme }: any) => {
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();
  const hasSubmenu = !!SUBMENU_ITEMS[label];
  const showArrow = hasSubmenu;

  return (
    <div
      className="flex items-center px-6 py-2 gap-3 text-gray-700 cursor-pointer transition-colors duration-150 group hover:text-blue-600 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={16} />
      <span className="flex-1 text-base">{t(`Header.${label}`)}</span>
      {showArrow && (
        <FiChevronRight size={16} className="group-hover:text-blue-600" />
      )}
      {hasSubmenu && hovered && showArrow && (
        <div
          className="absolute left-full top-0 min-w-[160px] bg-white z-50 rounded-lg py-1 px-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.24)]"
          style={{ marginLeft: "-16px", width: "auto", whiteSpace: "nowrap" }}
        >
          {SUBMENU_ITEMS[label].map((sub) => (
            <div
              key={sub.label}
              className="flex items-center px-2 py-2 gap-2 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors text-sm rounded-sm"
              onClick={() => onSubmenuClick?.(sub.label)}
            >
              {sub.icon && <sub.icon size={16} />}
              <span>{t(`Header.${sub.label}`)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

MenuItem.displayName = "MenuItem";

const MegaMenu = memo(({ onSubmenuClick, isClosing, theme }: any) => (
  <div
    className={`absolute left-[-8px] top-[48px] w-[290px] bg-white rounded-sm shadow-xl z-[999] ${
      isClosing ? "animate-slide-up" : "animate-slide-down"
    }`}
  >
    <div className="absolute -top-2 left-2 w-0 h-0" style={{ zIndex: 1000 }}>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path
          d="M12 0L0 12H24L12 0Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="1"
        />
      </svg>
    </div>
    <div className="py-2">
      {MENU_ITEMS.map((item, idx) =>
        "divider" in item ? (
          <div key={`divider-${idx}`} className="flex justify-center my-2">
            <div className="border-t border-gray-200 w-[250px]" />
          </div>
        ) : (
          <MenuItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            onSubmenuClick={onSubmenuClick}
            theme={theme}
          />
        )
      )}
    </div>
  </div>
));

MegaMenu.displayName = "MegaMenu";

const BellModal = memo(
  ({
    isClosing,
    activeTab,
    onTabChange,
    onClose,
    tabRefs,
    indicatorStyle,
    theme,
  }: any) => {
    const { t } = useTranslation();
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10"
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-sm shadow-2xl w-[500px] min-h-[520px] flex flex-col ${
            isClosing ? "animate-bell-modal-out" : "animate-bell-modal-in"
          }`}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="relative flex flex-col bg-white rounded-sm">
            <div className="flex items-center h-[50px] px-6 relative">
              <span className="text-lg font-bold text-black">
                {t("Header.Thông báo")}
              </span>
              <button
                className="absolute right-4 flex items-center justify-center w-8 h-8 rounded-md text-[#888]"
                onClick={onClose}
              >
                <FiX size={22} className="cursor-pointer" />
              </button>
            </div>
            <div className="border-t border-gray-200 w-full" />
            <div
              className="relative flex items-start border-gray-200"
              style={{ height: 40 }}
            >
              {MODAL_TABS.map((tab, idx) => (
                <button
                  key={tab}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  className={`text-base font-light px-4 py-2 transition-colors cursor-pointer ${
                    activeTab === idx
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => onTabChange(idx)}
                >
                  {t(`Header.${tab}`)}
                </button>
              ))}
              <span
                className="absolute bottom-0 h-[1.5px] bg-blue-500 transition-all duration-300"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            </div>
            <div className="border-t border-gray-200 w-full" />
          </div>
          <div className="flex-1 p-6 bg-white rounded-xl" />
        </div>
      </div>
    );
  }
);

BellModal.displayName = "BellModal";

// Main Component
const Header: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [state, setState] = useState({
    showDropdown: false,
    showModal: false,
    showMegaMenu: false,
    showBellModal: false,
    isMegaMenuClosing: false,
    isBellModalClosing: false,
    activeTab: 0,
    currentLang: null as (typeof LANGUAGES)[number] | null,
    isMounted: false,
    modalTabs: [] as Array<{ key: string; label: string }>,
    activeModalTab: "",
  });

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }));

  // Sử dụng functional update để tránh stale closure
  const handleCloseTab = useCallback((key: string) => {
    setState((prevState) => {
      const newTabs = prevState.modalTabs.filter((t) => t.key !== key);
      return {
        ...prevState,
        modalTabs: newTabs,
        activeModalTab:
          prevState.activeModalTab === key
            ? newTabs[newTabs.length - 1]?.key || ""
            : prevState.activeModalTab,
        showModal: newTabs.length > 0,
      };
    });
  }, []);

  const handleSubmenuClick = useCallback(
    (label: string) => {
      let tabKey = "";
      if (label === "Bảng giá") tabKey = "price-board";
      if (label === "Quản lý đặt lệnh") tabKey = "order-manage";
      if (label === "Đặt lệnh") tabKey = "place-order";
      if (label === "Chi tiết tài khoản") tabKey = "account-detail";
      if (label === "Trạng thái mở") tabKey = "open-positions";
      if (label === "Trạng thái tất toán") tabKey = "settle-position";

      // Theme toggle now handled by direct button only
      // if (label === "Giao diện sáng") {
      //   setTheme("light");
      //   return;
      // }
      // if (label === "Giao diện tối") {
      //   setTheme("dark");
      //   return;
      // }

      if (tabKey) {
        setState((prevState) => ({
          ...prevState,
          modalTabs: prevState.modalTabs.find((t) => t.key === tabKey)
            ? prevState.modalTabs
            : [
                ...prevState.modalTabs,
                { key: tabKey, label: t(`Header.${TAB_CONFIG[tabKey].label}`) },
              ],
          activeModalTab: tabKey,
          showModal: true,
          isMegaMenuClosing: true,
        }));
        setTimeout(
          () => updateState({ showMegaMenu: false, isMegaMenuClosing: false }),
          300
        );
      }
    },
    [t]
  );

  useEffect(() => {
    if (
      (state.showModal || state.showBellModal) &&
      tabRefs.current[state.activeTab]
    ) {
      const tab = tabRefs.current[state.activeTab];
      if (tab)
        setIndicatorStyle({ left: tab.offsetLeft, width: tab.offsetWidth });
    }
  }, [state.activeTab, state.showModal, state.showBellModal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        updateState({ showDropdown: false });
      }
    };
    if (state.showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [state.showDropdown]);

  useEffect(() => {
    updateState({ isMounted: true });
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedLang");
      const selectedLang =
        LANGUAGES.find((l) => l.key === saved) || LANGUAGES[1];
      updateState({ currentLang: selectedLang });
      i18n.changeLanguage(selectedLang.key);

      const savedTabs = localStorage.getItem("modalTabs");
      const savedActiveTab = localStorage.getItem("activeModalTab");
      let modalTabs: Array<{ key: string; label: string }> = [];
      if (savedTabs) {
        try {
          const parsedTabs = JSON.parse(savedTabs);
          modalTabs = Array.isArray(parsedTabs)
            ? parsedTabs.map((tab: any) => ({
                key: tab.key,
                label: t(`Header.${TAB_CONFIG[tab.key]?.label || tab.key}`),
              }))
            : [];
        } catch {}
      }
      updateState({
        modalTabs,
        activeModalTab: savedActiveTab || "",
        showModal: modalTabs.length > 0,
      });
    }
    (window as any).onCloseTab = handleCloseTab;
  }, [handleCloseTab, i18n]);

  useEffect(() => {
    if (state.isMounted) {
      localStorage.setItem("modalTabs", JSON.stringify(state.modalTabs));
      localStorage.setItem("activeModalTab", state.activeModalTab);
    }
  }, [state.modalTabs, state.activeModalTab, state.isMounted]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      modalTabs: prevState.modalTabs.map((tab) => ({
        key: tab.key,
        label: t(`Header.${TAB_CONFIG[tab.key]?.label || tab.key}`),
      })),
    }));
  }, [i18n.language]);

  return (
    <header
      className={`h-[50px] flex items-center px-6 relative z-10 justify-between`}
      style={{
        backgroundColor: mounted && theme === "dark" ? '#1F2330' : '#f5f5f5',
        boxShadow: mounted && theme === "dark"
          ? '0 0 15px 2px #454870'
          : '0 0 15px 2px #758696'
      }}
    >
      <div
        className="flex items-center relative"
        onMouseEnter={() => {
          clearTimeout(menuTimeoutRef.current!);
          updateState({ showMegaMenu: true });
        }}
        onMouseLeave={() => {
          menuTimeoutRef.current = setTimeout(
            () => updateState({ showMegaMenu: false }),
            200
          );
        }}
      >
        <FiMenu size={24} className={`${mounted && theme === "dark" ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`} />
        <span
          className={`ml-5 text-xl font-mono font-bold tracking-wide select-none ${mounted && theme === "dark" ? 'text-gray-100' : 'text-gray-800'}`}
          style={{ letterSpacing: "0.08em" }}
        >
          MSYSTEM
        </span>
        {state.showMegaMenu && (
          <MegaMenu
            onSubmenuClick={handleSubmenuClick}
            isClosing={state.isMegaMenuClosing}
            theme={theme}
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <FiBell
          size={22}
          className={`${mounted && theme === "dark" ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'} cursor-pointer transition-colors`}
          onClick={() =>
            updateState({ showBellModal: true, isBellModalClosing: false })
          }
        />
        <span className={`mx-1 ${mounted && theme === "dark" ? 'text-gray-600' : 'text-gray-300'}`}>|</span>
        <FiRefreshCw
          size={22}
          className={`${mounted && theme === "dark" ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'} cursor-pointer transition-colors`}
        />
        <span className={`mx-1 ${mounted && theme === "dark" ? 'text-gray-600' : 'text-gray-300'}`}>|</span>

        <div className="relative" ref={dropdownRef}>
          {state.isMounted && state.currentLang && (
            <img
              src={state.currentLang.icon}
              alt={state.currentLang.label}
              className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => updateState({ showDropdown: !state.showDropdown })}
            />
          )}
          {state.showDropdown && state.isMounted && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-sm shadow-lg z-[101] animate-slide-down">
              {LANGUAGES.map((lang, idx) => (
                <React.Fragment key={lang.key}>
                  {idx > 0 && <div className="border-t border-gray-200" />}
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      updateState({ currentLang: lang, showDropdown: false });
                      localStorage.setItem("selectedLang", lang.key);
                      i18n.changeLanguage(lang.key);
                    }}
                  >
                    <img src={lang.icon} alt={lang.label} className="w-6 h-6" />
                    <span className="text-black">{lang.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <span className={`mx-1 ${mounted && theme === "dark" ? 'text-gray-600' : 'text-gray-300'}`}>|</span>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`${theme === "dark" ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'} cursor-pointer transition-colors`}
            title={`Chuyển sang ${theme === "dark" ? 'giao diện sáng' : 'giao diện tối'}`}
          >
            {theme === "dark" ? <FiSun size={22} /> : <FiMoon size={22} />}
          </button>
        )}
        <span className={`mx-1 ${mounted && theme === "dark" ? 'text-gray-600' : 'text-gray-300'}`}>|</span>
        <FiUser
          size={22}
          className={`${mounted && theme === "dark" ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'} cursor-pointer transition-colors`}
        />
      </div>

      {state.showModal && (
        <FullPageModal
          tabs={state.modalTabs}
          activeTab={state.activeModalTab}
          onTabChange={(key) => updateState({ activeModalTab: key })}
          onClose={() =>
            updateState({ showModal: false, modalTabs: [], activeModalTab: "" })
          }
        >
          <div className="min-h-[400px] p-4">
            {state.activeModalTab &&
              TAB_CONFIG[state.activeModalTab]?.component}
          </div>
        </FullPageModal>
      )}

      {state.showBellModal && (
        <BellModal
          isClosing={state.isBellModalClosing}
          activeTab={state.activeTab}
          onTabChange={(idx: number) => updateState({ activeTab: idx })}
          onClose={() => {
            updateState({ isBellModalClosing: true });
            setTimeout(
              () =>
                updateState({
                  showBellModal: false,
                  isBellModalClosing: false,
                }),
              300
            );
          }}
          tabRefs={tabRefs}
          indicatorStyle={indicatorStyle}
          theme={theme}
        />
      )}
    </header>
  );
};

export default Header;
