import {
  GitBranch,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Terminal as TerminalIcon,
  FileText,
} from "lucide-react";

function StatusBar({
  file,
  cursorPosition,
  status = "Ready",
  executionTime = null,
  errors = 0,
  warnings = 0,
  onTerminalClick,
  onProblemsClick,
  onOutputClick,
}) {
  const languageNames = {
    cpp: "C++",
    c: "C",
    python: "Python",
    java: "Java",
    javascript: "JavaScript",
    nodejs: "Node.js",
    go: "Go",
    rust: "Rust",
    php: "PHP",
    typescript: "TypeScript",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    sql: "SQL",
    plaintext: "Plain Text",
    shell: "Shell",
    ruby: "Ruby",
    kotlin: "Kotlin",
    xml: "XML",
  };

  const language =
    languageNames[file?.language] || "Plain Text";

  const normalizedStatus = String(status).toLowerCase();

  const getStatusIcon = () => {
    if (normalizedStatus === "running") {
      return <Loader2 size={14} className="rohit-status-spinner" />;
    }

    if (normalizedStatus === "success") {
      return <CheckCircle2 size={14} />;
    }

    if (normalizedStatus === "error") {
      return <AlertCircle size={14} />;
    }

    return <CheckCircle2 size={14} />;
  };

  return (
    <footer className="rohit-status-bar">
      <style>{`
        .rohit-status-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          height: 30px;
          min-height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
          box-sizing: border-box;
          background: #181818;
          border-top: 1px solid #2b2b2b;
          color: #b8b8b8;
          font-family: "Segoe UI", Inter, Arial, sans-serif;
          font-size: 13px;
          user-select: none;
          overflow: hidden;
        }

        .rohit-status-left,
        .rohit-status-right {
          height: 100%;
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .rohit-status-item,
        .rohit-status-button {
          height: 100%;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 9px;
          border: 0;
          background: transparent;
          color: #b8b8b8;
          font: inherit;
          white-space: nowrap;
        }

        .rohit-status-button {
          cursor: pointer;
        }

        .rohit-status-item:hover,
        .rohit-status-button:hover {
          background: #252526;
          color: #ffffff;
        }

        .rohit-status-branch {
          color: #cccccc;
        }

        .rohit-status-running {
          color: #4ec9b0;
        }

        .rohit-status-success {
          color: #89d185;
        }

        .rohit-status-error {
          color: #f48771;
        }

        .rohit-status-problems {
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .rohit-status-error-count,
        .rohit-status-warning-count {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .rohit-status-error-count {
          color: #f48771;
        }

        .rohit-status-warning-count {
          color: #cca700;
        }

        .rohit-status-time {
          margin-left: 2px;
          color: #858585;
          font-family: "Cascadia Code", Consolas, monospace;
          font-size: 11px;
        }

        .rohit-status-divider {
          width: 1px;
          height: 16px;
          margin: 0 2px;
          background: #303030;
        }

        .rohit-status-language {
          color: #cccccc;
          font-weight: 500;
        }

        .rohit-status-spinner {
          animation: rohit-status-spin .8s linear infinite;
        }

        @keyframes rohit-status-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .rohit-status-bar {
            font-size: 12px;
          }

          .rohit-status-item,
          .rohit-status-button {
            padding: 0 6px;
          }

          .rohit-status-right .rohit-status-item:nth-child(2) {
            display: none;
          }
        }
      `}</style>

      <div className="rohit-status-left">
        <div
          className="rohit-status-item rohit-status-branch"
          title="Git branch"
        >
          <GitBranch size={14} />
          <span>main</span>
        </div>

        <div
          className={`rohit-status-item ${
            normalizedStatus === "running"
              ? "rohit-status-running"
              : normalizedStatus === "success"
              ? "rohit-status-success"
              : normalizedStatus === "error"
              ? "rohit-status-error"
              : ""
          }`}
          title="Execution status"
        >
          {getStatusIcon()}
          <span>{status}</span>

          {executionTime !== null &&
            normalizedStatus !== "running" && (
              <span className="rohit-status-time">
                {executionTime}s
              </span>
            )}
        </div>

        <button
          type="button"
          className="rohit-status-button"
          onClick={onProblemsClick}
          title="Problems"
        >
          <span className="rohit-status-problems">
            <span className="rohit-status-error-count">
              <AlertCircle size={14} />
              {errors}
            </span>

            <span className="rohit-status-warning-count">
              <AlertTriangle size={14} />
              {warnings}
            </span>
          </span>
        </button>

        <button
          type="button"
          className="rohit-status-button"
          onClick={onTerminalClick}
          title="Open Terminal"
        >
          <TerminalIcon size={14} />
          <span>Terminal</span>
        </button>

        <button
          type="button"
          className="rohit-status-button"
          onClick={onOutputClick}
          title="Open Output"
        >
          <FileText size={14} />
          <span>Output</span>
        </button>
      </div>

      <div className="rohit-status-right">
        <div className="rohit-status-item">
          Ln {cursorPosition?.line || 1}, Col{" "}
          {cursorPosition?.column || 1}
        </div>

        <span className="rohit-status-divider" />

        <div className="rohit-status-item">
          Spaces: 4
        </div>

        <div className="rohit-status-item">
          UTF-8
        </div>

        <div className="rohit-status-item">
          LF
        </div>

        <div className="rohit-status-item rohit-status-language">
          {language}
        </div>
      </div>
    </footer>
  );
}

export default StatusBar;