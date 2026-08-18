import { useRef } from "react";
import {
  GitBranch,
  RefreshCw,
  Plus,
  Minus,
  Check,
  MoreHorizontal,
} from "lucide-react";

function SourceControlPanel({
  changes = [],
  branch = "main",
  onRefresh,
  onStage,
  onUnstage,
  onCommit,
}) {
  const messageInputRef = useRef(null);

  const staged = changes.filter((file) => file.staged);
  const unstaged = changes.filter((file) => !file.staged);

  const commit = () => {
    const value = messageInputRef.current?.value?.trim();

    onCommit?.(value || "Update files");

    if (messageInputRef.current) {
      messageInputRef.current.value = "";
    }
  };

  return (
    <section className="rohit-source-control">
      <header className="rohit-source-header">
        <span>SOURCE CONTROL</span>
        <div>
          <button
            type="button"
            title="Refresh"
            onClick={onRefresh}
          >
            <RefreshCw size={14} />
          </button>
          <button type="button" title="More Actions">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </header>
      <div className="rohit-source-branch">
        <GitBranch size={15} />
        <span>{branch}</span>
        <span className="rohit-source-sync">0 ↓ 0 ↑</span>
      </div>
      <div className="rohit-source-section">
        <div className="rohit-source-section-title">
          <span>STAGED CHANGES</span>
          <span>{staged.length}</span>
        </div>
        {staged.map((file) => (
          <div className="rohit-source-file" key={file.id}>
            <span className="rohit-source-status">
              {file.status || "M"}
            </span>
            <span className="rohit-source-name">{file.name}</span>
            <button
              type="button"
              title="Unstage"
              onClick={() => onUnstage?.(file)}
            >
              <Minus size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="rohit-source-section">
        <div className="rohit-source-section-title">
          <span>CHANGES</span>
          <span>{unstaged.length}</span>
        </div>
        {unstaged.map((file) => (
          <div className="rohit-source-file" key={file.id}>
            <span className="rohit-source-status modified">
              {file.status || "M"}
            </span>
            <span className="rohit-source-name">{file.name}</span>
            <button
              type="button"
              title="Stage"
              onClick={() => onStage?.(file)}
            >
              <Plus size={14} />
            </button>
          </div>
        ))}
        {unstaged.length === 0 && staged.length === 0 && (
          <div className="rohit-source-empty">No changes</div>
        )}
      </div>
      <div className="rohit-source-commit">
        <input
          ref={messageInputRef}
          placeholder="Message (Ctrl+Enter to commit)"
          onKeyDown={(event) => {
            if (event.ctrlKey && event.key === "Enter") {
              commit();
            }
          }}
        />
        <button
          type="button"
          disabled={!staged.length}
          onClick={commit}
        >
          <Check size={14} />
          Commit
        </button>
      </div>
    </section>
  );
}

export default SourceControlPanel;