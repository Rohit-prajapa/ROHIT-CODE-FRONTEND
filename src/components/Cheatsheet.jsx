import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

const CHEATSHEETS = [
  ["C", "c.html"],
  ["C++", "cpp.html"],
  ["Java", "java.html"],
  ["Python", "python.html"],
  ["JavaScript", "javascript.html"],
  ["TypeScript", "typescript.html"],
  ["HTML", "html.html"],
  ["CSS", "css.html"],
  ["React", "react.html"],
  ["Bootstrap", "bootstrap.html"],
  ["Tailwind CSS", "tailwindCSS.html"],
  ["Node.js", "node.html"],
  ["Express", "express.html"],
  ["HTTP / API", "http-api.html"],
  ["MongoDB", "mongodb.html"],
  ["MySQL", "mysql.html"],
  ["SQL", "sql.html"],
  ["DSA", "dsa.html"],
  ["OOPS", "oops.html"],
  ["Operating System", "os.html"],
  ["Computer Networks", "computer-networks.html"],
  ["Git & GitHub", "Git&GitHub.html"],
  ["Linux", "linux.html"],
  ["VS Code", "vscode.html"],
];

function Cheatsheet({ onClose }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filteredCheatsheets = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return CHEATSHEETS;
    }

    return CHEATSHEETS.filter(([name]) =>
      name.toLowerCase().includes(query),
    );
  }, [search]);

  const openCheatsheet = (name, file) => {
    setSelected({
      name,
      file,
    });
  };

  const goBack = () => {
    setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    onClose?.();
  };

  return (
    <div className="rohit-cheatsheet-root">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="rohit-cheatsheet-header">
        <div className="rohit-cheatsheet-brand">
          <div className="rohit-cheatsheet-brand-icon">
            <BookOpen size={22} />
          </div>

          <div className="rohit-cheatsheet-brand-text">
            <strong>CodeWithRohit</strong>
            <span>Programming Cheat Sheets</span>
          </div>
        </div>

        <button
          type="button"
          className="rohit-cheatsheet-close"
          onClick={handleClose}
          title="Close Cheatsheet"
          aria-label="Close Cheatsheet"
        >
          <X size={21} />
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      {!selected ? (
        <div className="rohit-cheatsheet-home">
          {/* SEARCH */}

          <div className="rohit-cheatsheet-search">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search cheat sheets..."
              aria-label="Search cheat sheets"
            />

            {search && (
              <button
                type="button"
                className="rohit-cheatsheet-clear"
                onClick={() => setSearch("")}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* TITLE */}

          <div className="rohit-cheatsheet-section-header">
            <div>
              <span className="rohit-cheatsheet-section-title">
                ALL CHEAT SHEETS
              </span>

              <span className="rohit-cheatsheet-section-count">
                {filteredCheatsheets.length} resources
              </span>
            </div>
          </div>

          {/* LIST */}

          <div className="rohit-cheatsheet-list">
            {filteredCheatsheets.map(([name, file], index) => (
              <button
                key={file}
                type="button"
                className="rohit-cheatsheet-item"
                onClick={() =>
                  openCheatsheet(name, file)
                }
              >
                <span className="rohit-cheatsheet-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="rohit-cheatsheet-item-icon">
                  <BookOpen size={15} />
                </span>

                <span className="rohit-cheatsheet-item-name">
                  {name}
                </span>

                <ChevronRight
                  size={15}
                  className="rohit-cheatsheet-item-arrow"
                />
              </button>
            ))}

            {filteredCheatsheets.length === 0 && (
              <div className="rohit-cheatsheet-empty">
                <Search size={24} />

                <strong>
                  No cheat sheet found
                </strong>

                <span>
                  Try another search term.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ===================================================
           CHEATSHEET VIEW
        ==================================================== */

        <div className="rohit-cheatsheet-view">
          {/* VIEW HEADER */}

          <div className="rohit-cheatsheet-view-header">
            <button
              type="button"
              className="rohit-cheatsheet-back"
              onClick={goBack}
              title="Back to Cheat Sheets"
              aria-label="Back to Cheat Sheets"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="rohit-cheatsheet-current">
              <BookOpen size={15} />

              <span>{selected.name}</span>
            </div>

            <button
              type="button"
              className="rohit-cheatsheet-view-close"
              onClick={handleClose}
              title="Close Cheatsheet"
              aria-label="Close Cheatsheet"
            >
              <X size={17} />
            </button>
          </div>

          {/* ACTUAL CHEATSHEET */}

          <div className="rohit-cheatsheet-frame-container">
            <iframe
              key={selected.file}
              title={`${selected.name} Cheat Sheet`}
              src={`/cheatsheet/cheatsheets/${encodeURIComponent(
                selected.file,
              )}`}
              className="rohit-cheatsheet-frame"
            />
          </div>
        </div>
      )}

      {/* =====================================================
          STYLES
      ====================================================== */}

      <style>{`
        .rohit-cheatsheet-root {
          width: 100%;
          height: 100%;
          min-height: 0;

          display: flex;
          flex-direction: column;

          background: #0f1117;
          color: #d4d4d4;

          font-family:
            "Segoe UI",
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;

          overflow: hidden;
        }

        /* ===================================================
           HEADER
        ==================================================== */

        .rohit-cheatsheet-header {
          flex: 0 0 88px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 14px 16px;

          background: #181b23;

          border-bottom: 1px solid #2b2f3a;
        }

        .rohit-cheatsheet-brand {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 12px;
        }

        .rohit-cheatsheet-brand-icon {
          width: 48px;
          height: 48px;

          flex: 0 0 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #1b2a40;

          border: 1px solid #30435e;

          color: #4fc3ff;
        }

        .rohit-cheatsheet-brand-text {
          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 3px;
        }

        .rohit-cheatsheet-brand-text strong {
          color: #f3f4f6;

          font-size: 17px;
          font-weight: 700;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rohit-cheatsheet-brand-text span {
          color: #858da0;

          font-size: 11px;

          white-space: nowrap;
        }

        .rohit-cheatsheet-close {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #39404d;
          border-radius: 8px;

          background: #252a34;

          color: #c8ccd4;

          cursor: pointer;

          transition:
            background .15s ease,
            color .15s ease,
            border-color .15s ease;
        }

        .rohit-cheatsheet-close:hover {
          background: #333944;
          border-color: #4a5261;
          color: #ffffff;
        }

        /* ===================================================
           HOME
        ==================================================== */

        .rohit-cheatsheet-home {
          flex: 1;
          min-height: 0;

          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        /* ===================================================
           SEARCH
        ==================================================== */

        .rohit-cheatsheet-search {
          height: 42px;

          flex: 0 0 42px;

          display: flex;
          align-items: center;

          gap: 8px;

          margin: 14px 14px 10px;

          padding: 0 11px;

          background: #191c23;

          border: 1px solid #353a46;

          border-radius: 6px;

          color: #788296;

          transition: border-color .15s ease;
        }

        .rohit-cheatsheet-search:focus-within {
          border-color: #007acc;

          box-shadow:
            0 0 0 1px rgba(0, 122, 204, .2);
        }

        .rohit-cheatsheet-search input {
          flex: 1;

          min-width: 0;

          height: 100%;

          border: 0;
          outline: 0;

          background: transparent;

          color: #d4d4d4;

          font-family: inherit;
          font-size: 12px;
        }

        .rohit-cheatsheet-search input::placeholder {
          color: #697181;
        }

        .rohit-cheatsheet-clear {
          width: 22px;
          height: 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 4px;

          background: transparent;

          color: #7d8492;

          cursor: pointer;
        }

        .rohit-cheatsheet-clear:hover {
          background: #30343d;
          color: #ffffff;
        }

        /* ===================================================
           SECTION HEADER
        ==================================================== */

        .rohit-cheatsheet-section-header {
          flex: 0 0 45px;

          display: flex;
          align-items: center;

          padding: 0 16px;

          border-bottom: 1px solid #292d36;
        }

        .rohit-cheatsheet-section-header > div {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rohit-cheatsheet-section-title {
          color: #e5e7eb;

          font-size: 11px;
          font-weight: 700;

          letter-spacing: .5px;
        }

        .rohit-cheatsheet-section-count {
          color: #697181;

          font-size: 10px;
        }

        /* ===================================================
           LIST
        ==================================================== */

        .rohit-cheatsheet-list {
          flex: 1;
          min-height: 0;

          overflow-y: auto;

          padding: 7px 7px 14px;
        }

        .rohit-cheatsheet-list::-webkit-scrollbar {
          width: 8px;
        }

        .rohit-cheatsheet-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .rohit-cheatsheet-list::-webkit-scrollbar-thumb {
          background: #3d424c;
          border-radius: 4px;
        }

        .rohit-cheatsheet-list::-webkit-scrollbar-thumb:hover {
          background: #555b67;
        }

        .rohit-cheatsheet-item {
          width: 100%;
          min-height: 42px;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 0 8px;

          margin-bottom: 2px;

          border: 0;
          border-radius: 5px;

          background: transparent;

          color: #c8ccd4;

          text-align: left;

          cursor: pointer;

          transition:
            background .12s ease,
            color .12s ease;
        }

        .rohit-cheatsheet-item:hover {
          background: #252932;
          color: #ffffff;
        }

        .rohit-cheatsheet-number {
          width: 20px;

          color: #555d6d;

          font-family: Consolas, monospace;

          font-size: 9px;

          text-align: right;
        }

        .rohit-cheatsheet-item-icon {
          width: 28px;
          height: 28px;

          flex: 0 0 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 5px;

          background: #1d2938;

          color: #4fc3ff;
        }

        .rohit-cheatsheet-item-name {
          flex: 1;

          min-width: 0;

          overflow: hidden;

          font-size: 12px;
          font-weight: 500;

          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .rohit-cheatsheet-item-arrow {
          flex: 0 0 auto;

          color: #555d6d;
        }

        .rohit-cheatsheet-item:hover
        .rohit-cheatsheet-item-arrow {
          color: #9da5b4;
        }

        /* ===================================================
           EMPTY
        ==================================================== */

        .rohit-cheatsheet-empty {
          min-height: 180px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 8px;

          color: #626b7b;

          text-align: center;
        }

        .rohit-cheatsheet-empty strong {
          color: #9aa2b1;

          font-size: 12px;
        }

        .rohit-cheatsheet-empty span {
          font-size: 10px;
        }

        /* ===================================================
           VIEW
        ==================================================== */

        .rohit-cheatsheet-view {
          flex: 1;
          min-height: 0;

          display: flex;
          flex-direction: column;

          background: #101218;

          overflow: hidden;
        }

        .rohit-cheatsheet-view-header {
          height: 42px;
          min-height: 42px;

          display: flex;
          align-items: center;

          gap: 7px;

          padding: 0 8px;

          background: #1b1e26;

          border-bottom: 1px solid #30343d;
        }

        .rohit-cheatsheet-back,
        .rohit-cheatsheet-view-close {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 30px;

          border: 0;
          border-radius: 5px;

          background: transparent;

          color: #9ca3af;

          cursor: pointer;
        }

        .rohit-cheatsheet-back:hover,
        .rohit-cheatsheet-view-close:hover {
          background: #30343d;
          color: #ffffff;
        }

        .rohit-cheatsheet-current {
          flex: 1;
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 7px;

          color: #e5e7eb;

          font-size: 12px;
          font-weight: 600;
        }

        .rohit-cheatsheet-current svg {
          color: #4fc3ff;
        }

        .rohit-cheatsheet-current span {
          overflow: hidden;

          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /* ===================================================
           IFRAME
        ==================================================== */

        .rohit-cheatsheet-frame-container {
          flex: 1;
          min-height: 0;

          overflow: hidden;

          background: #ffffff;
        }

        .rohit-cheatsheet-frame {
          display: block;

          width: 100%;
          height: 100%;

          border: 0;

          background: #ffffff;
        }

        /* ===================================================
           SMALL SIDEBAR
        ==================================================== */

        @media (max-width: 500px) {
          .rohit-cheatsheet-header {
            padding: 12px;
          }

          .rohit-cheatsheet-brand-text strong {
            font-size: 15px;
          }

          .rohit-cheatsheet-brand-icon {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
          }

          .rohit-cheatsheet-close {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }
        }
      `}</style>
    </div>
  );
}

export default Cheatsheet;