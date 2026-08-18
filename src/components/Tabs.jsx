import { X, Plus } from "lucide-react";

function getFileMeta(file) {
  const name = file?.name?.toLowerCase() || "";

  if (name.endsWith(".java"))
    return { icon: "☕", color: "#f89820" };

  if (name.endsWith(".py"))
    return { icon: "🐍", color: "#4ec9b0" };

  if (
    name.endsWith(".cpp") ||
    name.endsWith(".cc") ||
    name.endsWith(".hpp")
  )
    return { icon: "C++", color: "#519aba" };

  if (name.endsWith(".c"))
    return { icon: "C", color: "#519aba" };

  if (
    name.endsWith(".js") ||
    name.endsWith(".jsx")
  )
    return { icon: "JS", color: "#f7df1e" };

  if (
    name.endsWith(".ts") ||
    name.endsWith(".tsx")
  )
    return { icon: "TS", color: "#3178c6" };

  if (name.endsWith(".html"))
    return { icon: "<>", color: "#e44d26" };

  if (name.endsWith(".css"))
    return { icon: "#", color: "#42a5f5" };

  if (name.endsWith(".json"))
    return { icon: "{}", color: "#d4b83d" };

  if (name.endsWith(".go"))
    return { icon: "GO", color: "#00add8" };

  if (name.endsWith(".rs"))
    return { icon: "RS", color: "#dea584" };

  if (name.endsWith(".php"))
    return { icon: "PHP", color: "#777bb4" };

  return {
    icon: "•",
    color: "#9cdcfe",
  };
}

function Tabs({
  files = [],
  activeFile,
  onTabSelect,
  onTabClose,
  onNewTab,
}) {
  return (
    <div
      className="rohit-tabs"
      role="tablist"
      aria-label="Open files"
    >
      <style>{`
        .rohit-tabs {
          height: 42px;
          min-height: 42px;
          width: 100%;
          display: flex;
          align-items: stretch;
          overflow-x: auto;
          overflow-y: hidden;
          background: var(--tabs-bg, #181818);
          border-bottom: 1px solid var(--tabs-border, #2d2d2d);
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Ubuntu,
            "Helvetica Neue",
            Arial,
            sans-serif;
          scrollbar-width: thin;
          scrollbar-color: #3a3a3a transparent;
        }

        .rohit-tabs[data-theme="light"] {
          --tabs-bg: #f3f3f3;
          --tabs-border: #d8d8d8;
          --tab-bg: #f3f3f3;
          --tab-hover: #e8e8e8;
          --tab-active: #ffffff;
          --tab-text: #555555;
          --tab-active-text: #222222;
          --tab-divider: #d8d8d8;
          --tab-button-hover: #dddddd;
        }

        .rohit-tabs[data-theme="high-contrast"] {
          --tabs-bg: #000000;
          --tabs-border: #6fc3df;
          --tab-bg: #000000;
          --tab-hover: #111111;
          --tab-active: #000000;
          --tab-text: #ffffff;
          --tab-active-text: #ffffff;
          --tab-divider: #6fc3df;
          --tab-button-hover: #1f1f1f;
        }

        .rohit-tab {
          position: relative;
          min-width: 128px;
          max-width: 230px;
          height: 42px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 8px 0 12px;
          flex-shrink: 0;
          border: 0;
          border-right: 1px solid var(--tab-divider, #2d2d2d);
          background: var(--tab-bg, #181818);
          color: var(--tab-text, #9d9d9d);
          cursor: pointer;
          user-select: none;
          font-family: inherit;
          transition:
            background 0.12s ease,
            color 0.12s ease;
        }

        .rohit-tab:hover {
          background: var(--tab-hover, #202020);
          color: var(--tab-active-text, #d7d7d7);
        }

        .rohit-tab.active {
          background: var(--tab-active, #1f1f1f);
          color: var(--tab-active-text, #ffffff);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .rohit-tab.active::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #007acc;
        }

        .rohit-tab:focus-visible {
          outline: 1px solid #75beea;
          outline-offset: -2px;
          z-index: 2;
        }

        .rohit-tab-icon {
          width: 21px;
          min-width: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family:
            "Cascadia Code",
            "Fira Code",
            Consolas,
            monospace;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          user-select: none;
        }

        .rohit-tab-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          font-family: inherit;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.2;
        }

        .rohit-tab.active .rohit-tab-name {
          color: var(--tab-active-text, #ffffff);
        }

        .rohit-tab-dirty {
          width: 16px;
          min-width: 16px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4d4d4;
          font-size: 9px;
        }

        .rohit-tab:hover .rohit-tab-dirty {
          display: none;
        }

        .rohit-tab-close {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 0;
          border-radius: 4px;
          background: transparent;
          color: #858585;
          cursor: pointer;
          opacity: 0;
          transition:
            background 0.12s ease,
            color 0.12s ease,
            opacity 0.12s ease;
        }

        .rohit-tab:hover .rohit-tab-close,
        .rohit-tab.active .rohit-tab-close,
        .rohit-tab-close:focus-visible {
          opacity: 1;
        }

        .rohit-tab-close:hover {
          background: var(--tab-button-hover, #333333);
          color: #ffffff;
        }

        .rohit-tab-close:focus-visible {
          outline: 1px solid #75beea;
        }

        .rohit-tabs-new {
          width: 42px;
          min-width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 0;
          background: var(--tabs-bg, #181818);
          color: #858585;
          cursor: pointer;
          transition:
            background 0.12s ease,
            color 0.12s ease;
        }

        .rohit-tabs-new:hover {
          background: var(--tab-hover, #252525);
          color: #ffffff;
        }

        .rohit-tabs-new:focus-visible {
          outline: 1px solid #75beea;
          outline-offset: -2px;
        }

        .rohit-tabs::-webkit-scrollbar {
          height: 5px;
        }

        .rohit-tabs::-webkit-scrollbar-track {
          background: transparent;
        }

        .rohit-tabs::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 10px;
        }

        .rohit-tabs::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }

        @media (max-width: 900px) {
          .rohit-tab {
            min-width: 118px;
            max-width: 200px;
          }
        }

        @media (max-width: 600px) {
          .rohit-tab {
            min-width: 105px;
            max-width: 170px;
            padding-left: 9px;
            gap: 6px;
          }

          .rohit-tab-name {
            font-size: 12px;
          }

          .rohit-tab-icon {
            width: 18px;
            min-width: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rohit-tab,
          .rohit-tab-close,
          .rohit-tabs-new {
            transition: none;
          }
        }
      `}</style>

      {files.map((file) => {
        const active =
          String(activeFile) ===
          String(file.id);

        const meta = getFileMeta(file);

        return (
          <div
            key={file.id}
            className={`rohit-tab ${
              active ? "active" : ""
            }`}
            role="tab"
            tabIndex={0}
            aria-selected={active}
            onClick={() =>
              onTabSelect?.(file.id)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();

                onTabSelect?.(
                  file.id
                );
              }
            }}
            title={file.name}
          >
            {/* FILE ICON */}

            <span
              className="rohit-tab-icon"
              style={{
                color: meta.color,
              }}
            >
              {meta.icon}
            </span>

            {/* FILE NAME */}

            <span className="rohit-tab-name">
              {file.name}
            </span>

            {/* UNSAVED */}

            {file.isDirty && (
              <span
                className="rohit-tab-dirty"
                title="Unsaved changes"
              >
                ●
              </span>
            )}

            {/* CLOSE */}

            <button
              type="button"
              className="rohit-tab-close"
              title={`Close ${file.name}`}
              aria-label={`Close ${file.name}`}
              onClick={(event) => {
                event.stopPropagation();

                onTabClose?.(
                  file.id
                );
              }}
            >
              <X
                size={15}
                strokeWidth={2}
              />
            </button>
          </div>
        );
      })}

      {/* NEW FILE */}

      <button
        type="button"
        className="rohit-tabs-new"
        title="New File"
        aria-label="New File"
        onClick={onNewTab}
      >
        <Plus
          size={18}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

export default Tabs;