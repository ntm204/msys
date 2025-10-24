import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiMove,
  FiFilter,
} from "react-icons/fi";
import { useTheme } from "next-themes";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MODAL_ANIMATION_DURATION = 300;

type Tab = { id: number; name: string };

type Column = {
  id: string;
  title: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
};

// Default columns configuration
const DEFAULT_COLUMNS: Column[] = [
  { id: "code", title: "KL chào mua", width: 120, minWidth: 80 },
  { id: "exchange", title: "Mã HD", width: 100, minWidth: 60 },
  { id: "position", title: "Position", width: 100, minWidth: 80 },
  { id: "bidPrice", title: "Giá khớp", width: 100, minWidth: 80 },
  { id: "askPrice", title: "Giá chào bán", width: 120, minWidth: 80 },
  { id: "buyQty", title: "Chờ mua", width: 100, minWidth: 80 },
  { id: "sellPrice", title: "KL chào bán", width: 120, minWidth: 80 },
  { id: "totalSell", title: "Giá chào bán", width: 120, minWidth: 80 },
  { id: "open", title: "Open", width: 80, minWidth: 60 },
  { id: "high", title: "High", width: 80, minWidth: 60 },
  { id: "low", title: "Low", width: 80, minWidth: 60 },
  { id: "close", title: "Close", width: 80, minWidth: 60 },
  { id: "change", title: "Thay đổi", width: 100, minWidth: 80 },
];

// All available columns (including hidden ones)
const ALL_COLUMNS: Column[] = [
  ...DEFAULT_COLUMNS,
  { id: "prevClose", title: "Prev. Close", width: 100, minWidth: 80 },
  { id: "volume", title: "KL khớp", width: 100, minWidth: 80 },
  { id: "changePercent", title: "Thay đổi", width: 100, minWidth: 80 },
  { id: "stepPrice", title: "Bước giá tối thiểu", width: 120, minWidth: 100 },
  { id: "contractDate", title: "Giá hợp đồng", width: 120, minWidth: 100 },
  {
    id: "lastUpdate",
    title: "Ngày giờ cập nhật gần nhất",
    width: 160,
    minWidth: 140,
  },
];

// Resizable and sortable column header component
const ColumnHeader: React.FC<{
  column: Column;
  isDark: boolean;
  onResize: (id: string, width: number) => void;
  onColumnClick: (id: string) => void;
  t: (key: string) => string;
}> = ({ column, isDark, onResize, onColumnClick, t }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const resizeRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: isResizing, // Disable drag when resizing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    width: `${column.width}px`,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  // Handle smart click/drag - simplified
  const handleColumnClick = useCallback(
    (e: React.MouseEvent) => {
      // Only trigger click if not dragging and not resizing
      if (!isDragging && !isResizing) {
        e.stopPropagation();
        onColumnClick(column.id);
      }
    },
    [isDragging, isResizing, onColumnClick, column.id]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(column.width);
      e.preventDefault();
      e.stopPropagation(); // Prevent drag from starting
    },
    [column.width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(
        10, // Allow very small width, even 1 character
        startWidth + (e.clientX - startX)
      );
      onResize(column.id, newWidth);
    },
    [isResizing, startWidth, startX, column.id, onResize]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center px-3 py-1.5 text-sm font-medium select-none mr-0.5 ${
        isDark ? "bg-[#3a4553] text-gray-200" : "bg-gray-100 text-gray-800"
      } ${isDragging ? "shadow-lg" : ""}`}
    >
      {/* Drag handle icon - only show when dragging */}
      {isDragging && (
        <div
          className={`flex items-center justify-center w-4 h-4 mr-2 relative z-10 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          <FiMove size={12} />
        </div>
      )}

      {/* Column title - clickable and draggable */}
      <div
        className="flex-1 relative z-10"
        {...attributes}
        {...listeners}
        onClick={handleColumnClick}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <span className="truncate block pointer-events-none">
          {t(`PriceBoard.${column.title}`)}
        </span>
      </div>

      {/* Resize handle - right edge */}
      <div
        ref={resizeRef}
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-20"
        onMouseDown={handleResizeMouseDown}
        title="Resize column"
      />
    </div>
  );
};

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
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isDark = mounted && theme === "dark";

  React.useEffect(() => setMounted(true), []);

  // Close column filter when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowColumnFilter(false);
      }
    };

    if (showColumnFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showColumnFilter]);

  // Load saved tabs
  React.useEffect(() => {
    if (!mounted) return;
    try {
      const savedTabs = localStorage.getItem("priceBoardTabs");
      const savedActiveTab = localStorage.getItem("priceBoardActiveTab");
      if (savedTabs) setSubTabs(JSON.parse(savedTabs));
      if (savedActiveTab && !isNaN(+savedActiveTab))
        setActiveSubTab(+savedActiveTab);
    } catch {
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
    const newTabs = [...subTabs, { id: Date.now(), name: "New Tab" }];
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

  // Handle column resize
  const handleColumnResize = useCallback((id: string, width: number) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, width } : col))
    );
  }, []);

  // Handle column click (for future sorting)
  const handleColumnClick = useCallback((id: string) => {
    console.log("Column clicked:", id);
    // TODO: Implement sorting logic here
  }, []);

  // Handle column drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const currentTab = subTabs[activeSubTab];
  const darkBg = "bg-[#3a4553]";
  const darkText = "text-gray-200";
  const darkHover = `hover:bg-[#4a5563]`;

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
                  ? isDark
                    ? "bg-blue-600 text-gray-200" // Đổi text-white thành text-gray-200
                    : "bg-blue-100 text-gray-800" // Đổi text-white thành text-gray-800
                  : isDark
                  ? `${darkText} ${darkBg} ${darkHover}`
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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
              ? `${darkBg} text-gray-200 border-gray-600 focus:border-blue-500 focus:outline-none` // Đổi text-white thành text-gray-200
              : "bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:outline-none" // Đổi text-gray-900 thành text-gray-800
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
                  : `text-gray-700 ${
                      i === 1 ? "hover:text-red-600" : "hover:text-gray-800"
                    } hover:bg-gray-200` // Đổi text-gray-600 thành text-gray-700
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Column Headers */}
      {subTabs.length > 0 && (
        <div className="mx-2 mr-3 relative">
          <div className="flex items-center justify-between">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columns}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex overflow-hidden flex-1">
                  {columns.map((column) => (
                    <ColumnHeader
                      key={column.id}
                      column={column}
                      isDark={isDark}
                      onResize={handleColumnResize}
                      onColumnClick={handleColumnClick}
                      t={t}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Column Filter Button */}
            <div className="relative ml-2" ref={filterRef}>
              <button
                onClick={() => setShowColumnFilter(!showColumnFilter)}
                className={`flex items-center justify-center w-8 h-8 rounded border transition-colors ${
                  isDark
                    ? "bg-[#3a4553] text-gray-200 border-gray-600 hover:bg-[#4a5563]"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
                title="Bộ lọc cột"
              >
                <FiFilter size={14} />
              </button>

              {/* Dropdown Filter Menu */}
              {showColumnFilter && (
                <div
                  className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl border z-50 max-h-64 overflow-y-auto ${
                    isDark
                      ? "bg-[#2a3441] border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-1">
                    {ALL_COLUMNS.map((col) => {
                      const isVisible = columns.some((c) => c.id === col.id);
                      return (
                        <label
                          key={col.id}
                          className={`flex items-center gap-2 px-2 py-1 text-xs rounded cursor-pointer hover:bg-opacity-50 ${
                            isDark
                              ? "text-gray-200 hover:bg-gray-700"
                              : "text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setColumns((prev) => [...prev, col]);
                              } else {
                                setColumns((prev) =>
                                  prev.filter((c) => c.id !== col.id)
                                );
                              }
                            }}
                            className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="flex-1 truncate">
                            {t(`PriceBoard.${col.title}`)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              className="w-full px-3 py-2 rounded text-sm border border-gray-300 bg-white text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" // Đổi text-gray-900 thành text-gray-800
            />
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                disabled={isClosing}
                className="px-4 py-2 rounded text-sm font-medium transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100" // Đổi text-gray-700 thành text-gray-700 (giữ nguyên vì đã là xám)
              >
                {t("PriceBoard.Cancel")}
              </button>
              <button
                onClick={saveEditTab}
                disabled={!editingTabName.trim() || isClosing}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  editingTabName.trim() && !isClosing
                    ? "bg-blue-500 text-gray-200 hover:bg-blue-600" // Đổi text-white thành text-gray-200
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
                className="px-4 py-2 rounded text-sm font-medium transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100" // Đổi text-gray-700 thành text-gray-700 (giữ nguyên)
              >
                {t("PriceBoard.No, cancel")}
              </button>
              <button
                onClick={confirmDeleteTab}
                disabled={isClosing}
                className="px-4 py-2 rounded text-sm font-medium transition-colors bg-red-500 text-gray-200 hover:bg-red-600" // Đổi text-white thành text-gray-200
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
