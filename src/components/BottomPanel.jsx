import { useEffect, useRef, useState } from "react";
import {
  Terminal as TerminalIcon,
  AlertCircle,
  FileText,
  X,
  Square,
  Maximize2,
  ChevronDown,
  Plus,
  Eraser,
} from "lucide-react";

const PANEL_HEIGHT_KEY = "rohit-code-bottom-panel-height";

function BottomPanel({
  activePanel = "terminal",
  onPanelChange,
  output = [],
  problems = [],
  onClose,
  onTerminalInput,
  onStopExecution,
  isRunning = false,
}) {
  // =========================================
  // PANEL SIZE
  // =========================================

  const [height, setHeight] = useState(() => {
    try {
      const savedHeight = localStorage.getItem(PANEL_HEIGHT_KEY);

      const parsedHeight = Number(savedHeight);

      if (
        Number.isFinite(parsedHeight) &&
        parsedHeight >= 140 &&
        parsedHeight <= 650
      ) {
        return parsedHeight;
      }
    } catch {}

    return 300;
  });

  // =========================================
  // TERMINAL INPUT
  // =========================================

  const [input, setInput] = useState("");

  /*
   * Stores inputs typed by the user so they can
   * be displayed exactly where they were entered.
   *
   * Example:
   *
   * Enter the 1st Number: 4
   * Enter the 2nd Number: 6
   */
  const [submittedInputs, setSubmittedInputs] = useState([]);

  const [isDragging, setIsDragging] = useState(false);

  const [terminalName, setTerminalName] = useState("CodeForge");

  const [terminalMenuOpen, setTerminalMenuOpen] = useState(false);

  // =========================================
  // REFS
  // =========================================

  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const isDraggingRef = useRef(false);
  const terminalMenuRef = useRef(null);

  // =========================================
  // PROBLEMS
  // =========================================

  const errors = problems.filter(
    (problem) => problem.severity === "error",
  ).length;

  const warnings = problems.filter(
    (problem) => problem.severity === "warning",
  ).length;

  const problemCount = errors + warnings;

  // =========================================
  // SAVE PANEL SIZE
  // =========================================

  useEffect(() => {
    try {
      localStorage.setItem(PANEL_HEIGHT_KEY, String(height));
    } catch {}
  }, [height]);

  // =========================================
  // RESET INPUT HISTORY WHEN A NEW PROGRAM STARTS
  // =========================================

  const wasRunningRef = useRef(false);

  useEffect(() => {
    if (isRunning && !wasRunningRef.current) {
      setSubmittedInputs([]);
      setInput("");
    }

    wasRunningRef.current = isRunning;
  }, [isRunning]);

  // =========================================
  // CLEAR INPUT HISTORY WHEN PROGRAM STOPS
  // =========================================

  useEffect(() => {
    if (!isRunning) {
      setInput("");
    }
  }, [isRunning]);

  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {
    const terminal = terminalRef.current;

    if (!terminal) return;

    requestAnimationFrame(() => {
      terminal.scrollTop = terminal.scrollHeight;
    });
  }, [output, isRunning]);

  // =========================================
  // FOCUS TERMINAL INPUT
  // =========================================

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => {
      clearTimeout(timer);
    };
  }, [isRunning]);

  // =========================================
  // CLOSE DROPDOWN OUTSIDE CLICK
  // =========================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        terminalMenuRef.current &&
        !terminalMenuRef.current.contains(event.target)
      ) {
        setTerminalMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // =========================================
  // RESIZE
  // =========================================

  const handleDragStart = (event) => {
    event.preventDefault();

    isDraggingRef.current = true;

    setIsDragging(true);

    document.body.style.cursor = "ns-resize";

    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleDragMove = (event) => {
      if (!isDraggingRef.current) {
        return;
      }

      const viewportHeight = window.innerHeight;

      const newHeight = viewportHeight - event.clientY;

      const minHeight = 160;

      const maxHeight = Math.max(minHeight, Math.floor(viewportHeight * 0.7));

      setHeight(Math.min(maxHeight, Math.max(minHeight, newHeight)));
    };

    const handleDragEnd = () => {
      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;

      setIsDragging(false);

      document.body.style.cursor = "";

      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleDragMove);

    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDragMove);

      window.removeEventListener("mouseup", handleDragEnd);

      document.body.style.cursor = "";

      document.body.style.userSelect = "";
    };
  }, []);

  // =========================================
  // RESET PANEL SIZE
  // =========================================

  const resetPanelSize = () => {
    setHeight(300);
  };

  // =========================================
  // TERMINAL ACTIONS
  // =========================================

  const clearVisibleTerminal = () => {
    /*
     * Parent owns actual terminal output.
     *
     * We clear locally submitted inputs so
     * the visual terminal is reset.
     */
    setSubmittedInputs([]);

    setInput("");

    terminalRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTerminalMenuOpen(false);
  };

  const createTerminalView = () => {
    setTerminalName(`CodeForge-${Date.now().toString().slice(-3)}`);

    setTerminalMenuOpen(false);
  };

  // =========================================
  // SEND TERMINAL INPUT
  // =========================================

  const sendInput = () => {
    if (!isRunning) return;

    if (!onTerminalInput) return;

    const value = String(input);

    /*
     * Don't send an empty input accidentally.
     *
     * If the user presses Enter on an empty
     * line, we still send "\n" because programs
     * such as scanf may need it.
     */
    const inputValue = value;

    /*
     * Keep entered values in order.
     *
     * We intentionally do NOT store an output-array index here.
     * Docker/Socket.IO can split stdout into arbitrary chunks.
     */
    setSubmittedInputs((previous) => [...previous, inputValue]);

    /*
     * Send input to backend.
     *
     * App.jsx will add the newline.
     */
    onTerminalInput(inputValue);

    /*
     * Clear input box after submitting.
     */
    setInput("");

    /*
     * Keep terminal focused.
     */
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // =========================================
  // ENTER KEY
  // =========================================

  const handleInputKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    sendInput();
  };

  // =========================================
  // TERMINAL SHORTCUT
  // =========================================

  useEffect(() => {
    const handleTerminalShortcut = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "c") {
        event.preventDefault();

        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleTerminalShortcut);

    return () => {
      window.removeEventListener("keydown", handleTerminalShortcut);
    };
  }, []);

  // =========================================
  // TERMINAL LINES
  // =========================================

  const terminalLines = Array.isArray(output)
    ? output.map((item) => String(item ?? ""))
    : [String(output ?? "")];

  /*
   * App.jsx already provides terminal output as entries.
   * Keep those entries separate so newlines are not lost.
   */

  // =========================================
  // TERMINAL INPUT ECHO
  // =========================================

  const isPromptText = (text) => {
    const value = String(text ?? "").trim();

    if (!value) return false;

    return (
      /\b(enter|input|choice|select|password|value|number|name|age)\b/i.test(
        value,
      ) || /[:?]\s*$/.test(value)
    );
  };

  /*
   * Render submitted values directly after their prompts.
   *
   * Important:
   * stdout can arrive in arbitrary chunks. For example:
   *
   * "Enter the 1st Number: Enter the 2nd Number: Sum = "
   *
   * can arrive as ONE chunk. We therefore split prompt boundaries
   * before attaching submitted values.
   */
  const buildTerminalDisplay = () => {
    const values = [...submittedInputs];
    let valueIndex = 0;
    const display = [];

    for (const rawLine of terminalLines) {
      const line = String(rawLine ?? "");

      if (!line) {
        display.push("");
        continue;
      }

      let remaining = line;

      while (remaining.length > 0) {
        const promptMatch = remaining.match(
          /^(.*?\b(?:enter|input|choice|select|password|value|number|name|age)\b[^:?\n]*[:?]\s*)/i,
        );

        if (!promptMatch) {
          display.push(remaining);
          remaining = "";
          continue;
        }

        const prompt = promptMatch[1];
        display.push(prompt);

        if (valueIndex < values.length) {
          display.push(String(values[valueIndex]));
          valueIndex += 1;
        }

        remaining = remaining.slice(prompt.length);
      }
    }

    /*
     * If some submitted values have not yet appeared in stdout,
     * keep them out of the terminal until their prompt arrives.
     */
    return display;
  };

  const displayedTerminalLines = buildTerminalDisplay();

  // =========================================
  // STYLES
  // =========================================

  const panelStyle = {
    height: `${height}px`,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    background: "#181818",
    borderTop: "1px solid #2d2d2d",
    color: "#cccccc",
    fontFamily:
      'Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    position: "relative",
    overflow: "visible",
  };

  const headerStyle = {
    height: "38px",
    minHeight: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#181818",
    borderBottom: "1px solid #292929",
  };

  const tabsStyle = {
    height: "100%",
    display: "flex",
    alignItems: "stretch",
    paddingLeft: "8px",
    gap: 0,
  };

  const tabStyle = (active) => ({
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "0 11px",
    border: "none",
    borderBottom: active ? "1px solid #ffffff" : "1px solid transparent",
    background: "transparent",
    color: active ? "#ffffff" : "#999999",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.4px",
    cursor: "pointer",
  });

  const actionsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    paddingRight: "8px",
  };

  const contentStyle = {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  };

  const terminalStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#181818",
  };

  const terminalToolbarStyle = {
    height: "34px",
    minHeight: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
    color: "#999999",
    fontSize: "11px",
    borderBottom: "1px solid #252525",
    background: "#181818",
  };

  const terminalOutputStyle = {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "auto",
    padding: "10px 14px 14px",
    background: "#181818",
    color: "#d4d4d4",
    fontFamily: 'Consolas, "Cascadia Code", "Courier New", monospace',
    fontSize: "13px",
    lineHeight: "1.55",
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <section className="bottom-panel" style={panelStyle}>
      <style>{`
        .bp-icon-btn {
          width: 30px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 4px;
          background: transparent;
          color: #aaaaaa;
          cursor: pointer;
          transition:
            background .12s ease,
            color .12s ease;
        }

        .bp-icon-btn:hover {
          background: #2a2d2e;
          color: #ffffff;
        }

        .bp-stop-btn {
          width: 70px;
          gap: 6px;
          color: #f48771;
          font-size: 11px;
        }

        .bp-stop-btn:hover {
          background: #3a2323;
          color: #ff8a73;
        }

        .bp-menu-item {
          width: 100%;
          height: 30px;
          padding: 0 10px;
          border: 0;
          background: transparent;
          color: #cccccc;
          text-align: left;
          font-size: 11px;
          cursor: pointer;
        }

        .bp-menu-item:hover {
          background: #094771;
          color: #ffffff;
        }

        .bp-terminal-input {
          caret-color: #ffffff;
        }

        .bp-terminal-input::selection {
          background: #264f78;
        }
      `}</style>

      {/* =====================================
          RESIZE HANDLE
      ====================================== */}

      <div
        onMouseDown={handleDragStart}
        onDoubleClick={resetPanelSize}
        title="Drag to resize • Double-click to reset"
        style={{
          position: "absolute",
          top: "-3px",
          left: 0,
          right: 0,
          height: "6px",
          zIndex: 20,
          cursor: "ns-resize",
          background: isDragging ? "#007acc" : "transparent",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "2px",
            transform: "translateX(-50%)",
            width: "42px",
            height: "2px",
            borderRadius: "2px",
            background: isDragging ? "#ffffff" : "#4a4a4a",
            opacity: isDragging ? 1 : 0,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="bottom-panel-header" style={headerStyle}>
        <div style={tabsStyle}>
          {/* TERMINAL */}

          <button
            type="button"
            onClick={() => onPanelChange("terminal")}
            style={tabStyle(activePanel === "terminal")}
          >
            <TerminalIcon size={14} />
            <span>TERMINAL</span>
          </button>

          {/* PROBLEMS */}

          <button
            type="button"
            onClick={() => onPanelChange("problems")}
            style={tabStyle(activePanel === "problems")}
          >
            <AlertCircle size={14} />
            <span>PROBLEMS</span>

            {problemCount > 0 && (
              <span
                style={{
                  minWidth: "18px",
                  height: "18px",
                  padding: "0 5px",
                  borderRadius: "9px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: errors > 0 ? "#f14c4c" : "#cca700",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {problemCount}
              </span>
            )}
          </button>

          {/* OUTPUT */}

          <button
            type="button"
            onClick={() => onPanelChange("output")}
            style={tabStyle(activePanel === "output")}
          >
            <FileText size={14} />
            <span>OUTPUT</span>
          </button>
        </div>

        <div style={actionsStyle}>
          {isRunning && (
            <button
              type="button"
              onClick={onStopExecution}
              title="Stop Program"
              className="bp-icon-btn bp-stop-btn"
            >
              <Square size={12} />
              <span>STOP</span>
            </button>
          )}

          <button
            type="button"
            onClick={resetPanelSize}
            title="Reset Panel Size"
            className="bp-icon-btn"
          >
            <Maximize2 size={14} />
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Close Panel"
            aria-label="Close Panel"
            className="bp-icon-btn"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* =====================================
          CONTENT
      ====================================== */}

      <div className="bottom-panel-content" style={contentStyle}>
        {/* ===================================
            TERMINAL
        ==================================== */}

        {activePanel === "terminal" && (
          <div style={terminalStyle}>
            {/* TERMINAL TOOLBAR */}

            <div
              style={{
                ...terminalToolbarStyle,
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div
                ref={terminalMenuRef}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                  height: "100%",
                }}
              >
                <button
                  type="button"
                  onClick={() => setTerminalMenuOpen((value) => !value)}
                  title="Select terminal"
                  style={{
                    height: "26px",
                    minWidth: "150px",
                    maxWidth: "260px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    padding: "0 8px",
                    border: "1px solid transparent",
                    borderRadius: "3px",
                    background: terminalMenuOpen ? "#252526" : "transparent",
                    color: "#cccccc",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {terminalName}
                  </span>

                  <ChevronDown size={13} />
                </button>

                {terminalMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      zIndex: 200,
                      minWidth: "190px",
                      padding: "5px 0",
                      background: "#252526",
                      border: "1px solid #454545",
                      borderRadius: "3px",
                      boxShadow: "0 8px 24px rgba(0,0,0,.45)",
                    }}
                  >
                    <button
                      type="button"
                      className="bp-menu-item"
                      onClick={() => {
                        setTerminalName("CodeForge");

                        setTerminalMenuOpen(false);
                      }}
                    >
                      CodeForge
                    </button>

                    <button
                      type="button"
                      className="bp-menu-item"
                      onClick={createTerminalView}
                    >
                      Create Terminal View
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    marginRight: "6px",
                    color: isRunning ? "#4ec9b0" : "#808080",
                    fontSize: "11px",
                  }}
                >
                  {isRunning ? "● Running" : "● Ready"}
                </span>

                <button
                  type="button"
                  onClick={createTerminalView}
                  title="New Terminal"
                  aria-label="New Terminal"
                  className="bp-icon-btn"
                >
                  <Plus size={14} />
                </button>

                <button
                  type="button"
                  onClick={clearVisibleTerminal}
                  title="Clear Terminal"
                  aria-label="Clear Terminal"
                  className="bp-icon-btn"
                >
                  <Eraser size={14} />
                </button>
              </div>
            </div>

            {/* TERMINAL OUTPUT */}

            <div ref={terminalRef} style={terminalOutputStyle}>
              {terminalLines.length === 0 ? (
                <div
                  style={{
                    minHeight: "100%",
                    color: "#777777",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      color: "#4ec9b0",
                      marginBottom: "4px",
                    }}
                  >
                    CodeForge $
                  </div>

                  <div>
                    Terminal ready.
                    {isRunning
                      ? " Waiting for program input..."
                      : " Run a program to see output here."}
                  </div>
                </div>
              ) : (
                <>
                  {displayedTerminalLines.map((line, index) => (
                    <div
                      key={`terminal-line-${index}`}
                      style={{
                        minHeight: "20px",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                    >
                      {line || "\u00a0"}
                    </div>
                  ))}

                  {/* CURRENT INPUT */}

                  {isRunning && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minHeight: "20px",
                        fontFamily:
                          'Consolas, "Cascadia Code", "Courier New", monospace',
                        fontSize: "13px",
                        lineHeight: "1.55",
                      }}
                    >
                      <input
                        ref={inputRef}
                        className="bp-terminal-input"
                        type="text"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleInputKeyDown}
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        aria-label="Terminal input"
                        placeholder=""
                        style={{
                          flex: 1,
                          minWidth: 0,
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "#d4d4d4",
                          fontFamily:
                            'Consolas, "Cascadia Code", "Courier New", monospace',
                          fontSize: "13px",
                          lineHeight: "1.55",
                          padding: 0,
                          margin: 0,
                          caretColor: "#ffffff",
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================================
            PROBLEMS
        ==================================== */}

        {activePanel === "problems" && (
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              background: "#181818",
              padding: "8px 0",
            }}
          >
            {problems.length === 0 ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "#808080",
                  fontSize: "13px",
                }}
              >
                <AlertCircle size={17} />

                <span>No problems detected.</span>
              </div>
            ) : (
              problems.map((problem, index) => {
                const isError = problem.severity === "error";

                return (
                  <div
                    key={`problem-${problem.fileId || "file"}-${problem.line || 0}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      minHeight: "32px",
                      padding: "0 14px",
                      color: "#cccccc",
                      borderBottom: "1px solid #242424",
                      fontSize: "12px",
                    }}
                  >
                    <AlertCircle
                      size={14}
                      style={{
                        flexShrink: 0,
                        color: isError ? "#f14c4c" : "#cca700",
                      }}
                    />

                    <span
                      style={{
                        flex: 1,
                      }}
                    >
                      {problem.message}
                    </span>

                    <span
                      style={{
                        color: "#808080",
                        fontFamily: "Consolas, monospace",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {problem.fileName || "Unknown file"}:{problem.line || "?"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ===================================
            OUTPUT
        ==================================== */}

        {activePanel === "output" && (
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              background: "#181818",
              padding: "12px 14px",
            }}
          >
            {terminalLines.length === 0 ? (
              <div
                style={{
                  color: "#666666",
                  fontSize: "13px",
                }}
              >
                No output.
              </div>
            ) : (
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  color: "#d4d4d4",
                  fontFamily:
                    'Consolas, "Cascadia Code", "Courier New", monospace',
                  fontSize: "13px",
                  lineHeight: "1.55",
                }}
              >
                {displayedTerminalLines.join("\n")}
              </pre>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default BottomPanel;
