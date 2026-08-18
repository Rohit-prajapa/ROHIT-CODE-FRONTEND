// ============================================================
// ROHIT CODE — EDITOR THEMES
//
// Monaco only ships three built-in base themes: "vs", "vs-dark",
// "hc-black". Anything else (Monokai, Dracula, One Dark, GitHub,
// Nord, Solarized...) has to be registered with
// monaco.editor.defineTheme() before it can be selected — just
// pointing monacoTheme at "vs-dark" for all of them (as before)
// meant every "theme" except Dark+/Light+/High Contrast rendered
// identically.
//
// Usage:
//   import { themes, registerCustomThemes } from "./themes";
//
//   // once, when Monaco first loads (e.g. in your editor's
//   // onMount / beforeMount handler):
//   registerCustomThemes(monaco);
//
//   // then apply a theme by id:
//   monaco.editor.setTheme(themes[themeId].monacoTheme);
// ============================================================

export const themes = {
  "vs-dark": {
    name: "Dark+",
    monacoTheme: "vs-dark",
  },

  "vs-light": {
    name: "Light+",
    monacoTheme: "vs",
  },

  "hc-black": {
    name: "High Contrast",
    monacoTheme: "hc-black",
  },

  "monokai": {
    name: "Monokai",
    monacoTheme: "monokai",
  },

  "dracula": {
    name: "Dracula",
    monacoTheme: "dracula",
  },

  "one-dark": {
    name: "One Dark",
    monacoTheme: "one-dark",
  },

  "github-dark": {
    name: "GitHub Dark",
    monacoTheme: "github-dark",
  },

  "github-light": {
    name: "GitHub Light",
    monacoTheme: "github-light",
  },

  "nord": {
    name: "Nord",
    monacoTheme: "nord",
  },

  "solarized-dark": {
    name: "Solarized Dark",
    monacoTheme: "solarized-dark",
  },

  "solarized-light": {
    name: "Solarized Light",
    monacoTheme: "solarized-light",
  },
};

// ============================================================
// TOKEN RULE SHORTHAND
// ============================================================
// Monaco token rules only need a subset of scopes to look right
// for general-purpose editing (comment/keyword/string/number/
// function/type covers the vast majority of visible tokens
// across C/C++/Java/Python/JS/TS/Go/Rust/PHP).

function rules({
  comment,
  keyword,
  string,
  number,
  func,
  type,
  variable,
}) {
  return [
    { token: "comment", foreground: comment, fontStyle: "italic" },
    { token: "keyword", foreground: keyword },
    { token: "string", foreground: string },
    { token: "number", foreground: number },
    { token: "function", foreground: func },
    { token: "type", foreground: type },
    { token: "type.identifier", foreground: type },
    { token: "identifier", foreground: variable },
  ];
}

// ============================================================
// CUSTOM THEME DEFINITIONS
// ============================================================

const customThemeDefinitions = {
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: rules({
      comment: "75715E",
      keyword: "F92672",
      string: "E6DB74",
      number: "AE81FF",
      func: "A6E22E",
      type: "66D9EF",
      variable: "F8F8F2",
    }),
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#F8F8F2",
      "editorLineNumber.foreground": "#75715E",
      "editorCursor.foreground": "#F8F8F0",
      "editor.selectionBackground": "#49483E",
      "editor.lineHighlightBackground": "#3E3D32",
    },
  },

  dracula: {
    base: "vs-dark",
    inherit: true,
    rules: rules({
      comment: "6272A4",
      keyword: "FF79C6",
      string: "F1FA8C",
      number: "BD93F9",
      func: "50FA7B",
      type: "8BE9FD",
      variable: "F8F8F2",
    }),
    colors: {
      "editor.background": "#282A36",
      "editor.foreground": "#F8F8F2",
      "editorLineNumber.foreground": "#6272A4",
      "editorCursor.foreground": "#F8F8F0",
      "editor.selectionBackground": "#44475A",
      "editor.lineHighlightBackground": "#44475A55",
    },
  },

  "one-dark": {
    base: "vs-dark",
    inherit: true,
    rules: rules({
      comment: "5C6370",
      keyword: "C678DD",
      string: "98C379",
      number: "D19A66",
      func: "61AFEF",
      type: "E5C07B",
      variable: "ABB2BF",
    }),
    colors: {
      "editor.background": "#282C34",
      "editor.foreground": "#ABB2BF",
      "editorLineNumber.foreground": "#495162",
      "editorCursor.foreground": "#528BFF",
      "editor.selectionBackground": "#3E4451",
      "editor.lineHighlightBackground": "#2C313C",
    },
  },

  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: rules({
      comment: "8B949E",
      keyword: "FF7B72",
      string: "A5D6FF",
      number: "79C0FF",
      func: "D2A8FF",
      type: "FFA657",
      variable: "C9D1D9",
    }),
    colors: {
      "editor.background": "#0D1117",
      "editor.foreground": "#C9D1D9",
      "editorLineNumber.foreground": "#6E7681",
      "editorCursor.foreground": "#58A6FF",
      "editor.selectionBackground": "#264F78",
      "editor.lineHighlightBackground": "#161B22",
    },
  },

  "github-light": {
    base: "vs",
    inherit: true,
    rules: rules({
      comment: "6E7781",
      keyword: "CF222E",
      string: "0A3069",
      number: "0550AE",
      func: "8250DF",
      type: "953800",
      variable: "24292F",
    }),
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#24292F",
      "editorLineNumber.foreground": "#8C959F",
      "editorCursor.foreground": "#0969DA",
      "editor.selectionBackground": "#B6E3FF",
      "editor.lineHighlightBackground": "#F6F8FA",
    },
  },

  nord: {
    base: "vs-dark",
    inherit: true,
    rules: rules({
      comment: "4C566A",
      keyword: "81A1C1",
      string: "A3BE8C",
      number: "B48EAD",
      func: "88C0D0",
      type: "8FBCBB",
      variable: "D8DEE9",
    }),
    colors: {
      "editor.background": "#2E3440",
      "editor.foreground": "#D8DEE9",
      "editorLineNumber.foreground": "#4C566A",
      "editorCursor.foreground": "#D8DEE9",
      "editor.selectionBackground": "#434C5E",
      "editor.lineHighlightBackground": "#3B4252",
    },
  },

  "solarized-dark": {
    base: "vs-dark",
    inherit: true,
    rules: rules({
      comment: "586E75",
      keyword: "859900",
      string: "2AA198",
      number: "D33682",
      func: "268BD2",
      type: "B58900",
      variable: "839496",
    }),
    colors: {
      "editor.background": "#002B36",
      "editor.foreground": "#839496",
      "editorLineNumber.foreground": "#586E75",
      "editorCursor.foreground": "#839496",
      "editor.selectionBackground": "#073642",
      "editor.lineHighlightBackground": "#073642",
    },
  },

  "solarized-light": {
    base: "vs",
    inherit: true,
    rules: rules({
      comment: "93A1A1",
      keyword: "859900",
      string: "2AA198",
      number: "D33682",
      func: "268BD2",
      type: "B58900",
      variable: "657B83",
    }),
    colors: {
      "editor.background": "#FDF6E3",
      "editor.foreground": "#657B83",
      "editorLineNumber.foreground": "#93A1A1",
      "editorCursor.foreground": "#657B83",
      "editor.selectionBackground": "#EEE8D5",
      "editor.lineHighlightBackground": "#EEE8D5",
    },
  },
};

// ============================================================
// REGISTER
// ============================================================
// Call this once with the Monaco instance before setting any
// custom theme id. Safe to call more than once — defineTheme
// just overwrites the previous definition for the same id.

export function registerCustomThemes(monaco) {
  if (!monaco?.editor?.defineTheme) {
    return;
  }

  Object.entries(customThemeDefinitions).forEach(
    ([themeId, definition]) => {
      monaco.editor.defineTheme(themeId, definition);
    },
  );
}