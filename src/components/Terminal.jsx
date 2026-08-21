import {
  Terminal as TerminalIcon,
  X,
  Trash2,
  Loader2,
  GripHorizontal,
  Circle,
  Server,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "http://localhost:5000";

const TERMINAL_HEIGHT_KEY = "rohit-code-terminal-height";

const TERMINAL_HISTORY_KEY = "rohit-code-terminal-history";

const TERMINAL_COMMANDS = [
  "cd",
  "clear",
  "cls",
  "echo",
  "pwd",
  "ls",
  "mkdir",
  "touch",
  "cat",
  "rm",
  "cp",
  "mv",
  "grep",
  "find",
  "whoami",
  "date",
  "uname",
  "history",
  "history-clear",
  "clear-history",
];

function Terminal({
  output = [],
  setOutput,
  onClose,
  onTerminalInput,
  onStopExecution,
  isRunning = false,
  theme = "dark",
}) {
  const [activeTab, setActiveTab] = useState("terminal");

  const [command, setCommand] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const [filesystemSuggestions, setFilesystemSuggestions] = useState([]);

  const [isMaximized, setIsMaximized] = useState(false);

  const [terminalHeight, setTerminalHeight] = useState(() => {
    try {
      const saved = localStorage.getItem(TERMINAL_HEIGHT_KEY);

      if (!saved) return 300;

      const parsed = Number(saved);

      if (!Number.isFinite(parsed) || parsed < 160) {
        return 300;
      }

      return Math.min(
        Math.max(parsed, 160),
        Math.floor(window.innerHeight * 0.72),
      );
    } catch {
      return 300;
    }
  });

  const [isResizing, setIsResizing] = useState(false);

  const [commandHistory, setCommandHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(TERMINAL_HISTORY_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed.slice(-50) : [];
    } catch {
      return [];
    }
  });

  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalInputRef = useRef(null);

  const terminalContentRef = useRef(null);

  const resizeStartY = useRef(null);

  const resizeStartHeight = useRef(null);

  const isLight = theme === "light";

  const outputLines = Array.isArray(output) ? output : [];

  const problems = outputLines.filter((line) => {
    const text = String(line || "").toLowerCase();

    return (
      text.includes("error") || text.startsWith("âŒ") || text.includes("failed")
    );
  });

  const commandSuggestions = useMemo(() => {
    const value = command.trim().toLowerCase();

    if (!value) return [];

    return TERMINAL_COMMANDS.filter((item) =>
      item.toLowerCase().startsWith(value),
    );
  }, [command]);

  const suggestions = useMemo(() => {
    const combined = [
      ...commandSuggestions,
      ...filesystemSuggestions.map((item) => item.name),
    ];

    return [...new Set(combined)];
  }, [commandSuggestions, filesystemSuggestions]);

  useEffect(() => {
    if (suggestionIndex >= suggestions.length) {
      setSuggestionIndex(0);
    }
  }, [suggestions, suggestionIndex]);

  useEffect(() => {
    try {
      localStorage.setItem(TERMINAL_HEIGHT_KEY, String(terminalHeight));
    } catch {}
  }, [terminalHeight]);

  useEffect(() => {
    try {
      localStorage.setItem(
        TERMINAL_HISTORY_KEY,
        JSON.stringify(commandHistory),
      );
    } catch {}
  }, [commandHistory]);

  // =========================================
  // FOCUS INTERACTIVE INPUT
  // =========================================

  useEffect(() => {
    if (isRunning && activeTab === "terminal") {
      const timer = setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [isRunning, activeTab]);

  useEffect(() => {
    if (!isRunning && activeTab === "terminal") {
      const timer = setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isRunning, activeTab]);

  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {
    const terminal = terminalContentRef.current;

    if (!terminal) return;

    requestAnimationFrame(() => {
      terminal.scrollTop = terminal.scrollHeight;
    });
  }, [outputLines.length, outputLines.join(""), isRunning, activeTab]);

  // =========================================
  // RESIZE
  // =========================================

  const handleResizeStart = (event) => {
    event.preventDefault();

    if (isMaximized) return;

    resizeStartY.current = event.clientY;

    resizeStartHeight.current = terminalHeight;

    setIsResizing(true);

    document.body.style.cursor = "ns-resize";

    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event) => {
      if (resizeStartY.current === null || resizeStartHeight.current === null) {
        return;
      }

      const difference = resizeStartY.current - event.clientY;

      const newHeight = resizeStartHeight.current + difference;

      const minHeight = 160;

      const maxHeight = Math.max(
        minHeight,
        Math.floor(window.innerHeight * 0.72),
      );

      setTerminalHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
    };

    const handleMouseUp = () => {
      setIsResizing(false);

      resizeStartY.current = null;
      resizeStartHeight.current = null;

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);

      document.removeEventListener("mouseup", handleMouseUp);

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  // =========================================
  // CLEAR
  // =========================================

  const clearTerminal = () => {
    setOutput?.([]);

    setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 50);
  };

  const clearHistory = () => {
    setCommandHistory([]);
    setHistoryIndex(-1);

    try {
      localStorage.removeItem(TERMINAL_HISTORY_KEY);
    } catch {}
  };

  // =========================================
  // FILESYSTEM SUGGESTIONS
  // =========================================

  const fetchFilesystemSuggestions = async (value) => {
    const trimmed = value.trim();

    if (!trimmed.startsWith("cd ")) {
      setFilesystemSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/terminal/suggest`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          input: value,
        }),
      });

      if (!response.ok) {
        setFilesystemSuggestions([]);
        return;
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.suggestions)) {
        setFilesystemSuggestions(result.suggestions);
      } else {
        setFilesystemSuggestions([]);
      }
    } catch {
      setFilesystemSuggestions([]);
    }
  };

  // =========================================
  // SUGGESTION
  // =========================================

  const selectSuggestion = (suggestion) => {
    if (!suggestion) return;

    if (command.trim().startsWith("cd ")) {
      setCommand(`cd ${suggestion} `);
    } else {
      setCommand(`${suggestion} `);
    }

    setSuggestionIndex(0);
    setShowSuggestions(false);

    setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 30);
  };

  // =========================================
  // NORMAL TERMINAL COMMAND
  // =========================================

  const executeCommand = async (trimmedCommand) => {
    if (!trimmedCommand) return;

    if (trimmedCommand === "clear" || trimmedCommand === "cls") {
      clearTerminal();
      setCommand("");
      setHistoryIndex(-1);
      setShowSuggestions(false);
      return;
    }

    if (
      trimmedCommand === "history-clear" ||
      trimmedCommand === "clear-history"
    ) {
      clearHistory();
      setCommand("");
      setShowSuggestions(false);
      return;
    }

    if (trimmedCommand === "history") {
      setOutput?.((previous) => [
        ...(Array.isArray(previous) ? previous : []),

        `$ ${trimmedCommand}`,

        ...(commandHistory.length ? commandHistory : ["(no history yet)"]),
      ]);

      setCommand("");
      setShowSuggestions(false);
      return;
    }

    setCommandHistory((previous) => {
      const last = previous[previous.length - 1];

      if (last === trimmedCommand) {
        return previous;
      }

      return [...previous, trimmedCommand].slice(-50);
    });

    setHistoryIndex(-1);
    setShowSuggestions(false);

    setOutput?.((previous) => [
      ...(Array.isArray(previous) ? previous : []),

      `$ ${trimmedCommand}`,
    ]);

    setCommand("");

    try {
      const response = await fetch(`${API_BASE}/api/terminal`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          command: trimmedCommand,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const text = String(result.output || "").replace(/\n$/, "");

        if (text) {
          setOutput?.((previous) => [
            ...(Array.isArray(previous) ? previous : []),

            ...text.split("\n"),
          ]);
        }
      } else {
        setOutput?.((previous) => [
          ...(Array.isArray(previous) ? previous : []),

          `âŒ ${result.output || result.error || "Command failed."}`,
        ]);
      }
    } catch (error) {
      setOutput?.((previous) => [
        ...(Array.isArray(previous) ? previous : []),

        "âŒ Unable to connect to Rohit Code backend.",
      ]);
    } finally {
      setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 50);
    }
  };

  // =========================================
  // KEYBOARD
  // =========================================

  const handleCommand = (event) => {
    // ---------------------------------------
    // INTERACTIVE PROGRAM
    // ---------------------------------------

    if (isRunning) {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      const value = command.trim();

      if (!value) {
        return;
      }

      // ---------------------------------------
      // VS CODE STYLE INTERACTIVE INPUT
      // ---------------------------------------
      // If the program has just printed a prompt
      // such as "Enter three numbers:", place the
      // first value on that same line. Subsequent
      // values are placed on their own lines.
      setOutput?.((previous) => {
        const lines = Array.isArray(previous) ? [...previous] : [];

        if (lines.length === 0) {
          lines.push(value);
          return lines;
        }

        const lastIndex = lines.length - 1;
        const lastLine = String(lines[lastIndex] ?? "");

        // Match normal interactive prompts ending
        // with ':' or '?'.
        if (/[?:]\s*$/.test(lastLine)) {
          lines[lastIndex] = `${lastLine.trimEnd()} ${value}`;
        } else {
          lines.push(value);
        }

        return lines;
      });

      setCommand("");
      setShowSuggestions(false);
      setHistoryIndex(-1);

      if (typeof onTerminalInput === "function") {
        onTerminalInput(value);
      }

      setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 30);

      return;
    }

    // ---------------------------------------
    // CTRL + K
    // ---------------------------------------

    if (event.ctrlKey && event.key.toLowerCase() === "k") {
      event.preventDefault();

      setCommand("");
      setHistoryIndex(-1);
      setSuggestionIndex(0);
      setShowSuggestions(false);

      return;
    }

    // ---------------------------------------
    // ESC
    // ---------------------------------------

    if (event.key === "Escape") {
      event.preventDefault();

      setCommand("");
      setHistoryIndex(-1);
      setSuggestionIndex(0);
      setShowSuggestions(false);

      return;
    }

    // ---------------------------------------
    // CTRL + L
    // ---------------------------------------

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();

      clearTerminal();

      setCommand("");
      setSuggestionIndex(0);
      setShowSuggestions(false);

      return;
    }

    // ---------------------------------------
    // TAB
    // ---------------------------------------

    if (event.key === "Tab") {
      event.preventDefault();

      if (!suggestions.length) {
        return;
      }

      selectSuggestion(suggestions[suggestionIndex]);

      return;
    }

    // ---------------------------------------
    // HISTORY UP
    // ---------------------------------------

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (showSuggestions && suggestions.length) {
        setSuggestionIndex((previous) =>
          previous === 0 ? suggestions.length - 1 : previous - 1,
        );

        return;
      }

      if (!commandHistory.length) {
        return;
      }

      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(historyIndex - 1, 0);

      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex]);

      return;
    }

    // ---------------------------------------
    // HISTORY DOWN
    // ---------------------------------------

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (showSuggestions && suggestions.length) {
        setSuggestionIndex((previous) =>
          previous === suggestions.length - 1 ? 0 : previous + 1,
        );

        return;
      }

      if (!commandHistory.length) {
        return;
      }

      if (historyIndex === -1) {
        return;
      }

      const nextIndex = historyIndex + 1;

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCommand("");
        return;
      }

      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex]);

      return;
    }

    // ---------------------------------------
    // ENTER
    // ---------------------------------------

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const trimmedCommand = command.trim();

    if (showSuggestions && suggestions.length && trimmedCommand) {
      const selected = suggestions[suggestionIndex];

      if (selected && selected !== trimmedCommand) {
        selectSuggestion(selected);
        return;
      }
    }

    executeCommand(trimmedCommand);
  };

  // =========================================
  // RENDER OUTPUT
  // =========================================

  const renderOutputLine = (line, index) => {
    if (line === "__RUNNING__") {
      return null;
    }

    const text = String(line || "");

    if (text.startsWith("__TIME__:")) {
      return (
        <div key={index} className="terminal-time">
          {text.replace("__TIME__:", "")}
        </div>
      );
    }

    if (text.startsWith("$ ")) {
      return (
        <div key={index} className="terminal-command">
          {text}
        </div>
      );
    }

    if (text.toLowerCase().includes("error") || text.startsWith("âŒ")) {
      return (
        <div key={index} className="terminal-error">
          {text}
        </div>
      );
    }

    if (
      text.startsWith("âœ“") ||
      text.toLowerCase().includes("success") ||
      text.toLowerCase().includes("process exited with code 0")
    ) {
      return (
        <div key={index} className="terminal-success">
          {text}
        </div>
      );
    }

    return (
      <div key={index} className="terminal-line">
        {text || "\u00A0"}
      </div>
    );
  };

  const panelStyle = isMaximized
    ? {
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        zIndex: 99999,
      }
    : {
        height: `${terminalHeight}px`,
        minHeight: "160px",
        width: "100%",
      };

  return (
    <div
      className={`
        terminal-panel
        terminal-${theme}
        ${isResizing ? "terminal-resizing" : ""}
        ${isMaximized ? "terminal-maximized" : ""}
        ${isLight ? "terminal-light" : ""}
      `}
      style={panelStyle}
    >
      <style>{`
        .terminal-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          background: #181818;
          color: #cccccc;
          border-top: 1px solid #303030;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
          overflow: hidden;
          box-sizing: border-box;
        }

        .terminal-panel *,
        .terminal-panel *::before,
        .terminal-panel *::after {
          box-sizing: border-box;
        }

        .terminal-panel.terminal-light {
          background: #ffffff;
          color: #333333;
          border-top-color: #d4d4d4;
        }

        .terminal-panel.terminal-maximized {
          border-top: 0;
        }

        .terminal-resize-handle {
          position: absolute;
          top: -4px;
          left: 0;
          right: 0;
          height: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: ns-resize;
          color: transparent;
          z-index: 50;
          background: transparent;
        }

        .terminal-resize-handle:hover {
          color: #858585;
          background: rgba(255, 255, 255, 0.04);
        }

        .terminal-resize-handle svg {
          width: 16px;
          height: 16px;
        }

        .terminal-header {
          height: 36px;
          min-height: 36px;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          padding: 0;
          border-bottom: 1px solid #2b2b2b;
          background: #181818;
          user-select: none;
        }

        .terminal-light .terminal-header {
          background: #f3f3f3;
          border-bottom-color: #d4d4d4;
        }

        .terminal-tabs {
          display: flex;
          align-items: stretch;
          height: 100%;
          min-width: 0;
        }

        .terminal-tab {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 14px;
          border: 0;
          border-right: 1px solid transparent;
          background: transparent;
          color: #969696;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: color 80ms ease, background 80ms ease;
        }

        .terminal-tab:hover {
          color: #d7d7d7;
          background: #1f1f1f;
        }

        .terminal-tab.active {
          color: #ffffff;
          background: #1e1e1e;
        }

        .terminal-tab.active::after {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 0;
          height: 1px;
          background: #007acc;
        }

        .terminal-light .terminal-tab {
          color: #666666;
        }

        .terminal-light .terminal-tab:hover {
          color: #333333;
          background: #e8e8e8;
        }

        .terminal-light .terminal-tab.active {
          color: #1f1f1f;
          background: #ffffff;
        }

        .terminal-light .terminal-tab.active::after {
          background: #0078d4;
        }

        .terminal-session {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
          padding: 0 10px;
          color: #858585;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
        }

        .terminal-session-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .terminal-connected {
          color: #4ec9b0;
        }

        .terminal-session-directory {
          color: #666666;
          font-family: Consolas, "Cascadia Code", monospace;
          font-size: 11px;
        }

        .terminal-actions {
          display: flex;
          align-items: center;
          height: 100%;
          padding: 0 4px;
          gap: 1px;
        }

        .terminal-action {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 3px;
          background: transparent;
          color: #858585;
          cursor: pointer;
          transition: background 80ms ease, color 80ms ease;
        }

        .terminal-action:hover {
          background: #2a2d2e;
          color: #ffffff;
        }

        .terminal-action:active {
          background: #333333;
        }

        .terminal-light .terminal-action:hover {
          background: #e5e5e5;
          color: #222222;
        }

        .terminal-content {
          flex: 1;
          min-height: 0;
          overflow-x: auto;
          overflow-y: auto;
          padding: 12px 18px 14px;
          background: #181818;
          font-family:
            "Cascadia Code",
            "Cascadia Mono",
            Consolas,
            "SF Mono",
            Menlo,
            monospace;
          font-size: 13px;
          line-height: 1.55;
          letter-spacing: 0;
          scrollbar-width: thin;
          scrollbar-color: #424242 transparent;
        }

        .terminal-light .terminal-content {
          background: #ffffff;
          scrollbar-color: #c1c1c1 transparent;
        }

        .terminal-content::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .terminal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .terminal-content::-webkit-scrollbar-thumb {
          background: #424242;
          border: 2px solid #181818;
          border-radius: 0;
        }

        .terminal-content::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }

        .terminal-light .terminal-content::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-color: #ffffff;
        }

        .terminal-line {
          min-height: 20px;
          white-space: pre-wrap;
          word-break: break-word;
          color: #cccccc;
        }

        .terminal-light .terminal-line {
          color: #333333;
        }

        .terminal-welcome {
          color: #4ec9b0;
          margin-bottom: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 12px;
        }

        .terminal-command {
          color: #9cdcfe;
        }

        .terminal-error {
          color: #f48771;
        }

        .terminal-success {
          color: #4ec9b0;
        }

        .terminal-time {
          color: #6a6a6a;
          font-size: 11px;
        }

        .terminal-session-details {
          display: none;
        }

        .terminal-output-area {
          margin: 8px 0 0;
        }

        .terminal-command-wrapper {
          position: relative;
          margin-top: 2px;
        }

        .terminal-command-line {
          display: flex;
          align-items: center;
          gap: 7px;
          min-height: 22px;
        }

        .terminal-prompt {
          flex: 0 0 auto;
          color: #4ec9b0;
          font-family:
            "Cascadia Code",
            Consolas,
            monospace;
          font-size: 13px;
          font-weight: 700;
        }

        .terminal-input {
          flex: 1;
          min-width: 0;
          height: 22px;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #f0f0f0;
          caret-color: #ffffff;
          font-family:
            "Cascadia Code",
            "Cascadia Mono",
            Consolas,
            monospace;
          font-size: 13px;
          line-height: 22px;
        }

        .terminal-input::placeholder {
          color: #6a6a6a;
          opacity: 1;
        }

        .terminal-input:disabled {
          color: #6a6a6a;
        }

        .terminal-spinner {
          flex: 0 0 auto;
          color: #4ec9b0;
          animation: terminal-spin .8s linear infinite;
        }

        @keyframes terminal-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .terminal-suggestions {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 0;
          min-width: 240px;
          max-width: 440px;
          max-height: 220px;
          overflow-y: auto;
          background: #252526;
          border: 1px solid #454545;
          border-radius: 2px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, .45);
          z-index: 20;
        }

        .terminal-suggestion {
          display: block;
          width: 100%;
          padding: 6px 10px;
          border: 0;
          background: transparent;
          color: #cccccc;
          font-family:
            "Cascadia Code",
            Consolas,
            monospace;
          font-size: 12px;
          line-height: 18px;
          text-align: left;
          cursor: pointer;
        }

        .terminal-suggestion:hover,
        .terminal-suggestion.selected {
          background: #094771;
          color: #ffffff;
        }

        .terminal-empty {
          height: 100%;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6a6a6a;
          font-size: 13px;
        }

        .problem-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 5px 0;
          font-size: 13px;
          color: #cccccc;
        }

        .terminal-resizing,
        .terminal-resizing * {
          cursor: ns-resize !important;
        }

        @media (max-width: 700px) {
          .terminal-session {
            display: none;
          }

          .terminal-tab {
            padding: 0 10px;
          }

          .terminal-content {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>

      {!isMaximized && (
        <div
          className="terminal-resize-handle"
          onMouseDown={handleResizeStart}
          title="Drag to resize terminal"
        >
          <GripHorizontal size={18} />
        </div>
      )}

      <div className="terminal-header">
        <div className="terminal-tabs">
          <button
            type="button"
            className={`terminal-tab ${
              activeTab === "terminal" ? "active" : ""
            }`}
            onClick={() => setActiveTab("terminal")}
          >
            <TerminalIcon size={14} />
            <span>TERMINAL</span>
          </button>

          <button
            type="button"
            className={`terminal-tab ${
              activeTab === "problems" ? "active" : ""
            }`}
            onClick={() => setActiveTab("problems")}
          >
            <span>
              PROBLEMS
              {problems.length ? ` ${problems.length}` : ""}
            </span>
          </button>

          <button
            type="button"
            className={`terminal-tab ${activeTab === "output" ? "active" : ""}`}
            onClick={() => setActiveTab("output")}
          >
            <span>OUTPUT</span>
          </button>
        </div>

        <div className="terminal-session">
          <span className="terminal-session-item">
            <Server size={13} />
            <span>Rohit Code</span>
          </span>

          <span className="terminal-session-item terminal-connected">
            <Circle size={7} fill="currentColor" />
            <span>{isRunning ? "Running" : "Connected"}</span>
          </span>

          <span className="terminal-session-directory">/</span>
        </div>

        <div className="terminal-actions">
          {isRunning && onStopExecution && (
            <button
              type="button"
              className="terminal-action"
              title="Stop Program"
              onClick={onStopExecution}
            >
              â–
            </button>
          )}

          <button
            type="button"
            className="terminal-action"
            title="Clear Terminal"
            onClick={clearTerminal}
          >
            <Trash2 size={15} />
          </button>

          <button
            type="button"
            className="terminal-action"
            title={isMaximized ? "Restore Terminal" : "Maximize Terminal"}
            onClick={() => setIsMaximized((previous) => !previous)}
          >
            {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {onClose && (
            <button
              type="button"
              className="terminal-action"
              title="Close Terminal"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {activeTab === "terminal" && (
        <div ref={terminalContentRef} className="terminal-content">
          <div className="terminal-line terminal-welcome">
            <strong>Rohit Code Terminal</strong>
          </div>

          <div className="terminal-session-details">
            <div>
              <Server size={13} />
              <span>Docker Terminal</span>
            </div>

            <div>
              <Circle size={7} fill="currentColor" />
              <span>Backend Connected</span>
            </div>

            <div>
              <span>Working Directory: /</span>
            </div>
          </div>

          <div className="terminal-line">â†‘ â†“ Command History</div>

          <div className="terminal-line">Tab Autocomplete</div>

          <div className="terminal-line">Ctrl + L Clear Terminal</div>

          <div className="terminal-line">Ctrl + K Clear Input</div>

          <div className="terminal-line">Esc Clear Input</div>

          {outputLines.length > 0 && (
            <div className="terminal-output-area">
              {outputLines.map(renderOutputLine)}
            </div>
          )}

          <div className="terminal-command-wrapper">
            <div className="terminal-line terminal-command-line">
              <span className="terminal-prompt">{isRunning ? "" : "$"}</span>

              <input
                ref={terminalInputRef}
                className="terminal-input"
                value={command}
                autoFocus
                /*
                 * IMPORTANT:
                 *
                 * NEVER disable this input while
                 * an interactive C/C++/Java/Python
                 * program is running.
                 */
                disabled={false}
                placeholder={
                  isRunning ? "Enter program input..." : "Type a command..."
                }
                onChange={(event) => {
                  const value = event.target.value;

                  setCommand(value);

                  setHistoryIndex(-1);
                  setSuggestionIndex(0);

                  /*
                   * Do not show shell
                   * autocomplete while
                   * interactive program
                   * is running.
                   */
                  if (isRunning) {
                    setShowSuggestions(false);
                    return;
                  }

                  setShowSuggestions(value.trim().length > 0);

                  fetchFilesystemSuggestions(value);
                }}
                onKeyDown={handleCommand}
              />

              {isRunning && <Loader2 size={14} className="terminal-spinner" />}
            </div>

            {!isRunning && showSuggestions && suggestions.length > 0 && (
              <div className="terminal-suggestions">
                {suggestions.map((suggestion, index) => (
                  <button
                    type="button"
                    key={`${suggestion}-${index}`}
                    className={`terminal-suggestion ${
                      index === suggestionIndex ? "selected" : ""
                    }`}
                    onMouseDown={(event) => {
                      event.preventDefault();

                      selectSuggestion(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "output" && (
        <div className="terminal-content">
          {outputLines.length === 0 ? (
            <div className="terminal-empty">
              <TerminalIcon size={20} />
              <span>Output will appear here</span>
            </div>
          ) : (
            outputLines.map(renderOutputLine)
          )}
        </div>
      )}

      {activeTab === "problems" && (
        <div className="terminal-content">
          {problems.length === 0 ? (
            <div className="terminal-empty">
              <span>âœ“ No problems detected</span>
            </div>
          ) : (
            problems.map((problem, index) => (
              <div key={index} className="problem-item">
                <span>âŒ</span>

                <span>{problem}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Terminal;
