import { useEffect, useRef, useState } from "react";

import {
  Folder,
  FolderOpen,
  FileCode2,
  FilePlus2,
  FolderPlus,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Copy,
  ExternalLink,
  Search,
  MoreHorizontal,
} from "lucide-react";

import ActivityBar from "./ActivityBar";
import ExtensionsPanel from "./ExtensionsPanel";
import SourceControlPanel from "./SourceControlPanel";
import RunDebugPanel from "./RunDebugPanel";
import Cheatsheet from "./Cheatsheet";

function getFileMeta(file) {
  const name = file?.name?.toLowerCase() || "";
  const language = file?.language?.toLowerCase() || "";

  if (name.endsWith(".java") || language === "java") {
    return { icon: "☕", color: "#f89820" };
  }

  if (name.endsWith(".py") || language === "python") {
    return { icon: "🐍", color: "#4ec9b0" };
  }

  if (name.endsWith(".cpp") || name.endsWith(".cc") || language === "cpp") {
    return { icon: "C+", color: "#519aba" };
  }

  if (name.endsWith(".c") || language === "c") {
    return { icon: "C", color: "#519aba" };
  }

  if (
    name.endsWith(".js") ||
    name.endsWith(".jsx") ||
    language === "javascript"
  ) {
    return { icon: "JS", color: "#f7df1e" };
  }

  if (
    name.endsWith(".ts") ||
    name.endsWith(".tsx") ||
    language === "typescript"
  ) {
    return { icon: "TS", color: "#3178c6" };
  }

  if (name.endsWith(".html") || language === "html") {
    return { icon: "<>", color: "#e44d26" };
  }

  if (name.endsWith(".css") || language === "css") {
    return { icon: "#", color: "#42a5f5" };
  }

  if (name.endsWith(".json") || language === "json") {
    return { icon: "{}", color: "#d4b83d" };
  }

  if (name.endsWith(".go") || language === "go") {
    return { icon: "GO", color: "#00add8" };
  }

  if (name.endsWith(".rs") || language === "rust") {
    return { icon: "RS", color: "#dea584" };
  }

  if (name.endsWith(".php") || language === "php") {
    return { icon: "PHP", color: "#8892bf" };
  }

  if (name.endsWith(".sql") || language === "sql") {
    return { icon: "SQL", color: "#d4b83d" };
  }

  return {
    icon: "•",
    color: "#9cdcfe",
  };
}

function Sidebar({
  files = [],
  folders = [],
  activeFile,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onRenameFile,
  onDeleteFolder,
  onRenameFolder,
  onRun,
  onStop,
  isRunning = false,
}) {
  const [activePanel, setActivePanel] = useState("explorer");

  const [sidebarWidth, setSidebarWidth] = useState(300);

  const resizingRef = useRef(false);

  const [newFileName, setNewFileName] = useState("");

  const [newFolderName, setNewFolderName] = useState("");

  const [showFileInput, setShowFileInput] = useState(false);

  const [showFolderInput, setShowFolderInput] = useState(false);

  const [editingFileId, setEditingFileId] = useState(null);

  const [editingFolderId, setEditingFolderId] = useState(null);

  const [editingName, setEditingName] = useState("");

  const [editingFolderName, setEditingFolderName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [expandedFolders, setExpandedFolders] = useState({});

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);

  const [contextFile, setContextFile] = useState(null);

  const [contextFolder, setContextFolder] = useState(null);

  /* =====================================================
     SEARCH SHORTCUT
     ===================================================== */

  useEffect(() => {
    const handleSearchShortcut = () => {
      setActivePanel("search");

      setTimeout(() => {
        document.querySelector(".rohit-sidebar-search-input")?.focus();
      }, 50);
    };

    window.addEventListener("rohit-code-search", handleSearchShortcut);

    return () => {
      window.removeEventListener("rohit-code-search", handleSearchShortcut);
    };
  }, []);

  /* =====================================================
     CLOSE CONTEXT MENU
     ===================================================== */

  useEffect(() => {
    const closeMenu = () => {
      setContextMenu(null);
      setContextFile(null);
      setContextFolder(null);
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  /* =====================================================
     RESIZE
     ===================================================== */

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!resizingRef.current) return;

      setSidebarWidth(Math.min(450, Math.max(250, event.clientX)));
    };

    const handleMouseUp = () => {
      if (!resizingRef.current) return;

      resizingRef.current = false;

      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      document.body.classList.remove("rohit-sidebar-resizing");
    };

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startSidebarResize = (event) => {
    event.preventDefault();
    event.stopPropagation();

    resizingRef.current = true;

    document.body.style.cursor = "col-resize";

    document.body.style.userSelect = "none";

    document.body.classList.add("rohit-sidebar-resizing");
  };

  /* =====================================================
     CREATE FILE
     ===================================================== */

  const handleCreateFile = () => {
    const name = newFileName.trim();

    if (!name) return;

    const exists = files.some(
      (file) =>
        file.name.toLowerCase() === name.toLowerCase() &&
        String(file.folderId) === String(selectedFolderId),
    );

    if (exists) {
      alert("A file with this name already exists.");
      return;
    }

    onCreateFile?.(name, selectedFolderId);

    setNewFileName("");
    setShowFileInput(false);
  };

  /* =====================================================
     CREATE FOLDER
     ===================================================== */

  const handleCreateFolder = () => {
    const name = newFolderName.trim();

    if (!name) return;

    const exists = folders.some(
      (folder) => folder.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      alert("A folder with this name already exists.");
      return;
    }

    onCreateFolder?.(name);

    setNewFolderName("");
    setShowFolderInput(false);
  };

  /* =====================================================
     RENAME
     ===================================================== */

  const startRename = (file) => {
    setEditingFileId(file.id);
    setEditingName(file.name);
    setContextMenu(null);
  };

  const saveRename = () => {
    const name = editingName.trim();

    if (!name) return;

    const currentFile = files.find(
      (file) => String(file.id) === String(editingFileId),
    );

    const exists = files.some(
      (file) =>
        String(file.id) !== String(editingFileId) &&
        String(file.folderId) === String(currentFile?.folderId) &&
        file.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      alert("A file with this name already exists.");
      return;
    }

    onRenameFile?.(editingFileId, name);

    setEditingFileId(null);
    setEditingName("");
  };

  /* =====================================================
     FOLDERS
     ===================================================== */

  const toggleFolder = (folderId) => {
    setSelectedFolderId(folderId);

    setExpandedFolders((previous) => ({
      ...previous,
      [folderId]: !previous[folderId],
    }));
  };

  /* =====================================================
     CONTEXT MENU
     ===================================================== */

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    event.stopPropagation();

    setContextFile(file);

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
    setContextFile(null);
  };

  const handleContextOpen = () => {
    if (!contextFile) return;

    onFileSelect?.(contextFile.id);

    closeContextMenu();
  };

  const handleContextRename = () => {
    if (!contextFile) return;

    startRename(contextFile);
  };

  const handleContextDelete = () => {
    if (!contextFile) return;

    onDeleteFile?.(contextFile.id);

    closeContextMenu();
  };

  const handleCopyPath = async () => {
    if (!contextFile) return;

    try {
      await navigator.clipboard.writeText(contextFile.name);
    } catch {
      // Ignore clipboard errors.
    }

    closeContextMenu();
  };

  /* =====================================================
     FOLDER RENAME
     ===================================================== */

  const startFolderRename = (folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setContextMenu(null);
    setContextFolder(null);
  };

  const saveFolderRename = () => {
    const name = editingFolderName.trim();

    if (!name) return;

    const exists = folders.some(
      (folder) =>
        String(folder.id) !== String(editingFolderId) &&
        folder.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      alert("A folder with this name already exists.");
      return;
    }

    onRenameFolder?.(editingFolderId, name);

    setEditingFolderId(null);
    setEditingFolderName("");
  };

  /* =====================================================
     FOLDER CONTEXT MENU
     ===================================================== */

  const handleFolderContextMenu = (event, folder) => {
    event.preventDefault();
    event.stopPropagation();

    setContextFile(null);
    setContextFolder(folder);

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleFolderContextRename = () => {
    if (!contextFolder) return;

    startFolderRename(contextFolder);
  };

  const handleFolderContextDelete = () => {
    if (!contextFolder) return;

    const folder = contextFolder;

    const confirmed = window.confirm(
      `Delete folder "${folder.name}" and all files inside it?`,
    );

    if (confirmed) {
      onDeleteFolder?.(folder.id);
    }

    closeContextMenu();
  };

  /* =====================================================
     FILTER
     ===================================================== */

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const rootFiles = filteredFiles.filter((file) => file.folderId == null);

  /* =====================================================
     FILE ITEM
     ===================================================== */

  const renderFile = (file) => {
    const active = String(activeFile) === String(file.id);

    const meta = getFileMeta(file);

    const dirty = file.content !== file.savedContent;

    return (
      <div
        key={file.id}
        className={`rohit-sidebar-file ${
          active ? "rohit-sidebar-file-active" : ""
        }`}
        onClick={() => onFileSelect?.(file.id)}
        onContextMenu={(event) => handleContextMenu(event, file)}
        title={file.name}
      >
        <span
          className="rohit-sidebar-file-icon"
          style={{
            color: meta.color,
          }}
        >
          {meta.icon}
        </span>

        {editingFileId === file.id ? (
          <input
            autoFocus
            className="rohit-sidebar-rename"
            value={editingName}
            onChange={(event) => setEditingName(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                saveRename();
              }

              if (event.key === "Escape") {
                setEditingFileId(null);

                setEditingName("");
              }
            }}
          />
        ) : (
          <span className="rohit-sidebar-file-name">{file.name}</span>
        )}

        {editingFileId === file.id ? (
          <>
            <button
              type="button"
              className="rohit-sidebar-file-action"
              title="Save rename"
              onClick={(event) => {
                event.stopPropagation();
                saveRename();
              }}
            >
              <Check size={13} />
            </button>

            <button
              type="button"
              className="rohit-sidebar-file-action"
              title="Cancel"
              onClick={(event) => {
                event.stopPropagation();

                setEditingFileId(null);

                setEditingName("");
              }}
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <>
            {dirty && (
              <span className="rohit-sidebar-dirty" title="Unsaved changes">
                ●
              </span>
            )}

            <button
              type="button"
              className="rohit-sidebar-file-action"
              title="Rename"
              onClick={(event) => {
                event.stopPropagation();

                startRename(file);
              }}
            >
              <Pencil size={12} />
            </button>

            <button
              type="button"
              className="rohit-sidebar-file-action danger"
              title="Delete"
              onClick={(event) => {
                event.stopPropagation();

                onDeleteFile?.(file.id);
              }}
            >
              <Trash2 size={12} />
            </button>
          </>
        )}
      </div>
    );
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <>
      <style>{`
        /* =====================================================
           ROHIT CODE SIDEBAR
           VS Code UI font stack + VS Code row/box sizing.
           ===================================================== */

        .rohit-sidebar {
          position: relative;

          width: ${sidebarWidth}px;
          min-width: ${sidebarWidth}px;

          height: 100%;

          display: flex;
          flex-direction: row;

          overflow: hidden;

          background: #181818;
          color: #cccccc;

          border-right: 1px solid #2b2b2b;

          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            "Ubuntu",
            "Helvetica Neue",
            Arial,
            sans-serif;
        }

        /* =====================================================
           MAIN PANEL
           ===================================================== */

        .rohit-sidebar-content {
          flex: 1;
          min-width: 0;
          min-height: 0;

          display: flex;
          flex-direction: column;

          background: #181818;

          overflow: hidden;
        }

        /* =====================================================
           HEADER
           ===================================================== */

        .rohit-sidebar-header {
          height: 42px;
          min-height: 42px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 10px 0 16px;
        }

        .rohit-sidebar-title {
          color: #bbbbbb;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: .5px;
        }

        .rohit-sidebar-actions {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .rohit-sidebar-icon-button {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 5px;

          background: transparent;

          color: #858585;

          cursor: pointer;
        }

        .rohit-sidebar-icon-button:hover {
          background: #2a2d2e;
          color: #ffffff;
        }

        /* =====================================================
           SEARCH
           ===================================================== */

        .rohit-sidebar-search {
          height: 28px;

          display: flex;
          align-items: center;

          gap: 6px;

          margin: 8px 10px;

          padding: 0 10px;

          background: #252526;

          border: 1px solid #3b3b3b;

          border-radius: 3px;

          color: #858585;
        }

        .rohit-sidebar-search:focus-within {
          border-color: #007acc;

          box-shadow:
            0 0 0 1px rgba(0,122,204,.15);
        }

        .rohit-sidebar-search-input {
          flex: 1;
          min-width: 0;

          border: 0;
          outline: 0;

          background: transparent;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;
          line-height: 1.4;
        }

        .rohit-sidebar-search-input::placeholder {
          color: #777777;
        }

        /* =====================================================
           NEW ITEM
           ===================================================== */

        .rohit-sidebar-new-item {
          height: 28px;

          display: flex;
          align-items: center;

          gap: 6px;

          margin: 0 8px 6px;

          padding: 0 7px;

          background: #252526;

          border: 1px solid #007acc;

          border-radius: 3px;

          color: #cccccc;
        }

        .rohit-sidebar-new-item input {
          flex: 1;
          min-width: 0;

          border: 0;
          outline: 0;

          background: transparent;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;
        }

        .rohit-sidebar-new-item button {
          width: 22px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 3px;

          background: transparent;

          color: #858585;

          cursor: pointer;
        }

        .rohit-sidebar-new-item button:hover {
          background: #333333;
          color: #ffffff;
        }

        /* =====================================================
           PROJECT
           ===================================================== */

        .rohit-sidebar-project {
          height: 30px;

          display: flex;
          align-items: center;

          gap: 4px;

          padding: 0 10px;

          color: #cccccc;

          font-size: 13px;

          font-weight: 400;

          cursor: pointer;
        }

        .rohit-sidebar-project:hover {
          background: #252526;
        }

        .rohit-sidebar-project-name {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        /* =====================================================
           TREE
           ===================================================== */

        .rohit-sidebar-tree {
          flex: 1;
          min-height: 0;

          overflow-y: auto;

          padding: 6px 0 24px;
        }

        .rohit-sidebar-tree::-webkit-scrollbar {
          width: 8px;
        }

        .rohit-sidebar-tree::-webkit-scrollbar-track {
          background: transparent;
        }

        .rohit-sidebar-tree::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 8px;
        }

        .rohit-sidebar-tree::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }

        /* =====================================================
           FOLDER
           ===================================================== */

        .rohit-sidebar-folder {
          width: 100%;

          height: 30px;
          min-height: 30px;

          display: flex;
          align-items: center;

          gap: 4px;

          padding: 0 10px;

          color: #cccccc;

          font-size: 14px;

          cursor: pointer;
        }

        .rohit-sidebar-folder:hover {
          background: #2a2d2e;
        }

        .rohit-sidebar-folder-selected {
          background: #37373d;
        }

        .rohit-sidebar-folder-name {
          flex: 1;
          min-width: 0;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .rohit-sidebar-folder .rohit-sidebar-file-action {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .rohit-sidebar-folder:hover
        .rohit-sidebar-file-action,
        .rohit-sidebar-folder-selected
        .rohit-sidebar-file-action {
          opacity: 1;
        }

        .rohit-sidebar-folder-rename {
          flex: 1;
          min-width: 0;
        }

        .rohit-sidebar-folder-files {
          padding-left: 14px;
        }

        /* =====================================================
           FILE
           ===================================================== */

        .rohit-sidebar-file {
          position: relative;

          height: 30px;
          min-height: 30px;

          display: flex;
          align-items: center;

          gap: 8px;

          padding: 0 10px 0 14px;

          border-left: 2px solid transparent;

          color: #cccccc;

          font-size: 14px;

          cursor: pointer;

          transition:
            background .1s ease,
            color .1s ease;
        }

        .rohit-sidebar-folder-files
        .rohit-sidebar-file {
          padding-left: 8px;
        }

        .rohit-sidebar-file:hover {
          background: #2a2d2e;
        }

        .rohit-sidebar-file-active {
          background: #37373d;

          border-left-color: #007acc;

          color: #ffffff;
        }

        .rohit-sidebar-file-icon {
          width: 20px;
          min-width: 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-family:
            Consolas,
            "SF Mono",
            monospace;

          font-size: 11px;

          font-weight: 700;
        }

        .rohit-sidebar-file-name {
          flex: 1;
          min-width: 0;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .rohit-sidebar-dirty {
          color: #ffffff;

          font-size: 9px;
        }

        .rohit-sidebar-file-action {
          width: 24px;
          height: 24px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border: 0;
          border-radius: 3px;

          background: transparent;

          color: #858585;

          cursor: pointer;

          opacity: 0;
        }

        .rohit-sidebar-file:hover
        .rohit-sidebar-file-action,

        .rohit-sidebar-file-active
        .rohit-sidebar-file-action {
          opacity: 1;
        }

        .rohit-sidebar-file-action:hover {
          background: #3a3a3a;
          color: #ffffff;
        }

        .rohit-sidebar-file-action.danger:hover {
          color: #f48771;
        }

        /* =====================================================
           RENAME
           ===================================================== */

        .rohit-sidebar-rename {
          flex: 1;
          min-width: 0;

          height: 20px;

          padding: 0 5px;

          border: 1px solid #007acc;
          border-radius: 2px;

          outline: none;

          background: #1f1f1f;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;
        }

        /* =====================================================
           EMPTY
           ===================================================== */

        .rohit-sidebar-empty {
          padding: 30px 15px;

          text-align: center;

          color: #666666;

          font-size: 13px;

          line-height: 1.6;
        }

        /* =====================================================
           RESIZE HANDLE
           ===================================================== */

        .rohit-sidebar-resize {
          position: absolute;

          top: 0;
          right: -3px;
          bottom: 0;

          width: 6px;

          z-index: 100;

          cursor: col-resize;
        }

        .rohit-sidebar-resize::after {
          content: "";

          position: absolute;

          top: 0;
          bottom: 0;
          left: 2px;

          width: 1px;

          background: transparent;

          transition:
            background .12s ease;
        }

        .rohit-sidebar-resize:hover::after,
        body.rohit-sidebar-resizing
        .rohit-sidebar-resize::after {
          background: #007acc;
        }

        /* =====================================================
           CONTEXT MENU
           ===================================================== */

        .rohit-sidebar-context {
          min-width: 190px;

          padding: 4px 0;

          background: #252526;

          border: 1px solid #454545;

          border-radius: 5px;

          box-shadow:
            0 10px 30px rgba(0,0,0,.55);

          overflow: hidden;
        }

        .rohit-sidebar-context button {
          width: 100%;
          height: 26px;

          display: flex;
          align-items: center;

          gap: 8px;

          padding: 0 12px;

          border: 0;

          background: transparent;

          color: #cccccc;

          font-family: inherit;

          font-size: 13px;

          text-align: left;

          cursor: pointer;
        }

        .rohit-sidebar-context button:hover {
          background: #094771;
          color: #ffffff;
        }

        .rohit-sidebar-context .danger:hover {
          background: #5a1d1d;
        }

        .rohit-sidebar-context-divider {
          height: 1px;

          margin: 4px 0;

          background: #3b3b3b;
        }

        /* =====================================================
           PLACEHOLDER PANELS
           ===================================================== */

        .rohit-sidebar-panel {
          flex: 1;
          min-width: 0;
          min-height: 0;

          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 800px) {
          .rohit-sidebar {
            width: 280px !important;
            min-width: 280px !important;
          }

          .rohit-sidebar-file,
          .rohit-sidebar-folder {
            height: 30px;
            font-size: 14px;
          }
        }
      `}</style>

      <aside
        className="rohit-sidebar"
        style={{
          width: `${sidebarWidth}px`,
          minWidth: `${sidebarWidth}px`,
        }}
      >
        <ActivityBar
          activePanel={activePanel}
          onPanelChange={(panel) => {
            setActivePanel(panel);

            if (panel === "search") {
              setTimeout(() => {
                document.querySelector(".rohit-sidebar-search-input")?.focus();
              }, 50);
            }
          }}
        />

        <div className="rohit-sidebar-content">
          {/* =================================================
              EXPLORER
             ================================================= */}

          {activePanel === "explorer" && (
            <>
              <div className="rohit-sidebar-header">
                <span className="rohit-sidebar-title">EXPLORER</span>

                <div className="rohit-sidebar-actions">
                  <button
                    type="button"
                    className="rohit-sidebar-icon-button"
                    title="New File"
                    onClick={() => {
                      setShowFileInput(true);

                      setShowFolderInput(false);
                    }}
                  >
                    <FilePlus2 size={18} />
                  </button>

                  <button
                    type="button"
                    className="rohit-sidebar-icon-button"
                    title="New Folder"
                    onClick={() => {
                      setShowFolderInput(true);

                      setShowFileInput(false);
                    }}
                  >
                    <FolderPlus size={18} />
                  </button>

                  <button
                    type="button"
                    className="rohit-sidebar-icon-button"
                    title="More Actions"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* SEARCH */}

              <div className="rohit-sidebar-search">
                <Search size={14} />

                <input
                  className="rohit-sidebar-search-input"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="rohit-sidebar-icon-button"
                    style={{
                      width: 20,
                      height: 20,
                    }}
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* NEW FILE */}

              {showFileInput && (
                <div className="rohit-sidebar-new-item">
                  <FileCode2 size={14} />

                  <input
                    autoFocus
                    placeholder="File name..."
                    value={newFileName}
                    onChange={(event) => setNewFileName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleCreateFile();
                      }

                      if (event.key === "Escape") {
                        setShowFileInput(false);

                        setNewFileName("");
                      }
                    }}
                  />

                  <button type="button" onClick={handleCreateFile}>
                    <Check size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowFileInput(false);

                      setNewFileName("");
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* NEW FOLDER */}

              {showFolderInput && (
                <div className="rohit-sidebar-new-item">
                  <Folder size={14} />

                  <input
                    autoFocus
                    placeholder="Folder name..."
                    value={newFolderName}
                    onChange={(event) => setNewFolderName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleCreateFolder();
                      }

                      if (event.key === "Escape") {
                        setShowFolderInput(false);

                        setNewFolderName("");
                      }
                    }}
                  />

                  <button type="button" onClick={handleCreateFolder}>
                    <Check size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowFolderInput(false);

                      setNewFolderName("");
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* TREE */}

              <div className="rohit-sidebar-tree">
                <div
                  className="rohit-sidebar-project"
                  onClick={() => setSelectedFolderId(null)}
                >
                  <ChevronDown size={14} />

                  <FolderOpen size={15} color="#dcb67a" />

                  <span className="rohit-sidebar-project-name">CodeForge</span>
                </div>

                {/* FOLDERS */}

                {folders.map((folder) => {
                  const isExpanded =
                    expandedFolders[folder.id] ?? folder.expanded ?? true;

                  const folderFiles = filteredFiles.filter(
                    (file) => String(file.folderId) === String(folder.id),
                  );

                  const selected = selectedFolderId === folder.id;

                  return (
                    <div key={folder.id}>
                      <div
                        className={`
                          rohit-sidebar-folder
                          ${selected ? "rohit-sidebar-folder-selected" : ""}
                        `}
                        onClick={() => toggleFolder(folder.id)}
                        onContextMenu={(event) =>
                          handleFolderContextMenu(event, folder)
                        }
                      >
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}

                        {isExpanded ? (
                          <FolderOpen size={17} color="#dcb67a" />
                        ) : (
                          <Folder size={17} color="#dcb67a" />
                        )}

                        {editingFolderId === folder.id ? (
                          <>
                            <input
                              autoFocus
                              className="rohit-sidebar-rename rohit-sidebar-folder-rename"
                              value={editingFolderName}
                              onChange={(event) =>
                                setEditingFolderName(event.target.value)
                              }
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  saveFolderRename();
                                }

                                if (event.key === "Escape") {
                                  setEditingFolderId(null);
                                  setEditingFolderName("");
                                }
                              }}
                            />

                            <button
                              type="button"
                              className="rohit-sidebar-file-action"
                              title="Save rename"
                              onClick={(event) => {
                                event.stopPropagation();
                                saveFolderRename();
                              }}
                            >
                              <Check size={13} />
                            </button>

                            <button
                              type="button"
                              className="rohit-sidebar-file-action"
                              title="Cancel"
                              onClick={(event) => {
                                event.stopPropagation();
                                setEditingFolderId(null);
                                setEditingFolderName("");
                              }}
                            >
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="rohit-sidebar-folder-name">
                              {folder.name}
                            </span>

                            <button
                              type="button"
                              className="rohit-sidebar-file-action"
                              title="Rename folder"
                              onClick={(event) => {
                                event.stopPropagation();
                                startFolderRename(folder);
                              }}
                            >
                              <Pencil size={12} />
                            </button>

                            <button
                              type="button"
                              className="rohit-sidebar-file-action danger"
                              title="Delete folder"
                              onClick={(event) => {
                                event.stopPropagation();

                                const confirmed = window.confirm(
                                  `Delete folder "${folder.name}" and all files inside it?`,
                                );

                                if (confirmed) {
                                  onDeleteFolder?.(folder.id);
                                }
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="rohit-sidebar-folder-files">
                          {folderFiles.map(renderFile)}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* ROOT FILES */}

                {rootFiles.map(renderFile)}

                {files.length === 0 && (
                  <div className="rohit-sidebar-empty">
                    No files yet.
                    <br />
                    Create a file to start coding.
                  </div>
                )}

                {files.length > 0 && filteredFiles.length === 0 && (
                  <div className="rohit-sidebar-empty">No matching files.</div>
                )}
              </div>
            </>
          )}

          {/* =================================================
              SEARCH
             ================================================= */}

          {activePanel === "search" && (
            <div className="rohit-sidebar-panel">
              <div className="rohit-sidebar-header">
                <span className="rohit-sidebar-title">SEARCH</span>
              </div>

              <div className="rohit-sidebar-search">
                <Search size={14} />

                <input
                  autoFocus
                  className="rohit-sidebar-search-input"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              <div className="rohit-sidebar-tree">
                {filteredFiles.map(renderFile)}

                {filteredFiles.length === 0 && (
                  <div className="rohit-sidebar-empty">No files found.</div>
                )}
              </div>
            </div>
          )}

          {/* =================================================
              SOURCE CONTROL
             ================================================= */}

          {activePanel === "source-control" && (
            <div className="rohit-sidebar-panel">
              <SourceControlPanel
                files={files}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
              />
            </div>
          )}

          {/* =================================================
              RUN DEBUG
             ================================================= */}

          {activePanel === "run" && (
            <div className="rohit-sidebar-panel">
              <RunDebugPanel
                file={files.find(
                  (file) => String(file.id) === String(activeFile),
                )}
                onRun={onRun}
                onStop={onStop}
                isRunning={isRunning}
              />
            </div>
          )}

          {/* =================================================
              CHEATSHEET
             ================================================= */}

          {activePanel === "cheatsheet" && (
            <div className="rohit-sidebar-panel">
              <Cheatsheet
                onClose={() => {
                  setActivePanel("explorer");
                }}
              />
            </div>
          )}

          {/* =================================================
              EXTENSIONS
             ================================================= */}

          {activePanel === "extensions" && (
            <div className="rohit-sidebar-panel">
              <ExtensionsPanel />
            </div>
          )}
        </div>

        {/* ===================================================
            CONTEXT MENU
           =================================================== */}

        {contextMenu && (contextFile || contextFolder) && (
          <div
            className="rohit-sidebar-context"
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 20000,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {contextFile ? (
              <>
                <button type="button" onClick={handleContextOpen}>
                  <ExternalLink size={13} />
                  Open
                </button>

                <button type="button" onClick={handleContextRename}>
                  <Pencil size={13} />
                  Rename
                </button>

                <button type="button" onClick={handleCopyPath}>
                  <Copy size={13} />
                  Copy Path
                </button>

                <div className="rohit-sidebar-context-divider" />

                <button
                  type="button"
                  className="danger"
                  onClick={handleContextDelete}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleFolderContextRename}>
                  <Pencil size={13} />
                  Rename
                </button>

                <div className="rohit-sidebar-context-divider" />

                <button
                  type="button"
                  className="danger"
                  onClick={handleFolderContextDelete}
                >
                  <Trash2 size={13} />
                  Delete Folder
                </button>
              </>
            )}
          </div>
        )}

        {/* ===================================================
            RESIZE
           =================================================== */}

        <div
          className="rohit-sidebar-resize"
          onMouseDown={startSidebarResize}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize Explorer"
          title="Drag to resize"
        />
      </aside>
    </>
  );
}

export default Sidebar;
