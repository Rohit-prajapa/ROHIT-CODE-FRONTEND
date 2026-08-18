import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

import Tabs from "./Tabs";
import Breadcrumbs from "./Breadcrumbs";

function CodeEditor({
  file,
  files,
  folders,
  activeFile,
  onTabSelect,
  onTabClose,
  onNewTab,
  onCodeChange,
  onCursorPositionChange,
  theme,
  fontSize,
  minimap,
  wordWrap,
  tabSize = 4,
  lineNumbers = true,
  jumpToLine,

  // =========================================
  // EDIT MENU
  // =========================================

  editAction,

  // =========================================
  // SELECTION MENU
  // =========================================

  selectionAction,
}) {
  const editorRef = useRef(null);
  const cursorListenerRef = useRef(null);
  const monacoRef = useRef(null);

  // =========================================
  // CODE CHANGE
  // =========================================

  const handleEditorChange = (value) => {
    if (!file || !onCodeChange) {
      return;
    }

    onCodeChange(file.id, value ?? "");
  };

  // =========================================
  // EDITOR MOUNT
  // =========================================

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // =========================================
    // ROHIT-CODE MONACO THEME
    // =========================================

    monaco.editor.defineTheme("rohit-code-dark", {
      base: "vs-dark",
      inherit: true,

      rules: [
        {
          token: "comment",
          foreground: "6A9955",
          fontStyle: "italic",
        },
        {
          token: "keyword",
          foreground: "569CD6",
        },
        {
          token: "string",
          foreground: "CE9178",
        },
        {
          token: "number",
          foreground: "B5CEA8",
        },
        {
          token: "type",
          foreground: "4EC9B0",
        },
        {
          token: "function",
          foreground: "DCDCAA",
        },
        {
          token: "variable",
          foreground: "9CDCFE",
        },
      ],

      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",

        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#C6C6C6",

        "editorCursor.foreground": "#AEAFAD",

        "editor.lineHighlightBackground": "#252526",

        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#3A3D41",

        "editorIndentGuide.background1": "#404040",
        "editorIndentGuide.activeBackground1": "#707070",

        "editorBracketMatch.background": "#0D3A58",
        "editorBracketMatch.border": "#888888",

        "editorWidget.background": "#252526",
        "editorWidget.border": "#454545",

        "editorSuggestWidget.background": "#252526",
        "editorSuggestWidget.border": "#454545",
        "editorSuggestWidget.selectedBackground": "#094771",

        "editorHoverWidget.background": "#252526",
        "editorHoverWidget.border": "#454545",

        "scrollbarSlider.background": "#79797933",
        "scrollbarSlider.hoverBackground": "#64646466",
        "scrollbarSlider.activeBackground": "#BFBFBF4D",

        "editorOverviewRuler.border": "#00000000",
      },
    });

    // =========================================
    // MIDNIGHT BLUE
    // =========================================

    monaco.editor.defineTheme("rohit-code-midnight", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A8FB3", fontStyle: "italic" },
        { token: "keyword", foreground: "7AA2F7" },
        { token: "string", foreground: "9ECE6A" },
        { token: "number", foreground: "FF9E64" },
        { token: "type", foreground: "2AC3DE" },
        { token: "function", foreground: "BB9AF7" },
        { token: "variable", foreground: "C0CAF5" },
      ],
      colors: {
        "editor.background": "#0B1220",
        "editor.foreground": "#C8D3F5",
        "editorLineNumber.foreground": "#52607A",
        "editorLineNumber.activeForeground": "#A9B8D8",
        "editorCursor.foreground": "#82AAFF",
        "editor.lineHighlightBackground": "#121C30",
        "editor.selectionBackground": "#233B67",
        "editor.inactiveSelectionBackground": "#1A2B49",
        "editorIndentGuide.background1": "#25324A",
        "editorIndentGuide.activeBackground1": "#3C5278",
        "editorBracketMatch.background": "#17365D",
        "editorBracketMatch.border": "#5B8DEF",
        "editorWidget.background": "#111B2E",
        "editorWidget.border": "#2A3A58",
        "editorSuggestWidget.background": "#111B2E",
        "editorSuggestWidget.border": "#2A3A58",
        "editorSuggestWidget.selectedBackground": "#20385F",
        "editorHoverWidget.background": "#111B2E",
        "editorHoverWidget.border": "#2A3A58",
        "scrollbarSlider.background": "#5D709933",
        "scrollbarSlider.hoverBackground": "#7186B466",
        "scrollbarSlider.activeBackground": "#A9B8D84D",
        "editorOverviewRuler.border": "#00000000",
      },
    });

    // =========================================
    // DRACULA
    // =========================================

    monaco.editor.defineTheme("rohit-code-dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272A4", fontStyle: "italic" },
        { token: "keyword", foreground: "FF79C6" },
        { token: "string", foreground: "F1FA8C" },
        { token: "number", foreground: "BD93F9" },
        { token: "type", foreground: "8BE9FD" },
        { token: "function", foreground: "50FA7B" },
        { token: "variable", foreground: "F8F8F2" },
      ],
      colors: {
        "editor.background": "#282A36",
        "editor.foreground": "#F8F8F2",
        "editorLineNumber.foreground": "#6272A4",
        "editorLineNumber.activeForeground": "#F8F8F2",
        "editorCursor.foreground": "#F8F8F0",
        "editor.lineHighlightBackground": "#303241",
        "editor.selectionBackground": "#44475A",
        "editor.inactiveSelectionBackground": "#383A4A",
        "editorIndentGuide.background1": "#44475A",
        "editorIndentGuide.activeBackground1": "#6272A4",
        "editorBracketMatch.background": "#44475A",
        "editorBracketMatch.border": "#BD93F9",
        "editorWidget.background": "#21222C",
        "editorWidget.border": "#44475A",
        "editorSuggestWidget.background": "#21222C",
        "editorSuggestWidget.border": "#44475A",
        "editorSuggestWidget.selectedBackground": "#44475A",
        "editorHoverWidget.background": "#21222C",
        "editorHoverWidget.border": "#44475A",
        "scrollbarSlider.background": "#6272A455",
        "scrollbarSlider.hoverBackground": "#7A88B877",
        "scrollbarSlider.activeBackground": "#BD93F966",
        "editorOverviewRuler.border": "#00000000",
      },
    });

    // =========================================
    // MONOKAI
    // =========================================

    monaco.editor.defineTheme("rohit-code-monokai", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "75715E", fontStyle: "italic" },
        { token: "keyword", foreground: "F92672" },
        { token: "string", foreground: "E6DB74" },
        { token: "number", foreground: "AE81FF" },
        { token: "type", foreground: "66D9EF" },
        { token: "function", foreground: "A6E22E" },
        { token: "variable", foreground: "F8F8F2" },
      ],
      colors: {
        "editor.background": "#272822",
        "editor.foreground": "#F8F8F2",
        "editorLineNumber.foreground": "#75715E",
        "editorLineNumber.activeForeground": "#F8F8F2",
        "editorCursor.foreground": "#F8F8F0",
        "editor.lineHighlightBackground": "#30312B",
        "editor.selectionBackground": "#49483E",
        "editor.inactiveSelectionBackground": "#3E3D32",
        "editorIndentGuide.background1": "#3E3D32",
        "editorIndentGuide.activeBackground1": "#75715E",
        "editorBracketMatch.background": "#49483E",
        "editorBracketMatch.border": "#A6E22E",
        "editorWidget.background": "#1F201B",
        "editorWidget.border": "#49483E",
        "editorSuggestWidget.background": "#1F201B",
        "editorSuggestWidget.border": "#49483E",
        "editorSuggestWidget.selectedBackground": "#49483E",
        "editorHoverWidget.background": "#1F201B",
        "editorHoverWidget.border": "#49483E",
        "scrollbarSlider.background": "#75715E55",
        "scrollbarSlider.hoverBackground": "#A6A38B77",
        "scrollbarSlider.activeBackground": "#F8F8F266",
        "editorOverviewRuler.border": "#00000000",
      },
    });

    // =========================================
    // ROHIT LIGHT
    // =========================================

    monaco.editor.defineTheme("rohit-code-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "008000", fontStyle: "italic" },
        { token: "keyword", foreground: "0000FF" },
        { token: "string", foreground: "A31515" },
        { token: "number", foreground: "098658" },
        { token: "type", foreground: "267F99" },
        { token: "function", foreground: "795E26" },
        { token: "variable", foreground: "001080" },
      ],
      colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#333333",
        "editorLineNumber.foreground": "#999999",
        "editorLineNumber.activeForeground": "#333333",
        "editorCursor.foreground": "#000000",
        "editor.lineHighlightBackground": "#F3F3F3",
        "editor.selectionBackground": "#ADD6FF",
        "editor.inactiveSelectionBackground": "#E5EBF1",
        "editorIndentGuide.background1": "#D3D3D3",
        "editorIndentGuide.activeBackground1": "#999999",
        "editorBracketMatch.background": "#C9DEF5",
        "editorBracketMatch.border": "#6A9ED8",
        "editorWidget.background": "#F7F7F7",
        "editorWidget.border": "#C8C8C8",
        "editorSuggestWidget.background": "#F7F7F7",
        "editorSuggestWidget.border": "#C8C8C8",
        "editorSuggestWidget.selectedBackground": "#DCEBFA",
        "editorHoverWidget.background": "#F7F7F7",
        "editorHoverWidget.border": "#C8C8C8",
        "scrollbarSlider.background": "#88888844",
        "scrollbarSlider.hoverBackground": "#66666666",
        "scrollbarSlider.activeBackground": "#44444455",
        "editorOverviewRuler.border": "#00000000",
      },
    });

    // =========================================
    // HIGH CONTRAST
    // =========================================

    monaco.editor.defineTheme("rohit-code-high-contrast", {
      base: "hc-black",
      inherit: true,
      rules: [
        { token: "comment", foreground: "7CFC00" },
        { token: "keyword", foreground: "00FFFF" },
        { token: "string", foreground: "FFFF00" },
        { token: "number", foreground: "FFB000" },
        { token: "type", foreground: "00FFAA" },
        { token: "function", foreground: "FFFFFF" },
        { token: "variable", foreground: "FFFFFF" },
      ],
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#FFFFFF",
        "editorLineNumber.foreground": "#FFFFFF",
        "editorLineNumber.activeForeground": "#FFFFFF",
        "editorCursor.foreground": "#FFFFFF",
        "editor.lineHighlightBackground": "#101010",
        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#1F1F1F",
        "editorIndentGuide.background1": "#444444",
        "editorIndentGuide.activeBackground1": "#FFFFFF",
        "editorBracketMatch.background": "#333300",
        "editorBracketMatch.border": "#FFFFFF",
        "editorWidget.background": "#000000",
        "editorWidget.border": "#FFFFFF",
        "editorSuggestWidget.background": "#000000",
        "editorSuggestWidget.border": "#FFFFFF",
        "editorSuggestWidget.selectedBackground": "#1A5A8A",
        "editorHoverWidget.background": "#000000",
        "editorHoverWidget.border": "#FFFFFF",
        "scrollbarSlider.background": "#FFFFFF55",
        "scrollbarSlider.hoverBackground": "#FFFFFF88",
        "scrollbarSlider.activeBackground": "#FFFFFFAA",
        "editorOverviewRuler.border": "#FFFFFF",
      },
    });

    // =========================================
    // APPLY THEME
    // =========================================

    monaco.editor.setTheme(
      theme === "light"
        ? "rohit-code-light"
        : theme === "high-contrast"
          ? "rohit-code-high-contrast"
          : theme === "midnight"
            ? "rohit-code-midnight"
            : theme === "dracula"
              ? "rohit-code-dracula"
              : theme === "monokai"
                ? "rohit-code-monokai"
                : "rohit-code-dark",
    );

    // =========================================
    // INITIAL CURSOR POSITION
    // =========================================

    const position = editor.getPosition();

    if (position && onCursorPositionChange) {
      onCursorPositionChange({
        line: position.lineNumber,
        column: position.column,
      });
    }

    // =========================================
    // CURSOR LISTENER
    // =========================================

    cursorListenerRef.current =
      editor.onDidChangeCursorPosition((event) => {
        if (!onCursorPositionChange) {
          return;
        }

        onCursorPositionChange({
          line: event.position.lineNumber,
          column: event.position.column,
        });
      });

    // =========================================
    // FOCUS EDITOR
    // =========================================

    editor.focus();
  };

  // =========================================
  // CLEANUP
  // =========================================

  useEffect(() => {
    return () => {
      if (cursorListenerRef.current) {
        cursorListenerRef.current.dispose();
        cursorListenerRef.current = null;
      }

      editorRef.current = null;
      monacoRef.current = null;
    };
  }, []);

  // =========================================
  // APPLY THEME WHEN SETTINGS CHANGE
  // =========================================

  useEffect(() => {
    if (!monacoRef.current) {
      return;
    }

    monacoRef.current.editor.setTheme(
      theme === "light"
        ? "rohit-code-light"
        : theme === "high-contrast"
          ? "rohit-code-high-contrast"
          : theme === "midnight"
            ? "rohit-code-midnight"
            : theme === "dracula"
              ? "rohit-code-dracula"
              : theme === "monokai"
                ? "rohit-code-monokai"
                : "rohit-code-dark",
    );
  }, [theme]);

  // =========================================
  // EDIT MENU ACTIONS
  // =========================================

  useEffect(() => {
    if (!editorRef.current || !editAction) {
      return;
    }

    const editor = editorRef.current;

    const actions = {
      undo: "undo",
      redo: "redo",

      cut: "editor.action.clipboardCutAction",
      copy: "editor.action.clipboardCopyAction",
      paste: "editor.action.clipboardPasteAction",

      selectAll: "editor.action.selectAll",

      delete: "deleteAllLeft",
    };

    const actionId = actions[editAction];

    if (!actionId) {
      return;
    }

    editor.focus();

    editor.trigger(
      "rohit-code-edit-menu",
      actionId,
      null,
    );
  }, [editAction]);

  // =========================================
  // SELECTION MENU ACTIONS
  // =========================================

  useEffect(() => {
    if (!editorRef.current || !selectionAction) {
      return;
    }

    const editor = editorRef.current;

    const actions = {
      selectAll: "editor.action.selectAll",

      expandSelection:
        "editor.action.smartSelect.expand",

      shrinkSelection:
        "editor.action.smartSelect.shrink",

      copyLineDown:
        "editor.action.copyLinesDownAction",

      copyLineUp:
        "editor.action.copyLinesUpAction",

      moveLineDown:
        "editor.action.moveLinesDownAction",

      moveLineUp:
        "editor.action.moveLinesUpAction",

      duplicateSelection:
        "editor.action.duplicateSelection",
    };

    const actionId = actions[selectionAction];

    if (!actionId) {
      return;
    }

    editor.focus();

    editor.trigger(
      "rohit-code-selection-menu",
      actionId,
      null,
    );
  }, [selectionAction]);

  // =========================================
  // JUMP TO LINE
  // =========================================

  useEffect(() => {
    if (!editorRef.current || !jumpToLine) {
      return;
    }

    const lineNumber =
      typeof jumpToLine === "number"
        ? jumpToLine
        : jumpToLine.lineNumber;

    if (!lineNumber || lineNumber < 1) {
      return;
    }

    const editor = editorRef.current;

    const model = editor.getModel();

    if (!model) {
      return;
    }

    const safeLineNumber = Math.min(
      lineNumber,
      model.getLineCount(),
    );

    editor.revealLineInCenter(
      safeLineNumber,
    );

    editor.setPosition({
      lineNumber: safeLineNumber,
      column: 1,
    });

    editor.focus();
  }, [jumpToLine]);

  // =========================================
  // NO FILE
  // =========================================

  if (!file) {
    return (
      <div className={`editor-container editor-theme-${theme || "dark"}`}>
        <div className="empty-editor">
          <div className="empty-editor-content">

            <div className="empty-editor-logo">
              &lt;/&gt;
            </div>

            <div className="empty-editor-title">
              ROHIT-CODE
            </div>

            <div className="empty-editor-subtitle">
              Open a file from the Explorer to start coding
            </div>

            <div className="empty-editor-hint">
              Ctrl + P&nbsp;&nbsp; Quick Open
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // MONACO THEME
  // =========================================

  const monacoTheme =
    theme === "light"
      ? "rohit-code-light"
      : theme === "high-contrast"
        ? "rohit-code-high-contrast"
        : theme === "dracula"
          ? "rohit-code-dracula"
          : theme === "monokai"
            ? "rohit-code-monokai"
            : theme === "midnight"
              ? "rohit-code-midnight"
              : "rohit-code-dark";

  // =========================================
  // RENDER
  // =========================================

  return (
    <>
      <style>{`
        .editor-container {
          --editor-bg: #1e1e1e;
          --editor-fg: #cccccc;
          --editor-border: #2d2d2d;
          --editor-muted: #858585;

          position: relative;
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-left: 1px solid var(--editor-border);
          background: var(--editor-bg);
          color: var(--editor-fg);
        }

        .editor-theme-light {
          --editor-bg: #ffffff;
          --editor-fg: #333333;
          --editor-border: #e5e5e5;
          --editor-muted: #6e6e6e;
        }

        .editor-theme-high-contrast {
          --editor-bg: #000000;
          --editor-fg: #ffffff;
          --editor-border: #6fc3df;
          --editor-muted: #ffffff;
        }

        .editor-theme-midnight {
          --editor-bg: #0B1220;
          --editor-fg: #C8D3F5;
          --editor-border: #263550;
          --editor-muted: #7C8DAF;
        }

        .editor-theme-dracula {
          --editor-bg: #282A36;
          --editor-fg: #F8F8F2;
          --editor-border: #44475A;
          --editor-muted: #6272A4;
        }

        .editor-theme-monokai {
          --editor-bg: #272822;
          --editor-fg: #F8F8F2;
          --editor-border: #49483E;
          --editor-muted: #75715E;
        }

        .monaco-container {
          position: relative;
          flex: 1 1 auto;
          width: 100%;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          background: var(--editor-bg);
        }

        .monaco-editor,
        .monaco-editor-background,
        .monaco-editor .margin {
          background-color: var(--editor-bg) !important;
        }

        .monaco-editor .line-numbers {
          font-size: 13px !important;
        }

        .monaco-editor .cursor {
          transition: opacity 0.08s ease;
        }

        .monaco-scrollable-element > .scrollbar > .slider {
          border-radius: 5px;
        }

        .monaco-editor .decorationsOverviewRuler {
          opacity: 0.78;
        }

        .monaco-editor .minimap {
          opacity: 0.82;
          transition: opacity 0.15s ease;
        }

        .monaco-editor .minimap:hover {
          opacity: 1;
        }

        .editor-toolbar {
          display: none !important;
        }

        .empty-editor {
          flex: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--editor-muted);
          background: var(--editor-bg);
          font-family: "Segoe UI", "Segoe UI Variable", Arial, sans-serif;
          text-align: center;
        }

        .empty-editor-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transform: translateY(-18px);
          animation: rohitEditorEmptyIn 0.22s ease-out;
        }

        @keyframes rohitEditorEmptyIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(-18px);
          }
        }

        .empty-editor-logo {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          border: 1px solid #333333;
          border-radius: 13px;
          background: #252526;
          color: #4ec9b0;
          font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
          font-size: 22px;
          font-weight: 700;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
        }

        .editor-theme-light .empty-editor-logo {
          border-color: #dddddd;
          background: #f3f3f3;
          color: #007acc;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .editor-theme-high-contrast .empty-editor-logo {
          border-color: #6fc3df;
          background: #000000;
          color: #ffffff;
        }

        .empty-editor-title {
          color: var(--editor-fg);
          font-family: "Segoe UI", "Segoe UI Variable", Arial, sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .empty-editor-subtitle {
          max-width: 360px;
          color: var(--editor-muted);
          font-family: "Segoe UI", "Segoe UI Variable", Arial, sans-serif;
          font-size: 13px;
          line-height: 1.5;
        }

        .empty-editor-hint {
          margin-top: 10px;
          padding: 7px 11px;
          border: 1px solid #333333;
          border-radius: 5px;
          background: #252526;
          color: #858585;
          font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
          font-size: 11px;
        }

        .editor-theme-light .empty-editor-hint {
          border-color: #d8d8d8;
          background: #f3f3f3;
          color: #666666;
        }

        .editor-theme-high-contrast .empty-editor-hint {
          border-color: #6fc3df;
          background: #000000;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .monaco-editor .minimap {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .empty-editor-content,
          .monaco-editor .cursor,
          .monaco-editor .minimap {
            animation: none;
            transition: none;
          }
        }
      `}</style>


      {/* =================================================
          EDITOR CONTAINER
          ================================================= */}

      <div className="editor-container">


        {/* =================================================
            BREADCRUMBS

            folders is now forwarded so Breadcrumbs can
            resolve the file's real folder name instead of
            falling back to just the project root.
            ================================================= */}

        <Breadcrumbs file={file} folders={folders} />


        {/* =================================================
            TABS

            This is now directly below breadcrumbs.
            No duplicate input.c toolbar.
            ================================================= */}

        <Tabs
          files={files}
          activeFile={activeFile}
          onTabSelect={onTabSelect}
          onTabClose={onTabClose}
          onNewTab={onNewTab}
        />


        {/* =================================================
            MONACO EDITOR
            ================================================= */}

        <div className="monaco-container">

          <Editor
            height="100%"
            width="100%"

            language={file.language || "cpp"}

            value={file.content ?? ""}

            theme={monacoTheme}

            onChange={handleEditorChange}

            onMount={handleEditorMount}

            options={{

              // =============================================
              // FONT
              // =============================================

              fontSize: fontSize || 16,

              fontFamily:
                "'Cascadia Code', 'Fira Code', Consolas, monospace",

              fontLigatures: true,


              // =============================================
              // MINIMAP
              // =============================================

              minimap: {
                enabled: minimap !== false,

                side: "right",

                showSlider: "mouseover",

                renderCharacters: true,

                maxColumn: 120,

                scale: 1,
              },


              // =============================================
              // LAYOUT
              // =============================================

              automaticLayout: true,

              padding: {
                top: 12,
                bottom: 12,
              },

              scrollBeyondLastLine: false,

              scrollBeyondLastColumn: 5,


              // =============================================
              // WORD WRAP
              // =============================================

              wordWrap: wordWrap
                ? "on"
                : "off",

              wordWrapColumn: 120,

              wrappingIndent: "same",


              // =============================================
              // INDENTATION
              // =============================================

              tabSize: Math.max(1, Number(tabSize) || 4),

              insertSpaces: true,

              detectIndentation: false,

              autoIndent: "full",

              trimAutoWhitespace: true,


              // =============================================
              // LINE NUMBERS
              // =============================================

              lineNumbers: lineNumbers === false ? "off" : "on",

              lineNumbersMinChars: 3,

              glyphMargin: false,

              folding: true,

              renderFinalNewline: true,


              // =============================================
              // FOLDING
              // =============================================

              foldingHighlight: true,

              showFoldingControls:
                "mouseover",

              foldingStrategy: "auto",


              // =============================================
              // BRACKETS
              // =============================================

              bracketPairColorization: {
                enabled: true,

                independentColorPoolPerBracketType:
                  true,
              },

              guides: {
                bracketPairs: true,

                bracketPairsHorizontal:
                  "active",

                indentation: true,

                highlightActiveIndentation:
                  true,
              },


              // =============================================
              // CURSOR
              // =============================================

              cursorBlinking: "smooth",

              cursorSmoothCaretAnimation: "on",

              cursorWidth: 2,

              cursorSurroundingLines: 3,

              cursorSurroundingLinesStyle:
                "default",


              // =============================================
              // SMOOTH EDITING
              // =============================================

              smoothScrolling: true,


              // =============================================
              // WHITESPACE
              // =============================================

              renderWhitespace: "selection",

              renderControlCharacters: false,


              // =============================================
              // AUTOCOMPLETE
              // =============================================

              suggestOnTriggerCharacters: true,

              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },

              quickSuggestionsDelay: 10,

              acceptSuggestionOnEnter: "on",

              acceptSuggestionOnCommitCharacter:
                true,

              tabCompletion: "on",

              suggestSelection: "first",

              wordBasedSuggestions:
                "currentDocument",


              // =============================================
              // PARAMETER HINTS
              // =============================================

              parameterHints: {
                enabled: true,

                cycle: true,
              },


              // =============================================
              // FORMATTING
              // =============================================

              formatOnPaste: true,

              formatOnType: true,

              formatOnSave: false,


              // =============================================
              // MOUSE
              // =============================================

              mouseWheelZoom: true,

              multiCursorModifier: "alt",


              // =============================================
              // CONTEXT MENU
              // =============================================

              contextmenu: true,


              // =============================================
              // MULTI CURSOR
              // =============================================

              multiCursorMergeOverlapping:
                true,

              multiCursorPaste: "spread",


              // =============================================
              // SELECTION
              // =============================================

              selectionHighlight: true,

              occurrencesHighlight:
                "singleFile",

              selectionClipboard: true,


              // =============================================
              // LINKS
              // =============================================

              links: true,


              // =============================================
              // DRAG & DROP
              // =============================================

              dragAndDrop: true,

              copyWithSyntaxHighlighting:
                true,


              // =============================================
              // STICKY SCROLL
              // =============================================

              stickyScroll: {
                enabled: true,

                maxLineCount: 5,
              },


              // =============================================
              // SCROLLBAR
              // =============================================

              scrollbar: {
                vertical: "visible",

                horizontal: "visible",

                verticalScrollbarSize: 10,

                horizontalScrollbarSize: 10,

                useShadows: false,

                alwaysConsumeMouseWheel:
                  false,

                verticalHasArrows: false,

                horizontalHasArrows: false,
              },


              // =============================================
              // OVERVIEW RULER
              // =============================================

              overviewRulerBorder: false,


              // =============================================
              // CURRENT LINE
              // =============================================

              renderLineHighlight: "line",

              renderLineHighlightOnlyWhenFocus:
                false,


              // =============================================
              // ACCESSIBILITY
              // =============================================

              accessibilitySupport: "auto",


              // =============================================
              // PERFORMANCE
              // =============================================

              disableLayerHinting: false,

              disableMonospaceOptimizations:
                false,


              // =============================================
              // EDITOR BEHAVIOR
              // =============================================

              emptySelectionClipboard: true,

              showUnused: true,

              showDeprecated: true,


              // =============================================
              // FIND
              // =============================================

              find: {
                addExtraSpaceOnTop: true,

                autoFindInSelection: "never",

                seedSearchStringFromSelection:
                  "always",

                seedSearchStringFromActiveEditor:
                  true,
              },


              // =============================================
              // CODE ACTIONS
              // =============================================

              lightbulb: {
                enabled: "on",
              },


              // =============================================
              // HOVER
              // =============================================

              hover: {
                enabled: true,

                delay: 300,

                sticky: true,
              },


              // =============================================
              // SUGGEST WIDGET
              // =============================================

              suggest: {
                showMethods: true,

                showFunctions: true,

                showConstructors: true,

                showDeprecated: true,

                showFields: true,

                showVariables: true,

                showClasses: true,

                showStructs: true,

                showInterfaces: true,

                showModules: true,

                showProperties: true,

                showEvents: true,

                showOperators: true,

                showUnits: true,

                showValues: true,

                showConstants: true,

                showEnums: true,

                showEnumMembers: true,

                showKeywords: true,

                showWords: true,

                showColors: true,

                showFiles: true,

                showReferences: true,

                showFolders: true,

                showTypeParameters: true,

                showIssues: true,

                showUsers: true,

                showSnippets: true,
              },
            }}
          />

        </div>

      </div>
    </>
  );
}

export default CodeEditor;