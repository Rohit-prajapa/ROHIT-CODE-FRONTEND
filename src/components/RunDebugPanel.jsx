import {
  Play,
  Bug,
  Square,
  RefreshCw,
  Settings2,
  Terminal,
} from "lucide-react";

import { useState } from "react";

function RunDebugPanel({
  onRun,
  onDebug,
  onStop,
  isRunning = false,
  file,
}) {
  const [configuration, setConfiguration] =
    useState("Current File");

  const handleRun = () => {
    if (typeof onRun === "function") {
      onRun();
    }
  };

  const handleDebug = () => {
    // Falls back to onRun if a dedicated debug handler
    // hasn't been wired up yet by the parent.
    if (typeof onDebug === "function") {
      onDebug();
    } else if (typeof onRun === "function") {
      onRun();
    }
  };

  const handleStop = () => {
    if (typeof onStop === "function") {
      onStop();
    }
  };

  return (
    <section className="rohit-run-panel">
      <style>{`
        .rohit-run-panel {
          flex: 1;
          min-width: 0;
          min-height: 0;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          background: #181818;
          color: #cccccc;

          font-family:
            "Gill Sans",
            "Gill Sans MT",
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .rohit-run-header {
          height: 46px;
          min-height: 46px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 10px 0 16px;

          border-bottom: 1px solid #292929;
        }

        .rohit-run-title {
          color: #d7d7d7;

          font-size: 12px;
          font-weight: 600;

          letter-spacing: .6px;
        }

        .rohit-run-icon {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 5px;

          background: transparent;

          color: #858585;

          cursor: pointer;
        }

        .rohit-run-icon:hover {
          background: #2a2d2e;
          color: #ffffff;
        }

        .rohit-run-config {
          padding: 14px;

          border-bottom: 1px solid #292929;
        }

        .rohit-run-label {
          display: block;

          margin-bottom: 7px;

          color: #858585;

          font-size: 11px;
          font-weight: 600;

          letter-spacing: .3px;

          text-transform: uppercase;
        }

        .rohit-run-select {
          width: 100%;
          height: 34px;

          padding: 0 9px;

          border: 1px solid #3b3b3b;
          border-radius: 5px;

          outline: none;

          background: #252526;
          color: #cccccc;

          font-family:
            "Gill Sans",
            "Gill Sans MT",
            "Segoe UI",
            sans-serif;

          font-size: 13px;

          cursor: pointer;
        }

        .rohit-run-select:hover {
          border-color: #555555;
        }

        .rohit-run-select:focus {
          border-color: #007acc;
        }

        .rohit-run-actions {
          display: grid;

          grid-template-columns:
            1fr 1fr 1fr;

          gap: 7px;

          padding: 14px;

          border-bottom: 1px solid #292929;
        }

        .rohit-run-button {
          height: 36px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 6px;

          border: 1px solid #3b3b3b;
          border-radius: 5px;

          background: #252526;
          color: #cccccc;

          font-family:
            "Gill Sans",
            "Gill Sans MT",
            "Segoe UI",
            sans-serif;

          font-size: 13px;

          cursor: pointer;

          transition:
            background .12s ease,
            border-color .12s ease,
            color .12s ease;
        }

        .rohit-run-button:hover:not(:disabled) {
          background: #2a2d2e;
          border-color: #5a5a5a;
          color: #ffffff;
        }

        .rohit-run-button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .rohit-run-button.primary {
          border-color: #007acc;
          background: #0e639c;
          color: #ffffff;
        }

        .rohit-run-button.primary:hover:not(:disabled) {
          background: #1177bb;
        }

        .rohit-run-button.stop {
          border-color: #633333;
          color: #f48771;
        }

        .rohit-run-button.stop:hover:not(:disabled) {
          background: #3a2222;
          border-color: #8b4444;
        }

        .rohit-run-current {
          padding: 16px;

          border-bottom: 1px solid #292929;
        }

        .rohit-run-current-title {
          margin-bottom: 8px;

          color: #858585;

          font-size: 11px;
          font-weight: 600;

          letter-spacing: .3px;

          text-transform: uppercase;
        }

        .rohit-run-file {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 11px;

          border: 1px solid #333333;
          border-radius: 5px;

          background: #202020;

          color: #cccccc;

          font-family:
            "Gill Sans",
            "Gill Sans MT",
            "Segoe UI",
            sans-serif;

          font-size: 13px;
        }

        .rohit-run-file svg {
          flex-shrink: 0;
          color: #858585;
        }

        .rohit-run-file-name {
          min-width: 0;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .rohit-run-status {
          margin-top: 14px;

          display: flex;
          align-items: center;

          gap: 8px;

          color: ${isRunning
            ? "#4ec9b0"
            : "#858585"};

          font-family:
            "Gill Sans",
            "Gill Sans MT",
            "Segoe UI",
            sans-serif;

          font-size: 12px;
        }

        .rohit-run-status.running {
          color: #4ec9b0;
        }

        .rohit-run-status.success {
          color: #4ec9b0;
        }

        .rohit-run-status.error {
          color: #f48771;
        }

        .rohit-run-footer {
          margin-top: auto;

          padding: 14px 16px;

          color: #666666;

          font-family:
            "Gill Sans",
            "Gill Sans MT",
            "Segoe UI",
            sans-serif;

          font-size: 11px;

          line-height: 1.6;
        }

        .rohit-run-spin {
          animation:
            rohit-run-spin .7s linear infinite;
        }

        @keyframes rohit-run-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .rohit-run-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="rohit-run-header">
        <span className="rohit-run-title">
          RUN AND DEBUG
        </span>

        <button
          type="button"
          className="rohit-run-icon"
          title="Debug configurations"
        >
          <Settings2 size={16} />
        </button>
      </div>

      {/* CONFIGURATION */}

      <div className="rohit-run-config">
        <label className="rohit-run-label">
          Configuration
        </label>

        <select
          className="rohit-run-select"
          value={configuration}
          onChange={(event) =>
            setConfiguration(
              event.target.value,
            )
          }
        >
          <option>
            Current File
          </option>

          <option>
            Run Without Debugging
          </option>

          <option>
            Debug Current File
          </option>
        </select>
      </div>

      {/* ACTIONS */}

      <div className="rohit-run-actions">
        <button
          type="button"
          className="rohit-run-button primary"
          onClick={handleRun}
          disabled={isRunning}
        >
          <Play size={15} />
          Run
        </button>

        <button
          type="button"
          className="rohit-run-button"
          onClick={handleDebug}
          disabled={isRunning}
        >
          <Bug size={15} />
          Debug
        </button>

        <button
          type="button"
          className="rohit-run-button stop"
          onClick={handleStop}
          disabled={!isRunning}
        >
          <Square size={14} />
          Stop
        </button>
      </div>

      {/* CURRENT FILE */}

      <div className="rohit-run-current">
        <div className="rohit-run-current-title">
          Current File
        </div>

        <div className="rohit-run-file">
          <Terminal size={16} />

          <span className="rohit-run-file-name">
            {file?.name ||
              "No file selected"}
          </span>
        </div>

        <div
          className={`rohit-run-status ${
            isRunning
              ? "running"
              : ""
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw
                size={13}
                className="rohit-run-spin"
              />

              Running...
            </>
          ) : (
            <>
              <Play size={13} />

              Ready to run
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}

      <div className="rohit-run-footer">
        Run uses your existing
        ROHIT-CODE execution system.
        <br />
        Debugger integration can be
        added later.
      </div>
    </section>
  );
}

export default RunDebugPanel;