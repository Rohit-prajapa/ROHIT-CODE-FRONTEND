import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  FilePlus2,
  Save,
  Play,
  Terminal,
  Settings,
  FolderOpen,
  Eraser,
  X as CloseTabIcon,
  X,
} from "lucide-react";

function CommandPalette({
  isOpen = false,
  onClose,
  onNewFile,
  onSave,
  onRun,
  onOpenFile,
  onToggleTerminal,
  onSettings,
  onSearch,
  onClearTerminal,
  onCloseTab,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(
    () => [
      {
        id: "new-file",
        label: "File: New File",
        shortcut: "Ctrl+N",
        icon: FilePlus2,
        action: onNewFile,
      },
      {
        id: "open-file",
        label: "File: Open File",
        shortcut: "Ctrl+O",
        icon: FolderOpen,
        action: onOpenFile,
      },
      {
        id: "save",
        label: "File: Save",
        shortcut: "Ctrl+S",
        icon: Save,
        action: onSave,
      },
      {
        id: "close-tab",
        label: "View: Close Tab",
        shortcut: "Ctrl+W",
        icon: CloseTabIcon,
        action: onCloseTab,
      },
      {
        id: "run",
        label: "Run: Run Current File",
        shortcut: "Ctrl+Enter",
        icon: Play,
        action: onRun,
      },
      {
        id: "search",
        label: "Edit: Search in Files",
        shortcut: "Ctrl+Shift+F",
        icon: Search,
        action: onSearch,
      },
      {
        id: "terminal",
        label: "View: Toggle Terminal",
        shortcut: "Ctrl+`",
        icon: Terminal,
        action: onToggleTerminal,
      },
      {
        id: "clear-terminal",
        label: "Terminal: Clear Terminal",
        shortcut: "",
        icon: Eraser,
        action: onClearTerminal,
      },
      {
        id: "settings",
        label: "Preferences: Open Settings",
        shortcut: "Ctrl+,",
        icon: Settings,
        action: onSettings,
      },
    ],
    [
      onNewFile,
      onOpenFile,
      onSave,
      onCloseTab,
      onRun,
      onSearch,
      onToggleTerminal,
      onClearTerminal,
      onSettings,
    ],
  ).filter((command) => typeof command.action === "function");

  const filteredCommands = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return commands;

    return commands.filter((command) =>
      command.label.toLowerCase().includes(value),
    );
  }, [commands, query]);

  useEffect(() => {
    if (!isOpen) return;

    setQuery("");
    setSelectedIndex(0);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((previous) =>
          filteredCommands.length
            ? (previous + 1) % filteredCommands.length
            : 0,
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((previous) =>
          filteredCommands.length
            ? previous <= 0
              ? filteredCommands.length - 1
              : previous - 1
            : 0,
        );
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const command = filteredCommands[selectedIndex];

        if (command?.action) {
          onClose?.();
          command.action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(0);
    }
  }, [filteredCommands.length, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="rohit-command-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <style>{`
        .rohit-command-overlay {
          position: fixed;
          inset: 0;
          z-index: 20000;
          background: rgba(0, 0, 0, .35);
          font-family: "Segoe UI", Inter, sans-serif;
        }

        .rohit-command-palette {
          position: absolute;
          top: 72px;
          left: 50%;
          width: min(680px, calc(100vw - 32px));
          transform: translateX(-50%);
          overflow: hidden;
          background: #252526;
          border: 1px solid #454545;
          border-radius: 6px;
          box-shadow:
            0 18px 45px rgba(0,0,0,.55),
            0 3px 12px rgba(0,0,0,.35);
        }

        .rohit-command-search {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border-bottom: 1px solid #3b3b3b;
          color: #858585;
        }

        .rohit-command-search input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #ffffff;
          font-size: 16px;
        }

        .rohit-command-search input::placeholder {
          color: #858585;
        }

        .rohit-command-close {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 4px;
          background: transparent;
          color: #858585;
          cursor: pointer;
        }

        .rohit-command-close:hover {
          background: #3a3a3a;
          color: #ffffff;
        }

        .rohit-command-list {
          max-height: 360px;
          padding: 6px;
          overflow-y: auto;
        }

        .rohit-command-item {
          width: 100%;
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 10px;
          border: 0;
          border-radius: 4px;
          background: transparent;
          color: #cccccc;
          text-align: left;
          cursor: pointer;
        }

        .rohit-command-item:hover,
        .rohit-command-item.selected {
          background: #094771;
          color: #ffffff;
        }

        .rohit-command-icon {
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9cdcfe;
        }

        .rohit-command-label {
          flex: 1;
          font-size: 14px;
        }

        .rohit-command-shortcut {
          color: #858585;
          font-family: "Cascadia Code", Consolas, monospace;
          font-size: 11px;
        }

        .rohit-command-item.selected .rohit-command-shortcut {
          color: #cccccc;
        }

        .rohit-command-empty {
          padding: 24px 12px;
          color: #858585;
          text-align: center;
          font-size: 13px;
        }

        .rohit-command-footer {
          padding: 7px 12px;
          border-top: 1px solid #333333;
          color: #707070;
          font-size: 11px;
        }
      `}</style>

      <div className="rohit-command-palette">
        <div className="rohit-command-search">
          <Search size={18} />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command to search..."
            aria-label="Command Palette"
          />

          <button
            type="button"
            className="rohit-command-close"
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="rohit-command-list">
          {filteredCommands.length ? (
            filteredCommands.map((command, index) => {
              const Icon = command.icon;

              return (
                <button
                  key={command.id}
                  type="button"
                  className={`rohit-command-item ${
                    index === selectedIndex ? "selected" : ""
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    onClose?.();
                    command.action?.();
                  }}
                >
                  <span className="rohit-command-icon">
                    <Icon size={16} />
                  </span>

                  <span className="rohit-command-label">
                    {command.label}
                  </span>

                  <span className="rohit-command-shortcut">
                    {command.shortcut}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="rohit-command-empty">
              No commands found.
            </div>
          )}
        </div>

        <div className="rohit-command-footer">
          ↑ ↓ Navigate &nbsp; • &nbsp; Enter Run &nbsp; • &nbsp; Esc Close
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
