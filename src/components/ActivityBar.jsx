import {
  Files,
  Search,
  GitBranch,
  PlaySquare,
  Blocks,
  Settings,
  UserRound,
} from "lucide-react";

function ActivityBar({
  activePanel = "explorer",
  onPanelChange,
  onSettings,
  onAccounts,
}) {
  const items = [
    {
      id: "explorer",
      label: "Explorer",
      icon: Files,
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
    },
    {
      id: "source-control",
      label: "Source Control",
      icon: GitBranch,
    },
    {
      id: "run",
      label: "Run and Debug",
      icon: PlaySquare,
    },
    {
      id: "extensions",
      label: "Extensions",
      icon: Blocks,
      badge: 5,
    },
  ];

  const handlePanelClick = (id) => {
    onPanelChange?.(id);
  };

  const handleSettings = () => {
    onSettings?.();
  };

  const handleAccounts = () => {
    // Falls back to onSettings only if no dedicated
    // accounts handler is passed in, so this button
    // doesn't silently do nothing.
    if (onAccounts) {
      onAccounts();
    } else {
      onSettings?.();
    }
  };

  return (
    <>
      <style>{`
        .rohit-activity-bar {
          width: 56px;
          min-width: 56px;
          height: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;

          padding: 8px 0;

          background: #181818;
          border-right: 1px solid #2b2b2b;

          color: #858585;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;

          user-select: none;
        }

        .rohit-activity-top,
        .rohit-activity-bottom {
          width: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;

          gap: 5px;
        }

        .rohit-activity-button {
          position: relative;

          width: 54px;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-left: 2px solid transparent;

          background: transparent;

          color: #858585;

          cursor: pointer;

          transition:
            background .12s ease,
            color .12s ease;
        }

        .rohit-activity-button:hover {
          background: #252526;
          color: #d7d7d7;
        }

        .rohit-activity-button.active {
          color: #ffffff;
          background: #202020;
          border-left-color: #007acc;
        }

        .rohit-activity-button svg {
          width: 23px;
          height: 23px;

          stroke-width: 1.55;
        }

        .rohit-extension-badge {
          position: absolute;

          top: 6px;
          right: 7px;

          min-width: 15px;
          height: 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 3px;

          border-radius: 8px;

          background: #007acc;
          color: #ffffff;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;

          font-size: 9px;
          font-weight: 700;

          line-height: 1;
        }

        .rohit-activity-tooltip {
          position: absolute;

          left: 61px;
          top: 50%;

          transform: translateY(-50%);

          z-index: 10000;

          display: none;

          min-width: max-content;

          padding: 7px 10px;

          background: #252526;

          border: 1px solid #454545;

          border-radius: 4px;

          box-shadow:
            0 8px 24px rgba(0, 0, 0, .45);

          color: #ffffff;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;

          font-size: 12px;

          line-height: 1;

          pointer-events: none;
        }

        .rohit-activity-button:hover
        .rohit-activity-tooltip {
          display: block;
        }

        .rohit-activity-divider {
          width: 30px;
          height: 1px;

          margin: 4px 0 5px;

          background: #303030;
        }

        .rohit-activity-settings {
          margin-top: 2px;
        }

        @media (max-width: 700px) {
          .rohit-activity-bar {
            width: 48px;
            min-width: 48px;
          }

          .rohit-activity-button {
            width: 46px;
            height: 46px;
          }

          .rohit-activity-button svg {
            width: 21px;
            height: 21px;
          }

          .rohit-activity-tooltip {
            left: 53px;
          }
        }
      `}</style>

      <aside className="rohit-activity-bar">
        {/* TOP */}

        <div className="rohit-activity-top">
          {items.map((item) => {
            const Icon = item.icon;

            const isActive =
              activePanel === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`rohit-activity-button ${
                  isActive ? "active" : ""
                }`}
                onClick={() =>
                  handlePanelClick(item.id)
                }
                title={item.label}
                aria-label={item.label}
                aria-pressed={isActive}
              >
                <Icon />

                {item.badge && (
                  <span className="rohit-extension-badge">
                    {item.badge}
                  </span>
                )}

                <span className="rohit-activity-tooltip">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* BOTTOM */}

        <div className="rohit-activity-bottom">
          <div className="rohit-activity-divider" />

          {/* ACCOUNT */}

          <button
            type="button"
            className="rohit-activity-button"
            onClick={handleAccounts}
            title="Accounts"
            aria-label="Accounts"
          >
            <UserRound />

            <span className="rohit-activity-tooltip">
              Accounts
            </span>
          </button>

          {/* SETTINGS */}

          <button
            type="button"
            className="rohit-activity-button rohit-activity-settings"
            onClick={handleSettings}
            title="Settings"
            aria-label="Settings"
          >
            <Settings />

            <span className="rohit-activity-tooltip">
              Settings
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default ActivityBar;