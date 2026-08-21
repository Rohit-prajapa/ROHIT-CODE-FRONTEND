import { useEffect } from "react";
import {
  X,
  Moon,
  Sun,
  Contrast,
  Map,
  WrapText,
  Minus,
  Plus,
  RotateCcw,
  Keyboard,
  Hash,
  Ruler,
  Save,
  Sparkles,
} from "lucide-react";

function SettingsPanel({
  theme = "dark",
  fontSize = 15,
  minimap = true,
  wordWrap = false,
  tabSize = 4,
  lineNumbers = true,
  autoSave = false,
  geminiAI = true,

  onThemeChange = () => {},
  onFontSizeChange = () => {},
  onMinimapChange = () => {},
  onWordWrapChange = () => {},
  onTabSizeChange = () => {},
  onLineNumbersChange = () => {},
  onAutoSaveChange = () => {},
  onGeminiAIChange = () => {},

  onClose = () => {},
  onReset = () => {},
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="settings-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <style>{`
        /* =====================================================
           SETTINGS OVERLAY
        ====================================================== */

        .settings-overlay {
          position: fixed;
          inset: 0;
          z-index: 30000;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 20px;
          box-sizing: border-box;

          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(3px);

          font-family:
            "Segoe UI",
            Inter,
            Arial,
            sans-serif;
        }

        /* =====================================================
           SETTINGS PANEL
        ====================================================== */

        .settings-panel {
          position: relative;

          width: min(820px, calc(100vw - 40px));
          height: min(760px, calc(100vh - 40px));

          min-width: 0;
          min-height: 0;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          background: #1e1e1e;

          border: 1px solid #3b3b3b;
          border-radius: 10px;

          color: #cccccc;

          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.70),
            0 10px 30px rgba(0, 0, 0, 0.40);
        }

        /* =====================================================
           HEADER
        ====================================================== */

        .settings-header {
          min-height: 64px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 20px;

          background: #252526;

          border-bottom: 1px solid #303030;

          flex-shrink: 0;
        }

        .settings-header h2 {
          margin: 0;

          color: #ffffff;

          font-size: 18px;
          font-weight: 600;
          line-height: 1.2;
        }

        .settings-header span {
          display: block;

          margin-top: 5px;

          color: #858585;

          font-size: 12px;
        }

        .settings-close {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: 0;
          border-radius: 5px;

          background: transparent;
          color: #858585;

          cursor: pointer;

          transition:
            background 0.15s ease,
            color 0.15s ease;
        }

        .settings-close:hover {
          background: #3a3a3a;
          color: #ffffff;
        }

        /* =====================================================
           CONTENT
        ====================================================== */

        .settings-content {
          flex: 1;

          min-height: 0;

          overflow-y: auto;

          padding: 8px 20px 18px;

          background: #1e1e1e;
        }

        .settings-content::-webkit-scrollbar {
          width: 9px;
        }

        .settings-content::-webkit-scrollbar-track {
          background: #1e1e1e;
        }

        .settings-content::-webkit-scrollbar-thumb {
          background: #424242;
          border-radius: 5px;
        }

        .settings-content::-webkit-scrollbar-thumb:hover {
          background: #505050;
        }

        /* =====================================================
           SECTION
        ====================================================== */

        .settings-section {
          padding: 16px 0;

          border-bottom: 1px solid #2d2d2d;
        }

        .settings-section:first-child {
          padding-top: 14px;
        }

        .settings-section:last-child {
          border-bottom: 0;
        }

        .settings-section-title {
          margin-bottom: 13px;

          color: #cccccc;

          font-size: 13px;
          font-weight: 600;

          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        /* =====================================================
           THEME
        ====================================================== */

        .theme-options {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 10px;
        }

        .theme-option {
          min-height: 70px;

          display: flex;
          align-items: center;

          gap: 11px;

          padding: 12px;

          border: 1px solid #3a3a3a;
          border-radius: 7px;

          background: #252526;
          color: #b8b8b8;

          text-align: left;

          cursor: pointer;

          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            transform 0.1s ease;
        }

        .theme-option:hover {
          background: #2d2d2d;
          border-color: #505050;
        }

        .theme-option:active {
          transform: scale(0.99);
        }

        .theme-option.selected {
          border-color: #007acc;

          background:
            linear-gradient(
              135deg,
              #094771,
              #073b5e
            );

          color: #ffffff;

          box-shadow:
            0 0 0 1px rgba(0, 122, 204, 0.15);
        }

        .theme-option > svg {
          flex-shrink: 0;
        }

        .theme-option div {
          min-width: 0;
        }

        .theme-option strong {
          display: block;

          color: inherit;

          font-size: 13px;
          font-weight: 600;
        }

        .theme-option span {
          display: block;

          margin-top: 4px;

          color: #858585;

          font-size: 11px;

          line-height: 1.35;
        }

        .theme-option.selected span {
          color: #b8d7ea;
        }

        /* =====================================================
           ROW
        ====================================================== */

        .settings-row {
          min-height: 46px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .settings-label {
          min-width: 0;
        }

        .settings-label strong {
          display: block;

          color: #cccccc;

          font-size: 13px;
          font-weight: 500;
        }

        .settings-label > span {
          display: block;

          margin-top: 4px;

          color: #858585;

          font-size: 11px;
        }

        .settings-label-with-icon {
          display: flex;
          align-items: center;

          gap: 7px;

          color: #cccccc;
        }

        .settings-label-with-icon svg {
          color: #9cdcfe;

          flex-shrink: 0;
        }

        /* =====================================================
           FONT SIZE
        ====================================================== */

        .font-size-control {
          height: 34px;

          display: flex;
          align-items: center;

          overflow: hidden;

          border: 1px solid #3a3a3a;
          border-radius: 5px;

          background: #252526;

          flex-shrink: 0;
        }

        .font-size-control button {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: 0;

          background: transparent;
          color: #b8b8b8;

          cursor: pointer;
        }

        .font-size-control button:hover {
          background: #3a3a3a;
          color: #ffffff;
        }

        .font-size-control span {
          min-width: 54px;

          text-align: center;

          color: #cccccc;

          font-family:
            "Cascadia Code",
            Consolas,
            monospace;

          font-size: 12px;
        }

        /* =====================================================
           TAB SIZE
        ====================================================== */

        .tab-size-options {
          display: flex;
          gap: 6px;

          flex-shrink: 0;
        }

        .tab-size-button {
          min-width: 44px;
          height: 34px;

          padding: 0 10px;

          border: 1px solid #3a3a3a;
          border-radius: 5px;

          background: #252526;
          color: #b8b8b8;

          cursor: pointer;

          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .tab-size-button:hover {
          background: #333333;
          color: #ffffff;
        }

        .tab-size-button.selected {
          background: #094771;

          border-color: #007acc;

          color: #ffffff;
        }

        /* =====================================================
           TOGGLE
        ====================================================== */

        .settings-toggle {
          position: relative;

          width: 44px;
          height: 24px;

          flex-shrink: 0;

          padding: 0;

          border: 1px solid #555555;

          border-radius: 20px;

          background: #333333;

          cursor: pointer;

          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .settings-toggle span {
          position: absolute;

          top: 3px;
          left: 3px;

          width: 16px;
          height: 16px;

          border-radius: 50%;

          background: #cccccc;

          transition:
            transform 0.15s ease,
            background 0.15s ease;
        }

        .settings-toggle.enabled {
          border-color: #007acc;

          background: #007acc;
        }

        .settings-toggle.enabled span {
          transform: translateX(20px);

          background: #ffffff;
        }

        /* =====================================================
           SHORTCUTS
        ====================================================== */

        .shortcut-list {
          overflow: hidden;

          border: 1px solid #303030;

          border-radius: 7px;

          background: #1b1b1b;
        }

        .shortcut-row {
          min-height: 40px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 13px;

          border-bottom: 1px solid #2d2d2d;

          color: #b8b8b8;

          font-size: 12px;
        }

        .shortcut-row:last-child {
          border-bottom: 0;
        }

        .shortcut-row:hover {
          background: #252526;
        }

        .shortcut-row kbd {
          padding: 4px 8px;

          border: 1px solid #454545;

          border-radius: 4px;

          background: #2a2a2a;

          color: #cccccc;

          font-family:
            "Cascadia Code",
            Consolas,
            monospace;

          font-size: 10px;
        }

        /* =====================================================
           FOOTER
        ====================================================== */

        .settings-footer {
          min-height: 58px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 20px;

          border-top: 1px solid #303030;

          background: #252526;

          flex-shrink: 0;
        }

        .settings-reset,
        .settings-done {
          height: 34px;

          display: inline-flex;
          align-items: center;

          gap: 7px;

          padding: 0 13px;

          border-radius: 5px;

          font-size: 12px;

          cursor: pointer;

          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .settings-reset {
          border: 1px solid #3a3a3a;

          background: transparent;

          color: #b8b8b8;
        }

        .settings-reset:hover {
          background: #333333;

          color: #ffffff;
        }

        .settings-done {
          border: 1px solid #007acc;

          background: #007acc;

          color: #ffffff;
        }

        .settings-done:hover {
          background: #0e639c;
        }

        /* =====================================================
           RESPONSIVE
        ====================================================== */

        @media (max-width: 800px) {
          .settings-panel {
            width: min(
              700px,
              calc(100vw - 28px)
            );

            height: min(
              760px,
              calc(100vh - 28px)
            );
          }

          .theme-options {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .settings-overlay {
            padding: 10px;
          }

          .settings-panel {
            width: 100%;
            height: calc(100vh - 20px);

            border-radius: 7px;
          }

          .theme-options {
            grid-template-columns: 1fr;
          }

          .settings-content {
            padding: 8px 14px 14px;
          }

          .settings-header {
            padding: 0 14px;
          }

          .settings-footer {
            padding: 0 14px;
          }

          .settings-row {
            gap: 10px;
          }
        }
      `}</style>

      {/* =====================================================
          IMPORTANT:
          Everything is now INSIDE settings-panel.
          This fixes the modal layout issue.
      ====================================================== */}

      <div className="settings-panel">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="settings-header">
          <div>
            <h2 id="settings-panel-title">Settings</h2>

            <span>ROHIT-CODE editor preferences</span>
          </div>

          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            title="Close Settings"
            aria-label="Close Settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <div className="settings-content">
          {/* =================================================
              THEME
          ================================================== */}

          <section className="settings-section">
            <div className="settings-section-title">Theme</div>

            <div className="theme-options">
              <button
                type="button"
                className={`theme-option ${theme === "dark" ? "selected" : ""}`}
                onClick={() => onThemeChange("dark")}
              >
                <Moon size={18} />

                <div>
                  <strong>Dark</strong>

                  <span>VS Code dark theme</span>
                </div>
              </button>

              <button
                type="button"
                className={`theme-option ${
                  theme === "light" ? "selected" : ""
                }`}
                onClick={() => onThemeChange("light")}
              >
                <Sun size={18} />

                <div>
                  <strong>Light</strong>

                  <span>Light editor theme</span>
                </div>
              </button>

              <button
                type="button"
                className={`theme-option ${
                  theme === "midnight" ? "selected" : ""
                }`}
                onClick={() => onThemeChange("midnight")}
              >
                <Moon size={18} />

                <div>
                  <strong>Midnight Blue</strong>

                  <span>Deep blue coding theme</span>
                </div>
              </button>

              <button
                type="button"
                className={`theme-option ${
                  theme === "dracula" ? "selected" : ""
                }`}
                onClick={() => onThemeChange("dracula")}
              >
                <Sparkles size={18} />

                <div>
                  <strong>Dracula</strong>

                  <span>Classic purple coding theme</span>
                </div>
              </button>

              <button
                type="button"
                className={`theme-option ${
                  theme === "monokai" ? "selected" : ""
                }`}
                onClick={() => onThemeChange("monokai")}
              >
                <Sparkles size={18} />

                <div>
                  <strong>Monokai</strong>

                  <span>Classic green coding theme</span>
                </div>
              </button>

              <button
                type="button"
                className={`theme-option ${
                  theme === "high-contrast" ? "selected" : ""
                }`}
                onClick={() => onThemeChange("high-contrast")}
              >
                <Contrast size={18} />

                <div>
                  <strong>High Contrast</strong>

                  <span>Maximum readability</span>
                </div>
              </button>
            </div>
          </section>

          {/* =================================================
              FONT SIZE
          ================================================== */}

          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-label">
                <strong>Font Size</strong>

                <span>Editor text size</span>
              </div>

              <div className="font-size-control">
                <button
                  type="button"
                  onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}
                  title="Decrease font size"
                >
                  <Minus size={15} />
                </button>

                <span>{fontSize}px</span>

                <button
                  type="button"
                  onClick={() => onFontSizeChange(Math.min(32, fontSize + 1))}
                  title="Increase font size"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </section>

          {/* =================================================
              TAB SIZE
          ================================================== */}

          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-label">
                <div className="settings-label-with-icon">
                  <Ruler size={16} />

                  <strong>Tab Size</strong>
                </div>

                <span>Number of spaces inserted by Tab</span>
              </div>

              <div className="tab-size-options">
                {[2, 4, 8].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`tab-size-button ${
                      tabSize === size ? "selected" : ""
                    }`}
                    onClick={() => onTabSizeChange(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================
              MINIMAP
          ================================================== */}

          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-label">
                <div className="settings-label-with-icon">
                  <Map size={16} />

                  <strong>Minimap</strong>
                </div>

                <span>Show code minimap</span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${minimap ? "enabled" : ""}`}
                onClick={() => onMinimapChange(!minimap)}
                aria-label="Toggle minimap"
              >
                <span />
              </button>
            </div>
          </section>

          {/* =================================================
              WORD WRAP
          ================================================== */}

          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-label">
                <div className="settings-label-with-icon">
                  <WrapText size={16} />

                  <strong>Word Wrap</strong>
                </div>

                <span>Wrap long lines</span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${wordWrap ? "enabled" : ""}`}
                onClick={() => onWordWrapChange(!wordWrap)}
                aria-label="Toggle word wrap"
              >
                <span />
              </button>
            </div>
          </section>

          {/* =================================================
              LINE NUMBERS
          ================================================== */}

          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-label">
                <div className="settings-label-with-icon">
                  <Hash size={16} />

                  <strong>Line Numbers</strong>
                </div>

                <span>Show line numbers in editor</span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${lineNumbers ? "enabled" : ""}`}
                onClick={() => onLineNumbersChange(!lineNumbers)}
                aria-label="Toggle line numbers"
              >
                <span />
              </button>
            </div>
          </section>

          {/* =================================================
              AUTO SAVE
          ================================================== */}

          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-label">
                <div className="settings-label-with-icon">
                  <Save size={16} />

                  <strong>Auto Save</strong>
                </div>

                <span>Automatically save editor changes</span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${autoSave ? "enabled" : ""}`}
                onClick={() => onAutoSaveChange(!autoSave)}
                aria-label="Toggle auto save"
              >
                <span />
              </button>
            </div>
          </section>

          {/* =================================================
              GEMINI AI
          ================================================== */}

          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-label">
                <div className="settings-label-with-icon">
                  <Sparkles size={16} />

                  <strong>Gemini AI</strong>
                </div>

                <span>Enable Gemini AI coding assistance</span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${geminiAI ? "enabled" : ""}`}
                onClick={() => onGeminiAIChange(!geminiAI)}
                aria-label="Toggle Gemini AI"
              >
                <span />
              </button>
            </div>
          </section>

          {/* =================================================
              KEYBOARD SHORTCUTS
          ================================================== */}

          <section className="settings-section">
            <div className="settings-section-title">
              <div className="settings-label-with-icon">
                <Keyboard size={16} />

                <span>Keyboard Shortcuts</span>
              </div>
            </div>

            <div className="shortcut-list">
              <div className="shortcut-row">
                <span>Run Code</span>

                <kbd>Ctrl + Enter</kbd>
              </div>

              <div className="shortcut-row">
                <span>Save Project</span>

                <kbd>Ctrl + S</kbd>
              </div>

              <div className="shortcut-row">
                <span>Quick Open</span>

                <kbd>Ctrl + P</kbd>
              </div>

              <div className="shortcut-row">
                <span>Search Files</span>

                <kbd>Ctrl + Shift + F</kbd>
              </div>

              <div className="shortcut-row">
                <span>Command Palette</span>

                <kbd>Ctrl + Shift + P</kbd>
              </div>

              <div className="shortcut-row">
                <span>Settings</span>

                <kbd>Ctrl + ,</kbd>
              </div>

              <div className="shortcut-row">
                <span>Close Tab</span>

                <kbd>Ctrl + W</kbd>
              </div>

              <div className="shortcut-row">
                <span>Toggle Terminal</span>

                <kbd>Ctrl + `</kbd>
              </div>

              <div className="shortcut-row">
                <span>Problems</span>

                <kbd>Ctrl + Shift + M</kbd>
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="settings-footer">
          <button type="button" className="settings-reset" onClick={onReset}>
            <RotateCcw size={14} />
            Reset Settings
          </button>

          <button type="button" className="settings-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
