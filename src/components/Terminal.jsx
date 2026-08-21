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

const API_BASE = "https://rohit-code.onrender.com";

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
      text.includes("error") || text.startsWith("❌") || text.includes("failed")
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

          `❌ ${result.output || result.error || "Command failed."}`,
        ]);
      }
    } catch (error) {
      setOutput?.((previous) => [
        ...(Array.isArray(previous) ? previous : []),

        "❌ Unable to connect to Rohit Code backend.",
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

      // Echo interactive input into the terminal
      setOutput?.((previous) => [
        ...(Array.isArray(previous) ? previous : []),
        `> ${value}`,
      ]);

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

    if (text.toLowerCase().includes("error") || text.startsWith("❌")) {
      return (
        <div key={index} className="terminal-error">
          {text}
        </div>
      );
    }

    if (
      text.startsWith("✓") ||
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
  /* =====================================================
     VS CODE TERMINAL
     ===================================================== */

  .terminal-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 160px;

    background: #181818;
    color: #cccccc;

    border-top: 1px solid #2b2b2b;

    font-family:
      "Segoe UI",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;

    overflow: hidden;
  }

  /* =====================================================
     LIGHT THEME
     ===================================================== */

  .terminal-panel.terminal-light {
    background: #ffffff;
    color: #333333;
    border-top-color: #e5e5e5;
  }

  /* =====================================================
     MAXIMIZED
     ===================================================== */

  .terminal-panel.terminal-maximized {
    border-top: 0;
    border-radius: 0;
  }

  /* =====================================================
     RESIZE HANDLE
     ===================================================== */

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

    background: transparent;

    color: transparent;

    z-index: 100;
  }

  .terminal-resize-handle:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #858585;
  }

  .terminal-light .terminal-resize-handle:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  /* =====================================================
     HEADER
     ===================================================== */

  .terminal-header {
    height: 36px;
    min-height: 36px;

    display: flex;
    align-items: center;

    background: #181818;

    border-bottom: 1px solid #2b2b2b;

    padding: 0 8px;

    user-select: none;
  }

  .terminal-light .terminal-header {
    background: #f3f3f3;
    border-bottom-color: #e5e5e5;
  }

  /* =====================================================
     TERMINAL TABS
     ===================================================== */

  .terminal-tabs {
    display: flex;
    align-items: stretch;

    height: 100%;
  }

  .terminal-tab {
    position: relative;

    height: 100%;

    display: flex;
    align-items: center;

    gap: 7px;

    padding: 0 12px;

    border: 0;

    background: transparent;

    color: #858585;

    font-family: "Segoe UI", sans-serif;
    font-size: 12px;
    font-weight: 500;

    cursor: pointer;

    transition:
      color 0.12s ease,
      background 0.12s ease;
  }

  .terminal-tab:hover {
    color: #cccccc;
    background: rgba(255, 255, 255, 0.04);
  }

  .terminal-tab.active {
    color: #ffffff;
    background: #1f1f1f;
  }

  .terminal-tab.active::after {
    content: "";

    position: absolute;

    left: 0;
    right: 0;
    bottom: 0;

    height: 1px;

    background: #ffffff;
  }

  .terminal-light .terminal-tab {
    color: #666666;
  }

  .terminal-light .terminal-tab:hover {
    color: #333333;
    background: rgba(0, 0, 0, 0.04);
  }

  .terminal-light .terminal-tab.active {
    color: #111111;
    background: #ffffff;
  }

  .terminal-light .terminal-tab.active::after {
    background: #0078d4;
  }

  /* =====================================================
     SESSION INFO
     ===================================================== */

  .terminal-session {
    display: flex;
    align-items: center;

    gap: 12px;

    margin-left: auto;
    margin-right: 8px;

    color: #858585;

    font-size: 12px;
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
    font-family:
      "Cascadia Code",
      Consolas,
      monospace;

    font-size: 11px;

    color: #666666;
  }

  /* =====================================================
     HEADER ACTIONS
     ===================================================== */

  .terminal-actions {
    display: flex;
    align-items: center;

    gap: 2px;
  }

  .terminal-action {
    width: 28px;
    height: 28px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 0;
    border-radius: 3px;

    background: transparent;

    color: #858585;

    cursor: pointer;

    transition:
      background 0.12s ease,
      color 0.12s ease;
  }

  .terminal-action:hover {
    background: #2a2d2e;
    color: #ffffff;
  }

  .terminal-light .terminal-action:hover {
    background: #e5e5e5;
    color: #111111;
  }

  /* =====================================================
     TERMINAL CONTENT
     ===================================================== */

  .terminal-content {
    flex: 1;

    min-height: 0;

    overflow-y: auto;

    padding: 8px 12px 12px 12px;

    background: #181818;

    font-family:
      "Cascadia Code",
      "Cascadia Mono",
      Consolas,
      "SF Mono",
      Menlo,
      monospace;

    font-size: 13px;

    line-height: 1.5;

    letter-spacing: 0;

    scrollbar-width: thin;
    scrollbar-color: #424242 transparent;
  }

  .terminal-light .terminal-content {
    background: #ffffff;
  }

  /* =====================================================
     SCROLLBAR
     ===================================================== */

  .terminal-content::-webkit-scrollbar {
    width: 10px;
  }

  .terminal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .terminal-content::-webkit-scrollbar-thumb {
    background: #424242;

    border-radius: 0;
  }

  .terminal-content::-webkit-scrollbar-thumb:hover {
    background: #5a5a5a;
  }

  /* =====================================================
     WELCOME
     ===================================================== */

  .terminal-welcome {
    color: #cccccc;

    margin-bottom: 4px;

    font-size: 13px;
  }

  .terminal-welcome strong {
    color: #cccccc;
    font-weight: 500;
  }

  /* =====================================================
     SESSION DETAILS
     ===================================================== */

  .terminal-session-details {
    display: none;
  }

  /* =====================================================
     HELP INFORMATION
     ===================================================== */

  .terminal-content > .terminal-line:not(
    .terminal-welcome
  ):not(
    .terminal-command
  ):not(
    .terminal-error
  ):not(
    .terminal-success
  ):not(
    .terminal-time
  ) {
    color: #858585;
  }

  /* =====================================================
     OUTPUT
     ===================================================== */

  .terminal-output-area {
    margin: 5px 0;
  }

  .terminal-line {
    min-height: 20px;

    white-space: pre-wrap;

    word-break: break-word;

    color: #cccccc;

    font-family:
      "Cascadia Code",
      "Cascadia Mono",
      Consolas,
      monospace;

    font-size: 13px;

    line-height: 1.5;
  }

  /* =====================================================
     COMMAND
     ===================================================== */

  .terminal-command {
    color: #cccccc;

    font-weight: 400;
  }

  /* VS Code command prompt */

  .terminal-command::first-letter {
    color: #4ec9b0;
  }

  /* =====================================================
     ERROR
     ===================================================== */

  .terminal-error {
    color: #f48771;

    white-space: pre-wrap;
  }

  /* =====================================================
     SUCCESS
     ===================================================== */

  .terminal-success {
    color: #4ec9b0;

    white-space: pre-wrap;
  }

  /* =====================================================
     TIME
     ===================================================== */

  .terminal-time {
    color: #666666;

    font-size: 11px;

    margin-bottom: 2px;
  }

  /* =====================================================
     COMMAND INPUT
     ===================================================== */

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

  /* =====================================================
     PROMPT
     ===================================================== */

  .terminal-prompt {
    flex-shrink: 0;

    color: #4ec9b0;

    font-family:
      "Cascadia Code",
      Consolas,
      monospace;

    font-size: 13px;

    font-weight: 600;

    line-height: 1;
  }

  /* =====================================================
     INPUT
     ===================================================== */

  .terminal-input {
    flex: 1;

    min-width: 0;

    height: 22px;

    padding: 0;

    border: 0;

    outline: none;

    background: transparent;

    color: #cccccc;

    caret-color: #ffffff;

    font-family:
      "Cascadia Code",
      "Cascadia Mono",
      Consolas,
      monospace;

    font-size: 13px;

    line-height: 22px;
  }

  .terminal-input::selection {
    background: #264f78;
  }

  .terminal-input::placeholder {
    color: #666666;
    opacity: 1;
  }

  .terminal-input:disabled {
    color: #858585;
  }

  /* =====================================================
     RUNNING SPINNER
     ===================================================== */

  .terminal-spinner {
    flex-shrink: 0;

    color: #4ec9b0;

    animation:
      terminal-spin 0.8s linear infinite;
  }

  @keyframes terminal-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  /* =====================================================
     AUTOCOMPLETE
     ===================================================== */

  .terminal-suggestions {
    position: absolute;

    bottom: calc(100% + 4px);

    left: 0;

    min-width: 220px;
    max-width: 420px;

    max-height: 220px;

    overflow-y: auto;

    background: #252526;

    border: 1px solid #454545;

    border-radius: 3px;

    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.45);

    z-index: 1000;
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

    text-align: left;

    cursor: pointer;
  }

  .terminal-suggestion:hover,
  .terminal-suggestion.selected {
    background: #094771;

    color: #ffffff;
  }

  /* =====================================================
     EMPTY STATE
     ===================================================== */

  .terminal-empty {
    height: 100%;

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 8px;

    color: #858585;

    font-size: 13px;
  }

  /* =====================================================
     PROBLEMS
     ===================================================== */

  .problem-item {
    display: flex;

    align-items: flex-start;

    gap: 8px;

    padding: 4px 0;

    font-family:
      "Cascadia Code",
      Consolas,
      monospace;

    font-size: 13px;

    color: #cccccc;
  }

  /* =====================================================
     LIGHT THEME TEXT
     ===================================================== */

  .terminal-light .terminal-line {
    color: #333333;
  }

  .terminal-light .terminal-command {
    color: #333333;
  }

  .terminal-light .terminal-input {
    color: #333333;
    caret-color: #111111;
  }

  .terminal-light .terminal-prompt {
    color: #008000;
  }

  .terminal-light .terminal-success {
    color: #008000;
  }

  .terminal-light .terminal-error {
    color: #c72e0f;
  }

  .terminal-light .terminal-time {
    color: #888888;
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
              ■
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
          {outputLines.length > 0 && (
            <div className="terminal-output-area">
              {outputLines.map(renderOutputLine)}
            </div>
          )}

          <div className="terminal-command-wrapper">
            <div className="terminal-line terminal-command-line">
              <span className="terminal-prompt">{isRunning ? ">" : "$"}</span>

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
              <span>✓ No problems detected</span>
            </div>
          ) : (
            problems.map((problem, index) => (
              <div key={index} className="problem-item">
                <span>❌</span>

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
