import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  FileCode2,
  X,
} from "lucide-react";

function getFileIcon(fileName = "") {
  const name = fileName.toLowerCase();

  if (name.endsWith(".java")) return "☕";
  if (name.endsWith(".py")) return "🐍";
  if (name.endsWith(".cpp") || name.endsWith(".cc")) return "C++";
  if (name.endsWith(".c")) return "C";
  if (name.endsWith(".js") || name.endsWith(".jsx")) return "JS";
  if (name.endsWith(".ts") || name.endsWith(".tsx")) return "TS";
  if (name.endsWith(".html")) return "HTML";
  if (name.endsWith(".css")) return "CSS";
  if (name.endsWith(".json")) return "{}";
  if (name.endsWith(".go")) return "GO";
  if (name.endsWith(".rs")) return "RS";
  if (name.endsWith(".php")) return "PHP";

  return "FILE";
}

function QuickOpen({
  isOpen = false,
  files = [],
  activeFile,
  onSelectFile,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);

  /* =========================================
     FILTER FILES
  ========================================= */

  const filteredFiles = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return files;
    }

    return files.filter((file) => {
      const fileName =
        file?.name?.toLowerCase() || "";

      const language =
        file?.language?.toLowerCase() || "";

      return (
        fileName.includes(value) ||
        language.includes(value)
      );
    });
  }, [files, query]);

  /* =========================================
     OPEN
  ========================================= */

  useEffect(() => {
    if (!isOpen) return;

    setQuery("");
    setSelectedIndex(0);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [isOpen]);

  /* =========================================
     KEYBOARD NAVIGATION
  ========================================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      /* ESC */

      if (event.key === "Escape") {
        event.preventDefault();

        onClose?.();

        return;
      }

      /* DOWN */

      if (event.key === "ArrowDown") {
        event.preventDefault();

        if (!filteredFiles.length) {
          return;
        }

        setSelectedIndex((previous) =>
          previous + 1 >= filteredFiles.length
            ? 0
            : previous + 1,
        );

        return;
      }

      /* UP */

      if (event.key === "ArrowUp") {
        event.preventDefault();

        if (!filteredFiles.length) {
          return;
        }

        setSelectedIndex((previous) =>
          previous <= 0
            ? filteredFiles.length - 1
            : previous - 1,
        );

        return;
      }

      /* ENTER */

      if (event.key === "Enter") {
        event.preventDefault();

        const file =
          filteredFiles[selectedIndex];

        if (!file) {
          return;
        }

        onSelectFile?.(file.id);

        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    filteredFiles,
    selectedIndex,
    onClose,
    onSelectFile,
  ]);

  /* =========================================
     KEEP INDEX VALID
  ========================================= */

  useEffect(() => {
    if (
      selectedIndex >= filteredFiles.length
    ) {
      setSelectedIndex(0);
    }
  }, [
    filteredFiles.length,
    selectedIndex,
  ]);

  /* =========================================
     NOT OPEN
  ========================================= */

  if (!isOpen) {
    return null;
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div
      className="rohit-quick-open-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <style>{`
        .rohit-quick-open-overlay {
          position: fixed;
          inset: 0;
          z-index: 15000;

          display: flex;
          align-items: flex-start;
          justify-content: center;

          padding-top: 72px;

          background: rgba(0, 0, 0, .38);

          font-family:
            "Segoe UI",
            Inter,
            Arial,
            sans-serif;
        }

        .rohit-quick-open {
          width: 680px;
          max-width: calc(100vw - 30px);

          overflow: hidden;

          background: #252526;

          border: 1px solid #454545;
          border-radius: 6px;

          box-shadow:
            0 20px 55px rgba(0, 0, 0, .6),
            0 5px 18px rgba(0, 0, 0, .4);
        }

        .rohit-quick-open-search {
          height: 52px;

          display: flex;
          align-items: center;

          gap: 11px;

          padding: 0 14px;

          color: #858585;

          border-bottom: 1px solid #3b3b3b;
        }

        .rohit-quick-open-search input {
          flex: 1;
          min-width: 0;

          height: 100%;

          border: 0;
          outline: 0;

          background: transparent;

          color: #ffffff;

          font-size: 16px;
        }

        .rohit-quick-open-search input::placeholder {
          color: #858585;
        }

        .rohit-quick-open-close {
          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 4px;

          background: transparent;

          color: #858585;

          cursor: pointer;
        }

        .rohit-quick-open-close:hover {
          background: #3a3a3a;
          color: #ffffff;
        }

        .rohit-quick-open-list {
          max-height: 390px;

          padding: 6px;

          overflow-y: auto;
        }

        .rohit-quick-open-item {
          width: 100%;
          min-height: 46px;

          display: flex;
          align-items: center;

          gap: 11px;

          padding: 0 11px;

          border: 0;
          border-radius: 4px;

          background: transparent;

          color: #cccccc;

          text-align: left;

          cursor: pointer;
        }

        .rohit-quick-open-item:hover,
        .rohit-quick-open-item.selected {
          background: #094771;
          color: #ffffff;
        }

        .rohit-quick-open-file-icon {
          width: 30px;
          min-width: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #9cdcfe;

          font-family:
            "Cascadia Code",
            Consolas,
            monospace;

          font-size: 10px;
          font-weight: 700;
        }

        .rohit-quick-open-file-info {
          flex: 1;
          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 2px;
        }

        .rohit-quick-open-file-name {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #e6e6e6;

          font-size: 14px;
        }

        .rohit-quick-open-file-path {
          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #858585;

          font-size: 11px;
        }

        .rohit-quick-open-item.selected
        .rohit-quick-open-file-path {
          color: #c8c8c8;
        }

        .rohit-quick-open-active {
          padding: 3px 7px;

          border-radius: 3px;

          background: #303030;

          color: #858585;

          font-size: 10px;
        }

        .rohit-quick-open-item.selected
        .rohit-quick-open-active {
          background: rgba(255,255,255,.12);

          color: #ffffff;
        }

        .rohit-quick-open-empty {
          padding: 32px 20px;

          text-align: center;

          color: #858585;

          font-size: 13px;
        }

        .rohit-quick-open-footer {
          height: 36px;

          display: flex;
          align-items: center;

          gap: 18px;

          padding: 0 13px;

          border-top: 1px solid #3b3b3b;

          color: #858585;

          font-size: 11px;
        }

        .rohit-quick-open-footer kbd {
          padding: 2px 5px;

          border: 1px solid #4a4a4a;
          border-radius: 3px;

          background: #303030;

          color: #cccccc;

          font-family:
            "Cascadia Code",
            Consolas,
            monospace;

          font-size: 10px;
        }

        @media (max-width: 700px) {
          .rohit-quick-open-overlay {
            padding-top: 55px;
          }

          .rohit-quick-open {
            width: calc(100vw - 20px);
          }

          .rohit-quick-open-file-path {
            display: none;
          }
        }
      `}</style>

      <div className="rohit-quick-open">
        {/* SEARCH */}

        <div className="rohit-quick-open-search">
          <Search size={19} />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search files by name..."
            autoComplete="off"
            spellCheck={false}
          />

          <button
            type="button"
            className="rohit-quick-open-close"
            title="Close"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* FILE LIST */}

        <div className="rohit-quick-open-list">
          {filteredFiles.length > 0 ? (
            filteredFiles.map(
              (file, index) => {
                const selected =
                  index === selectedIndex;

                const active =
                  String(file.id) ===
                  String(activeFile);

                return (
                  <button
                    key={file.id ?? index}
                    type="button"
                    className={`
                      rohit-quick-open-item
                      ${selected ? "selected" : ""}
                    `}
                    onMouseEnter={() =>
                      setSelectedIndex(index)
                    }
                    onClick={() => {
                      if (file?.id != null) {
                        onSelectFile?.(file.id);
                      }
                      onClose?.();
                    }}
                  >
                    <span className="rohit-quick-open-file-icon">
                      {getFileIcon(file.name)}
                    </span>

                    <span className="rohit-quick-open-file-info">
                      <span className="rohit-quick-open-file-name">
                        {file.name}
                      </span>

                      <span className="rohit-quick-open-file-path">
                        CodeForge / src
                      </span>
                    </span>

                    {active && (
                      <span className="rohit-quick-open-active">
                        OPEN
                      </span>
                    )}
                  </button>
                );
              },
            )
          ) : (
            <div className="rohit-quick-open-empty">
              <FileCode2
                size={26}
                style={{
                  marginBottom: 8,
                  opacity: 0.6,
                }}
              />

              <div>
                No files found
              </div>

              {query && (
                <div
                  style={{
                    marginTop: 5,
                    fontSize: 11,
                  }}
                >
                  Try a different file name.
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="rohit-quick-open-footer">
          <span>
            <kbd>↑</kbd>{" "}
            <kbd>↓</kbd>{" "}
            Navigate
          </span>

          <span>
            <kbd>Enter</kbd> Open
          </span>

          <span>
            <kbd>Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuickOpen;