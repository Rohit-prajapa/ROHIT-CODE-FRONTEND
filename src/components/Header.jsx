import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Play,
  Save,
  Settings,
  ChevronDown,
  FilePlus,
  FolderOpen,
  SaveAll,
  X,
  XCircle,
  TerminalSquare,
  AlertTriangle,
  Search,
  Command,
  Sparkles,
} from "lucide-react";

function Header({
  onRun,
  onSave,
  language = "cpp",
  onLanguageChange,
  onSettings,
  onAI,
  onToggleTerminal,

  // FILE
  onNewFile,
  onOpenFile,
  onSaveFile,
  onSaveAs,
  onCloseFile,
  onCloseAllFiles,

  // EDIT
  onEditAction,

  // SELECTION
  onSelectionAction,

  // VIEW
  onOpenProblems,
  onOpenSearch,
  onOpenCommandPalette,

  // HELP
  onHelp,
}) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [selectionMenuOpen, setSelectionMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const fileMenuRef = useRef(null);
  const editMenuRef = useRef(null);
  const selectionMenuRef = useRef(null);
  const viewMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // =========================================
  // LANGUAGES
  // =========================================

  const languages = [
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "sql", label: "SQL" },
  ];

  const currentLanguage =
    languages.find((item) => item.value === language)?.label ||
    language;

  // =========================================
  // CLOSE MENUS ON OUTSIDE CLICK
  // =========================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        fileMenuRef.current &&
        !fileMenuRef.current.contains(event.target)
      ) {
        setFileMenuOpen(false);
      }

      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target)
      ) {
        setEditMenuOpen(false);
      }

      if (
        selectionMenuRef.current &&
        !selectionMenuRef.current.contains(event.target)
      ) {
        setSelectionMenuOpen(false);
      }

      if (
        viewMenuRef.current &&
        !viewMenuRef.current.contains(event.target)
      ) {
        setViewMenuOpen(false);
      }

      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // =========================================
  // CLOSE ALL MENUS
  // =========================================

  const closeMenus = () => {
    setFileMenuOpen(false);
    setEditMenuOpen(false);
    setSelectionMenuOpen(false);
    setViewMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  // =========================================
  // FILE ACTION
  // =========================================

  const handleFileAction = (action) => {
    closeMenus();

    if (typeof action === "function") {
      action();
    }
  };

  // =========================================
  // EDIT ACTION
  // =========================================

  const handleEditAction = (action) => {
    closeMenus();

    if (onEditAction) {
      onEditAction(action);
    }
  };

  // =========================================
  // SELECTION ACTION
  // =========================================

  const handleSelectionAction = (action) => {
    closeMenus();

    if (onSelectionAction) {
      onSelectionAction(action);
    }
  };

  // =========================================
  // LANGUAGE
  // =========================================

  const handleLanguageSelect = (value) => {
    closeMenus();

    if (onLanguageChange) {
      onLanguageChange(value);
    }
  };

  // =========================================
  // TERMINAL
  // =========================================

  const handleTerminalClick = () => {
    closeMenus();

    if (onToggleTerminal) {
      onToggleTerminal();
    }
  };

  // =========================================
  // HELP
  // =========================================

  const handleHelpClick = () => {
    closeMenus();

    if (onHelp) {
      onHelp();
      return;
    }

    alert(
      "CodeForge\n\n" +
        "Browser-based code editor\n\n" +
        "Shortcuts:\n" +
        "Ctrl + Enter  → Run Code\n" +
        "Ctrl + S      → Save\n" +
        "Ctrl + P      → Quick Open\n" +
        "Ctrl + Shift + P → Command Palette\n" +
        "Ctrl + ,      → Settings\n" +
        "Ctrl + `      → Terminal\n" +
        "Ctrl + Shift + A → Gemini AI"
    );
  };

  return (
    <>
      <style>{`
        .header {
          height: 50px;
          min-height: 50px;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 14px;
          background: #181818;
          border-bottom: 1px solid #2b2b2b;
          color: #cccccc;
          font-family: "Segoe UI", Inter, system-ui, sans-serif;
          user-select: none;
          position: relative;
          z-index: 100;
        }

        .logo {
          height: 38px;
          min-width: 155px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 8px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: .4px;
          white-space: nowrap;
        }

        .logo svg {
          color: #4fc1ff;
        }

        .menu {
          height: 100%;
          display: flex;
          align-items: center;
          gap: 1px;
          min-width: 0;
        }

        .menu-dropdown-wrapper,
        .language-selector-wrapper {
          position: relative;
        }

        .menu-button {
          height: 34px;
          padding: 0 11px;
          border: 0;
          border-radius: 3px;
          background: transparent;
          color: #bdbdbd;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .menu-button:hover,
        .menu-button.active {
          background: #2a2d2e;
          color: #ffffff;
        }

        .file-menu-dropdown,
        .language-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 250px;
          padding: 6px 0;
          background: #252526;
          border: 1px solid #454545;
          border-radius: 3px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, .45);
          z-index: 1000;
        }

        .file-menu-item {
          width: 100%;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 10px 0 12px;
          border: 0;
          background: transparent;
          color: #cccccc;
          font: inherit;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
        }

        .file-menu-item:hover {
          background: #094771;
          color: #ffffff;
        }

        .file-menu-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .shortcut {
          color: #858585;
          font-size: 12px;
          white-space: nowrap;
        }

        .file-menu-item:hover .shortcut {
          color: #d7e9f7;
        }

        .file-menu-divider {
          height: 1px;
          margin: 5px 8px;
          background: #3b3b3b;
        }

        .header-right {
          margin-left: auto;
          height: 100%;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* =========================================
           LANGUAGE SELECTOR
        ========================================= */

        .language-selector {
          height: 34px;
          min-width: 105px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 7px;
          padding: 0 8px;
          border: 1px solid #3b3b3b;
          border-radius: 3px;
          background: #252526;
          color: #cccccc;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .language-selector:hover {
          border-color: #5a5a5a;
          color: #ffffff;
        }

        .language-dropdown {
          left: auto;
          right: 0;
          min-width: 170px;
          max-height: 360px;
          overflow-y: auto;
        }

        .language-option {
          width: 100%;
          height: 34px;
          padding: 0 13px;
          border: 0;
          background: transparent;
          color: #cccccc;
          font: inherit;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
        }

        .language-option:hover,
        .language-option.selected {
          background: #094771;
          color: #ffffff;
        }

        /* =========================================
           GEMINI AI BUTTON
           ONLY ONE AI BUTTON
        ========================================= */

        .header-ai-button {
          height: 34px;
          min-width: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          flex: 0 0 auto;
          padding: 0 10px;
          border: 1px solid #4f3b76;
          border-radius: 4px;
          background: #2b2140;
          color: #d8b9ff;
          font: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background .12s ease,
            border-color .12s ease,
            color .12s ease,
            transform .08s ease;
        }

        .header-ai-button:hover {
          background: #3a2b55;
          border-color: #7c58b3;
          color: #ffffff;
        }

        .header-ai-button:active {
          transform: translateY(1px);
        }

        .header-ai-button:focus-visible {
          outline: 1px solid #c9a6ff;
          outline-offset: 1px;
        }

        /* =========================================
           RUN / SAVE / SETTINGS
        ========================================= */

        .header-run-button,
        .header-save-button,
        .header-icon-button {
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 3px;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .header-run-button {
          min-width: 76px;
          padding: 0 12px;
          border: 1px solid #16825d;
          background: #16825d;
          color: #ffffff;
        }

        .header-run-button:hover {
          background: #1b9b6f;
          border-color: #1b9b6f;
        }

        .header-save-button {
          min-width: 72px;
          padding: 0 12px;
          border: 1px solid #3b3b3b;
          background: #252526;
          color: #cccccc;
        }

        .header-save-button:hover {
          background: #2a2d2e;
          color: #ffffff;
          border-color: #555555;
        }

        .header-icon-button {
          width: 36px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #999999;
        }

        .header-icon-button:hover {
          background: #2a2d2e;
          color: #ffffff;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 900px) {
          .logo {
            min-width: 110px;
          }

          .menu-button {
            padding: 0 6px;
          }

          .header-save-button span,
          .header-run-button span,
          .header-ai-button span {
            display: none;
          }

          .header-ai-button {
            min-width: 32px;
            width: 32px;
            padding: 0;
          }

          .header-run-button,
          .header-save-button {
            min-width: 32px;
            width: 32px;
            padding: 0;
          }
        }

        @media (max-width: 700px) {
          .logo span {
            display: none;
          }

          .logo {
            min-width: 38px;
            width: 38px;
          }

          .language-selector {
            min-width: 72px;
          }
        }
      `}</style>

      <header className="header">

        {/* =====================================
            LOGO
        ====================================== */}

        <div className="logo">
          <Code2 size={22} />
          <span>CodeForge</span>
        </div>

        {/* =====================================
            MAIN MENU
        ====================================== */}

        <div className="menu">

          {/* ===================================
              FILE
          ==================================== */}

          <div
            className="menu-dropdown-wrapper"
            ref={fileMenuRef}
          >
            <button
              type="button"
              className={`menu-button ${
                fileMenuOpen ? "active" : ""
              }`}
              onClick={() => {
                setFileMenuOpen((previous) => !previous);
                setEditMenuOpen(false);
                setSelectionMenuOpen(false);
                setViewMenuOpen(false);
                setLanguageMenuOpen(false);
              }}
            >
              File
            </button>

            {fileMenuOpen && (
              <div className="file-menu-dropdown">

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleFileAction(onNewFile)}
                >
                  <div className="file-menu-left">
                    <FilePlus size={16} />
                    <span>New File</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+N
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleFileAction(onOpenFile)}
                >
                  <div className="file-menu-left">
                    <FolderOpen size={16} />
                    <span>Open File</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+O
                  </span>
                </button>

                <div className="file-menu-divider" />

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleFileAction(onSaveFile || onSave)
                  }
                >
                  <div className="file-menu-left">
                    <Save size={17} />
                    <span>Save</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+S
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleFileAction(onSaveAs)}
                >
                  <div className="file-menu-left">
                    <SaveAll size={16} />
                    <span>Save As...</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+Shift+S
                  </span>
                </button>

                <div className="file-menu-divider" />

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleFileAction(onCloseFile)}
                >
                  <div className="file-menu-left">
                    <X size={16} />
                    <span>Close File</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+W
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleFileAction(onCloseAllFiles)
                  }
                >
                  <div className="file-menu-left">
                    <XCircle size={16} />
                    <span>Close All Files</span>
                  </div>
                </button>

              </div>
            )}
          </div>

          {/* ===================================
              EDIT
          ==================================== */}

          <div
            className="menu-dropdown-wrapper"
            ref={editMenuRef}
          >
            <button
              type="button"
              className={`menu-button ${
                editMenuOpen ? "active" : ""
              }`}
              onClick={() => {
                setEditMenuOpen((previous) => !previous);
                setFileMenuOpen(false);
                setSelectionMenuOpen(false);
                setViewMenuOpen(false);
                setLanguageMenuOpen(false);
              }}
            >
              Edit
            </button>

            {editMenuOpen && (
              <div className="file-menu-dropdown">

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleEditAction("undo")}
                >
                  <span>Undo</span>
                  <span className="shortcut">
                    Ctrl+Z
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleEditAction("redo")}
                >
                  <span>Redo</span>
                  <span className="shortcut">
                    Ctrl+Y
                  </span>
                </button>

                <div className="file-menu-divider" />

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleEditAction("cut")}
                >
                  <span>Cut</span>
                  <span className="shortcut">
                    Ctrl+X
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleEditAction("copy")}
                >
                  <span>Copy</span>
                  <span className="shortcut">
                    Ctrl+C
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleEditAction("paste")}
                >
                  <span>Paste</span>
                  <span className="shortcut">
                    Ctrl+V
                  </span>
                </button>

                <div className="file-menu-divider" />

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleEditAction("selectAll")}
                >
                  <span>Select All</span>
                  <span className="shortcut">
                    Ctrl+A
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() => handleEditAction("delete")}
                >
                  <span>Delete</span>
                  <span className="shortcut">
                    Delete
                  </span>
                </button>

              </div>
            )}
          </div>

          {/* ===================================
              SELECTION
          ==================================== */}

          <div
            className="menu-dropdown-wrapper"
            ref={selectionMenuRef}
          >
            <button
              type="button"
              className={`menu-button ${
                selectionMenuOpen ? "active" : ""
              }`}
              onClick={() => {
                setSelectionMenuOpen((previous) => !previous);
                setFileMenuOpen(false);
                setEditMenuOpen(false);
                setViewMenuOpen(false);
                setLanguageMenuOpen(false);
              }}
            >
              Selection
            </button>

            {selectionMenuOpen && (
              <div className="file-menu-dropdown">

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("selectAll")
                  }
                >
                  <span>Select All</span>
                  <span className="shortcut">
                    Ctrl+A
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("expandSelection")
                  }
                >
                  <span>Expand Selection</span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("shrinkSelection")
                  }
                >
                  <span>Shrink Selection</span>
                </button>

                <div className="file-menu-divider" />

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("copyLineDown")
                  }
                >
                  <span>Copy Line Down</span>
                  <span className="shortcut">
                    Shift+Alt+Down
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("copyLineUp")
                  }
                >
                  <span>Copy Line Up</span>
                  <span className="shortcut">
                    Shift+Alt+Up
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("moveLineDown")
                  }
                >
                  <span>Move Line Down</span>
                  <span className="shortcut">
                    Alt+Down
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("moveLineUp")
                  }
                >
                  <span>Move Line Up</span>
                  <span className="shortcut">
                    Alt+Up
                  </span>
                </button>

                <div className="file-menu-divider" />

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleSelectionAction("duplicateSelection")
                  }
                >
                  <span>Duplicate Selection</span>
                </button>

              </div>
            )}
          </div>

          {/* ===================================
              VIEW
          ==================================== */}

          <div
            className="menu-dropdown-wrapper"
            ref={viewMenuRef}
          >
            <button
              type="button"
              className={`menu-button ${
                viewMenuOpen ? "active" : ""
              }`}
              onClick={() => {
                setViewMenuOpen((previous) => !previous);
                setFileMenuOpen(false);
                setEditMenuOpen(false);
                setSelectionMenuOpen(false);
                setLanguageMenuOpen(false);
              }}
            >
              View
            </button>

            {viewMenuOpen && (
              <div className="file-menu-dropdown">

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={handleTerminalClick}
                >
                  <div className="file-menu-left">
                    <TerminalSquare size={16} />
                    <span>Terminal</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+`
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleFileAction(onOpenProblems)
                  }
                >
                  <div className="file-menu-left">
                    <AlertTriangle size={16} />
                    <span>Problems</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+Shift+M
                  </span>
                </button>

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleFileAction(onOpenSearch)
                  }
                >
                  <div className="file-menu-left">
                    <Search size={16} />
                    <span>Search</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+Shift+F
                  </span>
                </button>

                <div className="file-menu-divider" />

                <button
                  type="button"
                  className="file-menu-item"
                  onClick={() =>
                    handleFileAction(onOpenCommandPalette)
                  }
                >
                  <div className="file-menu-left">
                    <Command size={16} />
                    <span>Command Palette</span>
                  </div>

                  <span className="shortcut">
                    Ctrl+Shift+P
                  </span>
                </button>

              </div>
            )}
          </div>

          {/* ===================================
              TERMINAL
          ==================================== */}

          <button
            type="button"
            className="menu-button"
            onClick={handleTerminalClick}
          >
            Terminal
          </button>

          {/* ===================================
              HELP
          ==================================== */}

          <button
            type="button"
            className="menu-button"
            onClick={handleHelpClick}
          >
            Help
          </button>

        </div>

        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        <div className="header-right">

          {/* ===================================
              LANGUAGE
          ==================================== */}

          <div
            className="language-selector-wrapper"
            ref={languageMenuRef}
          >
            <button
              type="button"
              className="language-selector"
              onClick={() => {
                setLanguageMenuOpen((previous) => !previous);
                setFileMenuOpen(false);
                setEditMenuOpen(false);
                setSelectionMenuOpen(false);
                setViewMenuOpen(false);
              }}
            >
              <span>{currentLanguage}</span>
              <ChevronDown size={14} />
            </button>

            {languageMenuOpen && (
              <div className="language-dropdown">
                {languages.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    className={`language-option ${
                      language === item.value ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleLanguageSelect(item.value)
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===================================
              GEMINI AI
              ONLY AI BUTTON IN HEADER
          ==================================== */}

          <button
            type="button"
            className="header-ai-button"
            onClick={() => {
              closeMenus();

              if (typeof onAI === "function") {
                onAI();
              }
            }}
            title="Gemini AI - Ctrl + Shift + A"
            aria-label="Open Gemini AI"
          >
            <Sparkles size={15} />
            <span>AI</span>
          </button>

          {/* ===================================
              GREEN RUN BUTTON
          ==================================== */}

          <button
            type="button"
            className="header-run-button"
            onClick={() => {
              closeMenus();

              if (typeof onRun === "function") {
                onRun();
              }
            }}
            title="Run Code (Ctrl+Enter)"
          >
            <Play size={17} />
            <span>Run</span>
          </button>

          {/* ===================================
              SAVE
          ==================================== */}

          <button
            type="button"
            className="header-save-button"
            onClick={() => {
              closeMenus();

              if (typeof onSave === "function") {
                onSave();
              }
            }}
            title="Save Project (Ctrl+S)"
          >
            <Save size={17} />
            <span>Save</span>
          </button>

          {/* ===================================
              SETTINGS
          ==================================== */}

          <button
            type="button"
            className="header-icon-button"
            onClick={() => {
              closeMenus();

              if (typeof onSettings === "function") {
                onSettings();
              }
            }}
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={19} />
          </button>

        </div>
      </header>
    </>
  );
}

export default Header;