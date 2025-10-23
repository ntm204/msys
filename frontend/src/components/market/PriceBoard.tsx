import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus, FiEdit2, FiTrash2, FiDownload } from "react-icons/fi";
import { useTheme } from "next-themes";

const MODAL_ANIMATION_DURATION = 300;

type Tab = { id: number; name: string };

const PriceBoard: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [subTabs, setSubTabs] = useState<Tab[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTabId, setEditingTabId] = useState<number | null>(null);
  const [deletingTabId, setDeletingTabId] = useState<number | null>(null);
  const [editingTabName, setEditingTabName] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [contractCode, setContractCode] = useState("");

  const isDark = mounted && theme === "dark";

  React.useEffect(() => setMounted(true), []);

  // Load saved tabs
  React.useEffect(() => {
    if (!mounted) return;
    try {
      const savedTabs = localStorage.getItem("priceBoardTabs");
      const savedActiveTab = localStorage.getItem("priceBoardActiveTab");
      if (savedTabs) setSubTabs(JSON.parse(savedTabs));
      if (savedActiveTab && !isNaN(+savedActiveTab))
        setActiveSubTab(+savedActiveTab);
    } catch (e) {
      setSubTabs([]);
    }
  }, [mounted]);

  // Save tabs
  React.useEffect(() => {
    if (mounted && subTabs.length > 0) {
      localStorage.setItem("priceBoardTabs", JSON.stringify(subTabs));
      localStorage.setItem("priceBoardActiveTab", activeSubTab.toString());
    }
  }, [mounted, subTabs, activeSubTab]);

  const addSubTab = () => {
    const newTabs = [
      ...subTabs,
      { id: Date.now(), name: t("PriceBoard.New tab") },
    ];
    setSubTabs(newTabs);
    setActiveSubTab(newTabs.length - 1);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEditModal(false);
      setEditingTabId(null);
      setEditingTabName("");
      setIsClosing(false);
    }, MODAL_ANIMATION_DURATION);
  };

  const closeDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeletingTabId(null);
      setIsClosing(false);
    }, MODAL_ANIMATION_DURATION);
  };

  const startEditTab = (tabId: number, tabName: string) => {
    setEditingTabId(tabId);
    setEditingTabName(tabName);
    setShowEditModal(true);
  };

  const startDeleteTab = (tabId: number) => {
    setDeletingTabId(tabId);
    setShowDeleteModal(true);
  };

  const confirmDeleteTab = () => {
    if (deletingTabId !== null) {
      const updatedTabs = subTabs.filter((tab) => tab.id !== deletingTabId);
      setSubTabs(updatedTabs);
      if (activeSubTab >= updatedTabs.length) {
        setActiveSubTab(Math.max(0, updatedTabs.length - 1));
      }
      closeDeleteModal();
    }
  };

  const saveEditTab = () => {
    if (editingTabId !== null && editingTabName.trim()) {
      setSubTabs(
        subTabs.map((tab) =>
          tab.id === editingTabId ? { ...tab, name: editingTabName } : tab
        )
      );
      closeModal();
    }
  };

  const currentTab = subTabs[activeSubTab];
  const darkBg = "bg-[#262b3f]";
  const darkText = "text-gray-300";
  const darkHover = `hover:bg-[#2d3748]`;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center justify-between h-8">
        <div className="flex items-center gap-1 pl-2 flex-1">
          {subTabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(index)}
              title={tab.name}
              className={`px-3 py-1 text-sm font-medium rounded-t-sm transition-colors border-none cursor-pointer min-w-15 max-w-37 overflow-hidden text-ellipsis whitespace-nowrap ${
                activeSubTab === index
                  ? "bg-blue-700 text-white border-b-2 border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                  : isDark
                  ? `${darkText} ${darkBg} ${darkHover}`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-current={activeSubTab === index ? "page" : undefined}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <button
          onClick={addSubTab}
          title={t("PriceBoard.Add new tab")}
          className={`flex items-center justify-center w-12 h-6 rounded-sm border-none bg-transparent cursor-pointer transition-colors ${
            isDark
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <FiPlus size={22} />
        </button>
      </div>

      {/* Divider */}
      <div
        className={`mx-2 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
        style={{ marginTop: "-3px" }}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-2 py-2">
        <input
          type="text"
          value={contractCode}
          onChange={(e) => setContractCode(e.target.value)}
          placeholder={t("PriceBoard.Enter contract code...")}
          className={`flex-1 px-3 py-1 rounded text-sm border transition-colors ${
            isDark
              ? `${darkBg} text-white border-gray-600 focus:border-blue-500 focus:outline-none`
              : "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:outline-none"
          }`}
        />

        <div className="flex items-center">
          {[
            {
              icon: FiEdit2,
              title: t("PriceBoard.Edit tab name"),
              onClick: () =>
                currentTab && startEditTab(currentTab.id, currentTab.name),
            },
            {
              icon: FiTrash2,
              title: t("PriceBoard.Delete tab"),
              onClick: () => currentTab && startDeleteTab(currentTab.id),
            },
            {
              icon: FiDownload,
              title: t("PriceBoard.Export CSV"),
              onClick: () => {},
            },
          ].map(({ icon: Icon, title, onClick }, i) => (
            <button
              key={i}
              onClick={onClick}
              title={title}
              className={`p-1 rounded transition-colors border-none bg-transparent cursor-pointer ${
                isDark
                  ? `text-gray-400 ${
                      i === 1 ? "hover:text-red-400" : "hover:text-gray-200"
                    } hover:bg-[#262b3f]`
                  : `text-gray-600 ${
                      i === 1 ? "hover:text-red-600" : "hover:text-gray-800"
                    } hover:bg-gray-200`
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 bg-transparent">
        <div
          className={`text-center mt-8 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {subTabs.length === 0 ? (
            <>
              <div className="mb-4">{t("PriceBoard.No tabs created yet")}</div>
              <div className="text-sm">
                {t("PriceBoard.Press + to create first tab")}
              </div>
            </>
          ) : (
            t("PriceBoard.Price board content will be displayed here")
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/10 flex items-start justify-center z-50 pt-20">
          <div
            className={`rounded-lg shadow-xl p-6 w-96 bg-white ${
              isClosing ? "animate-bell-modal-out" : "animate-bell-modal-in"
            }`}
          >
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("PriceBoard.Rename list")}
              </h3>
            </div>
            <input
              type="text"
              value={editingTabName}
              onChange={(e) => setEditingTabName(e.target.value)}
              onKeyDown={(e) => {
                if (isClosing) return;
                if (e.key === "Enter" && editingTabName.trim()) saveEditTab();
                else if (e.key === "Escape") closeModal();
              }}
              autoFocus
              placeholder={t("PriceBoard.Enter new list name...")}
              className="w-full px-3 py-2 rounded text-sm border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                disabled={isClosing}
                className="px-4 py-2 rounded text-sm font-medium transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {t("PriceBoard.Cancel")}
              </button>
              <button
                onClick={saveEditTab}
                disabled={!editingTabName.trim() || isClosing}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  editingTabName.trim() && !isClosing
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("PriceBoard.Save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/10 flex items-start justify-center z-50 pt-20">
          <div
            className={`rounded-lg shadow-xl p-6 w-96 bg-white ${
              isClosing ? "animate-bell-modal-out" : "animate-bell-modal-in"
            }`}
          >
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("PriceBoard.Confirm delete")}
              </h3>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                {t("PriceBoard.Are you sure you want to delete this tab?")}
              </p>
              <p className="text-sm text-gray-500">
                {t("PriceBoard.This action cannot be undone.")}
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={closeDeleteModal}
                disabled={isClosing}
                className="px-4 py-2 rounded text-sm font-medium transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {t("PriceBoard.No, cancel")}
              </button>
              <button
                onClick={confirmDeleteTab}
                disabled={isClosing}
                className="px-4 py-2 rounded text-sm font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
              >
                {t("PriceBoard.Yes, delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceBoard;
