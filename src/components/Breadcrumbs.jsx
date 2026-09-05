import { FileCode2 } from "lucide-react";

function Breadcrumbs({ file, folders = [], onNavigateFolder }) {
  if (!file) return null;

  // Resolve the real folder name from file.folderId instead of a
  // hardcoded "src". Falls back to the project root when the file
  // isn't inside any folder.
  const folder = folders.find(
    (item) => item.id === file.folderId,
  );

  const parts = [
    { label: "CodeForge", type: "root" },
    ...(folder ? [{ label: folder.name, type: "folder", id: folder.id }] : []),
    { label: file.name, type: "file" },
  ];

  return (
    <div className="rohit-breadcrumbs">
      <style>{`
        .rohit-breadcrumbs {
          height: 34px;
          min-height: 34px;
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 0 14px;
          background: #1e1e1e;
          border-bottom: 1px solid #252525;
          color: #858585;
          font-family: "Segoe UI", Inter, sans-serif;
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          min-width: 0;
        }

        .rohit-breadcrumb-crumb {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-width: 0;
          flex-shrink: 1;
        }

        .rohit-breadcrumb-item {
          display: inline-block;
          min-width: 0;
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: bottom;
        }

        .rohit-breadcrumb-item.clickable {
          border: 0;
          background: transparent;
          padding: 0;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }

        .rohit-breadcrumb-item.clickable:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .rohit-breadcrumb-crumb:last-child .rohit-breadcrumb-item {
          color: #cccccc;
          font-weight: 500;
          flex-shrink: 0;
        }

        .rohit-breadcrumb-separator {
          margin: 0 2px;
          color: #555555;
          flex-shrink: 0;
        }
      `}</style>

      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const isClickable =
          part.type === "folder" && !!onNavigateFolder;

        return (
          <span
            key={`${part.type}-${part.label}-${index}`}
            className="rohit-breadcrumb-crumb"
          >
            {part.type === "file" && (
              <FileCode2 size={13} style={{ flexShrink: 0 }} />
            )}

            {isClickable ? (
              <button
                type="button"
                className="rohit-breadcrumb-item clickable"
                onClick={() => onNavigateFolder(part.id)}
                title={part.label}
              >
                {part.label}
              </button>
            ) : (
              <span
                className="rohit-breadcrumb-item"
                title={part.label}
              >
                {part.label}
              </span>
            )}

            {!isLast && (
              <span className="rohit-breadcrumb-separator">
                ›
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;