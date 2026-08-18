import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Replace,
} from "lucide-react";

function isWholeWord(text, start, length) {
  const before = text[start - 1];
  const after = text[start + length];

  const isWord = (char) => char && /[A-Za-z0-9_]/.test(char);

  return !isWord(before) && !isWord(after);
}

function SearchPanel({
  isOpen = false,
  files = [],
  onClose,
  onSelectFile,
}) {
  const [query, setQuery] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  // Track expand/collapse per file id instead of one shared flag,
  // so toggling one file's results doesn't affect the others.
  const [collapsedFiles, setCollapsedFiles] = useState(() => new Set());

  const toggleFileExpanded = (fileId) => {
    setCollapsedFiles((previous) => {
      const next = new Set(previous);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchQuery = caseSensitive ? query : query.toLowerCase();

    return files
      .map((file) => {
        const content = file.content || "";
        const lines = content.split("\n");

        const matches = [];

        lines.forEach((line, index) => {
          const compareLine = caseSensitive ? line : line.toLowerCase();

          let start = 0;

          while (true) {
            const found = compareLine.indexOf(searchQuery, start);

            if (found === -1) break;

            if (wholeWord && !isWholeWord(line, found, query.length)) {
              start = found + query.length;
              continue;
            }

            matches.push({
              line: index + 1,
              text: line.trim(),
            });

            start = found + query.length;
          }
        });

        return { file, matches };
      })
      .filter((item) => item.matches.length > 0);
  }, [files, query, caseSensitive, wholeWord]);

  const totalMatches = results.reduce(
    (total, item) => total + item.matches.length,
    0,
  );

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setReplaceText("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="search-panel">
      <div className="search-panel-header">
        <span>SEARCH</span>

        <button type="button" onClick={onClose} aria-label="Close Search panel">
          <X size={15} />
        </button>
      </div>

      <div className="search-panel-input">
        <Search size={15} />

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="search-panel-actions">
        <button
          type="button"
          className={showReplace ? "active" : ""}
          onClick={() => setShowReplace(!showReplace)}
          title="Toggle Replace"
        >
          <Replace size={14} />
        </button>

        <button
          type="button"
          className={caseSensitive ? "active" : ""}
          onClick={() => setCaseSensitive(!caseSensitive)}
          title="Match Case"
        >
          Aa
        </button>

        <button
          type="button"
          className={wholeWord ? "active" : ""}
          onClick={() => setWholeWord(!wholeWord)}
          title="Match Whole Word"
        >
          ab
        </button>
      </div>

      {showReplace && (
        <div className="search-panel-input">
          <Replace size={15} />

          <input
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace"
          />
        </div>
      )}

      <div className="search-panel-summary">
        {query ? (
          <>
            {totalMatches} {totalMatches === 1 ? "result" : "results"}
          </>
        ) : (
          "Search across files"
        )}
      </div>

      {query && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">No results found</div>
          ) : (
            results.map(({ file, matches }) => {
              const isExpanded = !collapsedFiles.has(file.id);

              return (
                <div key={file.id} className="search-file">
                  <button
                    type="button"
                    className="search-file-header"
                    onClick={() => toggleFileExpanded(file.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}

                    <span>{file.name}</span>

                    <small>{matches.length}</small>
                  </button>

                  {isExpanded &&
                    matches.map((match, index) => (
                      <button
                        type="button"
                        key={`${file.id}-${index}`}
                        className="search-result"
                        onClick={() => onSelectFile?.(file.id, match.line)}
                      >
                        <span>{match.line}</span>

                        <span>{match.text}</span>
                      </button>
                    ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPanel;