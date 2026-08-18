import {
  Search,
  Package,
  Download,
  Check,
  MoreVertical,
} from "lucide-react";
import { useMemo, useState } from "react";

function ExtensionsPanel({
  installedExtensions = [],
  onInstall,
  onUninstall,
}) {
  const [query, setQuery] = useState("");

  const extensions = [
    {
      id: "prettier",
      name: "Prettier",
      publisher: "Prettier",
      description:
        "Code formatter for JavaScript, TypeScript, JSON, CSS and more.",
      downloads: "35M",
      icon: "P",
    },
    {
      id: "python",
      name: "Python",
      publisher: "Microsoft",
      description:
        "Rich Python development with IntelliSense, debugging and testing.",
      downloads: "120M",
      icon: "🐍",
    },
    {
      id: "java",
      name: "Extension Pack for Java",
      publisher: "Microsoft",
      description:
        "Complete Java development support for VS Code.",
      downloads: "25M",
      icon: "☕",
    },
    {
      id: "eslint",
      name: "ESLint",
      publisher: "Microsoft",
      description:
        "Find and fix problems in JavaScript and TypeScript.",
      downloads: "30M",
      icon: "E",
    },
    {
      id: "gitlens",
      name: "GitLens",
      publisher: "GitKraken",
      description:
        "Supercharge Git inside your code editor.",
      downloads: "15M",
      icon: "G",
    },
  ];

  const filteredExtensions = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return extensions;

    return extensions.filter(
      (extension) =>
        extension.name.toLowerCase().includes(value) ||
        extension.publisher.toLowerCase().includes(value) ||
        extension.description
          .toLowerCase()
          .includes(value),
    );
  }, [query]);

  const isInstalled = (id) =>
    installedExtensions.some(
      (extension) => extension.id === id,
    );

  return (
    <section className="rohit-extensions-panel">
      <style>{`
        .rohit-extensions-panel {
          width: 100%;
          height: 100%;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          background: #181818;
          color: #cccccc;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;
        }

        .rohit-extensions-header {
          height: 35px;
          min-height: 35px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 16px;

          color: #bbbbbb;

          font-size: 11px;
          font-weight: 700;
          letter-spacing: .5px;
        }

        .rohit-extensions-header button {
          width: 24px;
          height: 24px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 4px;

          background: transparent;
          color: #999999;

          cursor: pointer;

          transition: background .12s ease, color .12s ease;
        }

        .rohit-extensions-header button:hover {
          background: #2a2d2e;
          color: #ffffff;
        }

        .rohit-extensions-search {
          display: flex;
          align-items: center;
          gap: 8px;

          margin: 0 12px 8px;
          padding: 0 10px;
          height: 32px;

          border: 1px solid #3b3b3b;
          border-radius: 4px;

          background: #252526;
          color: #858585;
        }

        .rohit-extensions-search:focus-within {
          border-color: #007acc;
        }

        .rohit-extensions-search input {
          flex: 1;
          min-width: 0;

          border: 0;
          outline: 0;

          background: transparent;
          color: #ffffff;

          font-size: 12px;
        }

        .rohit-extensions-search input::placeholder {
          color: #767676;
        }

        .rohit-extensions-count {
          padding: 0 16px 8px;

          color: #858585;

          font-size: 11px;
        }

        .rohit-extensions-list {
          flex: 1;
          min-height: 0;

          overflow-y: auto;
        }

        .rohit-extensions-list::-webkit-scrollbar {
          width: 8px;
        }

        .rohit-extensions-list::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 8px;
        }

        .rohit-extensions-empty {
          height: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;

          color: #767676;

          font-size: 13px;
        }

        .rohit-extension-card {
          display: flex;
          gap: 10px;

          padding: 10px 14px;

          border-bottom: 1px solid #232323;

          cursor: default;

          transition: background .12s ease;
        }

        .rohit-extension-card:hover {
          background: #202020;
        }

        .rohit-extension-icon {
          flex-shrink: 0;

          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 6px;

          background: #2a2d2e;
          color: #ffffff;

          font-size: 17px;
          font-weight: 700;
        }

        .rohit-extension-info {
          flex: 1;
          min-width: 0;
        }

        .rohit-extension-name {
          color: #ffffff;

          font-size: 13px;
          font-weight: 600;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rohit-extension-publisher {
          margin-top: 1px;

          color: #9cdcfe;

          font-size: 11px;
        }

        .rohit-extension-description {
          margin-top: 4px;

          color: #a0a0a0;

          font-size: 11px;
          line-height: 1.45;
        }

        .rohit-extension-meta {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-top: 6px;

          color: #767676;

          font-size: 10px;
        }

        .rohit-extension-installed {
          display: inline-flex;
          align-items: center;
          gap: 3px;

          color: #4ec9b0;
        }

        .rohit-extension-install,
        .rohit-extension-remove {
          flex-shrink: 0;

          align-self: flex-start;

          height: 26px;

          display: inline-flex;
          align-items: center;
          gap: 5px;

          padding: 0 10px;

          border: 1px solid transparent;
          border-radius: 4px;

          font-size: 11px;
          font-weight: 600;

          cursor: pointer;

          transition: background .12s ease, border-color .12s ease;
        }

        .rohit-extension-install {
          background: #16825d;
          color: #ffffff;
        }

        .rohit-extension-install:hover {
          background: #1b9b6f;
        }

        .rohit-extension-remove {
          border-color: #3b3b3b;
          background: transparent;
          color: #cccccc;
        }

        .rohit-extension-remove:hover {
          background: #3a2323;
          border-color: #7a3a3a;
          color: #ff8a73;
        }
      `}</style>

      <header className="rohit-extensions-header">
        <span>EXTENSIONS</span>

        <button
          type="button"
          title="More Actions"
          onClick={() =>
            alert(
              "Sort by, filter, and category options will be available in a future update.",
            )
          }
        >
          <MoreVertical size={15} />
        </button>
      </header>

      <div className="rohit-extensions-search">
        <Search size={15} />

        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search Extensions"
        />
      </div>

      <div className="rohit-extensions-count">
        {filteredExtensions.length} Extensions
      </div>

      <div className="rohit-extensions-list">
        {filteredExtensions.length === 0 ? (
          <div className="rohit-extensions-empty">
            <Package size={28} />

            <span>
              No extensions found
            </span>
          </div>
        ) : (
          filteredExtensions.map(
            (extension) => {
              const installed =
                isInstalled(extension.id);

              return (
                <article
                  key={extension.id}
                  className="rohit-extension-card"
                >
                  <div className="rohit-extension-icon">
                    {extension.icon}
                  </div>

                  <div className="rohit-extension-info">
                    <div className="rohit-extension-name">
                      {extension.name}
                    </div>

                    <div className="rohit-extension-publisher">
                      {extension.publisher}
                    </div>

                    <div className="rohit-extension-description">
                      {extension.description}
                    </div>

                    <div className="rohit-extension-meta">
                      <span>
                        ↓ {extension.downloads}
                      </span>

                      {installed && (
                        <span className="rohit-extension-installed">
                          <Check size={11} />
                          Installed
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={
                      installed
                        ? "rohit-extension-remove"
                        : "rohit-extension-install"
                    }
                    onClick={() => {
                      if (installed) {
                        onUninstall?.(
                          extension,
                        );
                      } else {
                        onInstall?.(
                          extension,
                        );
                      }
                    }}
                  >
                    {installed ? (
                      "Uninstall"
                    ) : (
                      <>
                        <Download size={13} />
                        Install
                      </>
                    )}
                  </button>
                </article>
              );
            },
          )
        )}
      </div>
    </section>
  );
}

export default ExtensionsPanel;