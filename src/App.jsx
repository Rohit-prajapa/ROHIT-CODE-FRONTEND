import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CodeEditor from "./components/CodeEditor";
import BottomPanel from "./components/BottomPanel";
import CommandPalette from "./components/CommandPalette";
import QuickOpen from "./components/QuickOpen";
import SaveChangesModal from "./components/SaveChangesModal";
import StatusBar from "./components/StatusBar";
import SettingsPanel from "./components/SettingsPanel";

const SOCKET_URL = "https://rohit-code-backend.onrender.com";
const AI_API_URL = "https://rohit-code-backend.onrender.com/api/ai/generate";
const EXECUTION_API_URL = "https://rohit-code-execution-service.onrender.com";

const STORAGE_KEY = "rohit-code-project";
const THEME_STORAGE_KEY = "rohit-code-theme";
const FONT_SIZE_KEY = "rohit-code-font-size";
const WORD_WRAP_KEY = "rohit-code-word-wrap";
const MINIMAP_KEY = "rohit-code-minimap";
const TAB_SIZE_KEY = "rohit-code-tab-size";
const LINE_NUMBERS_KEY = "rohit-code-line-numbers";
const AUTO_SAVE_KEY = "rohit-code-auto-save";
const GEMINI_AI_KEY = "rohit-code-gemini-ai";

// =========================================================
// APP
// =========================================================

function App() {
  // =========================================================
  // REFS
  // =========================================================

  const socketRef = useRef(null);
  const executionStartRef = useRef(null);
  const aiInputRef = useRef(null);
  const interactiveProcessRef = useRef(null);
  const interactivePollRef = useRef(null);
  const interactiveInputEchoRef = useRef([]);

  // =========================================================
  // DEFAULT PROJECT
  // =========================================================

  const defaultCode = `#include <stdio.h>

int main() {
    int a;

    printf("Enter the 1st Number: ");
    scanf("%d", &a);

    int b;

    printf("Enter the 2nd Number: ");
    scanf("%d", &b);

    int sum = a + b;

    printf("Sum = %d", sum);

    return 0;
}`;

  const defaultFiles = [
    {
      id: 1,
      name: "main.c",
      language: "c",
      content: defaultCode,
      savedContent: defaultCode,
      folderId: null,
    },
  ];

  // =========================================================
  // LOAD PROJECT
  // =========================================================

  const getSavedProject = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedProject = getSavedProject();

  // =========================================================
  // PROJECT STATE
  // =========================================================

  const [files, setFiles] = useState(
    savedProject?.files?.length
      ? savedProject.files.map((file) => ({
          ...file,
          folderId: file.folderId ?? null,
          savedContent: file.savedContent ?? file.content ?? "",
        }))
      : defaultFiles,
  );

  const [folders, setFolders] = useState(savedProject?.folders || []);

  const [openFiles, setOpenFiles] = useState(
    savedProject?.openFiles?.length ? savedProject.openFiles : [1],
  );

  const [activeFile, setActiveFile] = useState(
    savedProject?.activeFile ?? savedProject?.files?.[0]?.id ?? 1,
  );

  // =========================================================
  // TERMINAL STATE
  // =========================================================

  const [output, setOutput] = useState([]);

  const [terminalVisible, setTerminalVisible] = useState(true);

  const [activeBottomPanel, setActiveBottomPanel] = useState("terminal");

  // =========================================================
  // UI STATE
  // =========================================================

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [quickOpen, setQuickOpen] = useState(false);

  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const [filePendingClose, setFilePendingClose] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);

  // =========================================================
  // CHEATSHEET STATE
  // =========================================================

  const [activeActivityPanel, setActiveActivityPanel] = useState("explorer");
  const [cheatsheetOpen, setCheatsheetOpen] = useState(false);
  const [selectedCheatsheet, setSelectedCheatsheet] = useState("c.html");

  const cheatsheets = [
    { name: "C", file: "c.html" },
    { name: "C++", file: "cpp.html" },
    { name: "Java", file: "java.html" },
    { name: "Python", file: "python.html" },
    { name: "JavaScript", file: "javascript.html" },
    { name: "TypeScript", file: "typescript.html" },
    { name: "HTML", file: "html.html" },
    { name: "CSS", file: "css.html" },
    { name: "React", file: "react.html" },
    { name: "Node.js", file: "node.html" },
    { name: "Express", file: "express.html" },
    { name: "MongoDB", file: "mongodb.html" },
    { name: "MySQL", file: "mysql.html" },
    { name: "SQL", file: "sql.html" },
    { name: "DSA", file: "dsa.html" },
    { name: "OOPS", file: "oops.html" },
    { name: "OS", file: "os.html" },
    { name: "Computer Networks", file: "computer-networks.html" },
    { name: "Git & GitHub", file: "Git&GitHub.html" },
    { name: "Linux", file: "linux.html" },
    { name: "Bootstrap", file: "bootstrap.html" },
    { name: "Tailwind CSS", file: "tailwindCSS.html" },
    { name: "HTTP / API", file: "http-api.html" },
    { name: "VS Code", file: "vscode.html" },
  ];

  const handleActivityPanelChange = (panel) => {
    setActiveActivityPanel(panel);

    if (panel === "extensions") {
      setCheatsheetOpen(true);
      setActiveActivityPanel("extensions");
    } else if (panel !== "extensions") {
      setCheatsheetOpen(false);
    }
  };

  const openCheatsheet = (file) => {
    setSelectedCheatsheet(file);
    setCheatsheetOpen(true);
    setActiveActivityPanel("extensions");
  };

  // =========================================================
  // EDITOR STATE
  // =========================================================

  const [cursorPosition, setCursorPosition] = useState({
    line: 1,
    column: 1,
  });

  const [executionStatus, setExecutionStatus] = useState("Ready");

  const [executionTime, setExecutionTime] = useState(null);

  // =========================================================
  // SETTINGS
  // =========================================================

  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || "dark",
  );

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);

    return saved ? Number(saved) : 14;
  });

  const [wordWrap, setWordWrap] = useState(
    () => localStorage.getItem(WORD_WRAP_KEY) === "true",
  );

  const [minimap, setMinimap] = useState(
    () => localStorage.getItem(MINIMAP_KEY) !== "false",
  );

  const [tabSize, setTabSize] = useState(() => {
    const saved = localStorage.getItem(TAB_SIZE_KEY);
    return saved ? Number(saved) : 4;
  });

  const [lineNumbers, setLineNumbers] = useState(() => {
    return localStorage.getItem(LINE_NUMBERS_KEY) !== "false";
  });

  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem(AUTO_SAVE_KEY) === "true";
  });

  const [geminiAI, setGeminiAI] = useState(() => {
    return localStorage.getItem(GEMINI_AI_KEY) !== "false";
  });

  // =========================================================
  // GEMINI AI STATE
  // =========================================================

  const [aiOpen, setAiOpen] = useState(false);

  const [aiPrompt, setAiPrompt] = useState("");

  const [aiResponse, setAiResponse] = useState("");

  const [aiLoading, setAiLoading] = useState(false);

  const [aiError, setAiError] = useState("");

  // =========================================================
  // CURRENT FILE
  // =========================================================

  const currentFile = files.find((file) => file.id === activeFile);

  const openFileObjects = openFiles
    .map((id) => files.find((file) => file.id === id))
    .filter(Boolean);

  // =========================================================
  // SOCKET.IO
  // =========================================================

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Rohit Code backend:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);

      setExecutionStatus("Error");
    });

    socket.on("disconnect", (reason) => {
      console.log("Backend disconnected:", reason);
    });

    // =======================================================
    // PROGRAM OUTPUT
    // =======================================================

    socket.on("terminal-output", (payload = {}) => {
      const data = typeof payload === "string" ? payload : payload.data;

      if (data === undefined || data === null) {
        return;
      }

      const text = String(data);

      if (!text) return;

      setOutput((previous) => {
        const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        const chunks = normalized.split("\n");

        const updated = [...previous];

        if (!updated.length) {
          return chunks;
        }

        updated[updated.length - 1] =
          String(updated[updated.length - 1] ?? "") + chunks[0];

        if (chunks.length > 1) {
          updated.push(...chunks.slice(1));
        }

        return updated;
      });
    });

    // =======================================================
    // PROGRAM FINISHED
    // =======================================================

    socket.on("program-finished", ({ exitCode } = {}) => {
      const code = Number.isInteger(exitCode) ? exitCode : 1;

      if (executionStartRef.current) {
        const elapsed = Date.now() - executionStartRef.current;

        setExecutionTime(`${(elapsed / 1000).toFixed(2)}s`);
      }

      executionStartRef.current = null;

      setExecutionStatus(code === 0 ? "Success" : "Error");
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();

      socketRef.current = null;

      if (interactivePollRef.current) {
        clearInterval(interactivePollRef.current);
        interactivePollRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(WORD_WRAP_KEY, String(wordWrap));
  }, [wordWrap]);

  useEffect(() => {
    localStorage.setItem(MINIMAP_KEY, String(minimap));
  }, [minimap]);

  useEffect(() => {
    localStorage.setItem(TAB_SIZE_KEY, String(tabSize));
  }, [tabSize]);

  useEffect(() => {
    localStorage.setItem(LINE_NUMBERS_KEY, String(lineNumbers));
  }, [lineNumbers]);

  useEffect(() => {
    localStorage.setItem(AUTO_SAVE_KEY, String(autoSave));
  }, [autoSave]);

  useEffect(() => {
    localStorage.setItem(GEMINI_AI_KEY, String(geminiAI));
  }, [geminiAI]);

  // =========================================================
  // AUTO SAVE PROJECT
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        files,
        folders,
        openFiles,
        activeFile,
      }),
    );
  }, [files, folders, openFiles, activeFile]);

  // =========================================================
  // LANGUAGE
  // =========================================================

  const getLanguageFromExtension = (name) => {
    const extension = name.split(".").pop().toLowerCase();

    const languages = {
      c: "c",
      cpp: "cpp",
      cc: "cpp",
      h: "cpp",
      hpp: "cpp",

      py: "python",
      java: "java",

      js: "javascript",
      jsx: "javascript",

      ts: "typescript",
      tsx: "typescript",
      rs: "rust",
      php: "php",

      html: "html",
      css: "css",
      json: "json",

      sh: "shell",
      bash: "shell",

      xml: "xml",
      sql: "sql",
      rb: "ruby",
      kt: "kotlin",
    };

    return languages[extension] || "plaintext";
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = () => {
    const updatedFiles = files.map((file) => ({
      ...file,
      savedContent: file.content,
    }));

    setFiles(updatedFiles);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        files: updatedFiles,
        folders,
        openFiles,
        activeFile,
      }),
    );

    setOutput(["✓ Project saved successfully."]);
  };

  // =========================================================
  // CREATE FOLDER
  // =========================================================

  const handleCreateFolder = (folderName) => {
    const name = folderName.trim();

    if (!name) return;

    const exists = folders.some(
      (folder) => folder.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      alert("Folder already exists.");

      return;
    }

    setFolders((previous) => [
      ...previous,
      {
        id: Date.now(),
        name,
        expanded: true,
      },
    ]);
  };

  // =========================================================
  // CREATE FILE
  // =========================================================

  const handleCreateFile = (fileName, folderId = null) => {
    const name = fileName.trim();

    if (!name) return;

    const exists = files.some(
      (file) =>
        file.name.toLowerCase() === name.toLowerCase() &&
        file.folderId === folderId,
    );

    if (exists) {
      alert("File already exists.");

      return;
    }

    const newFile = {
      id: Date.now(),
      name,
      language: getLanguageFromExtension(name),
      content: "",
      savedContent: "",
      folderId,
    };

    setFiles((previous) => [...previous, newFile]);

    setOpenFiles((previous) => [...previous, newFile.id]);

    setActiveFile(newFile.id);
  };

  // =========================================================
  // DELETE FILE
  // =========================================================

  const handleDeleteFile = (fileId) => {
    if (files.length === 1) {
      alert("You must keep at least one file.");

      return;
    }

    const remaining = files.filter((file) => file.id !== fileId);

    setFiles(remaining);

    setOpenFiles((previous) => previous.filter((id) => id !== fileId));

    if (activeFile === fileId) {
      setActiveFile(remaining[0].id);
    }

    setOutput([]);
  };

  // =========================================================
  // RENAME FILE
  // =========================================================

  const handleRenameFile = (fileId, newName) => {
    const name = newName.trim();

    if (!name) return;

    setFiles((previous) =>
      previous.map((file) =>
        file.id === fileId
          ? {
              ...file,
              name,
              language: getLanguageFromExtension(name),
            }
          : file,
      ),
    );
  };

  // =========================================================
  // FILE SELECT
  // =========================================================

  const handleFileSelect = (fileId) => {
    setActiveFile(fileId);

    setOpenFiles((previous) =>
      previous.includes(fileId) ? previous : [...previous, fileId],
    );

    setOutput([]);

    setCursorPosition({
      line: 1,
      column: 1,
    });
  };

  // =========================================================
  // TAB SELECT
  // =========================================================

  const handleTabSelect = (fileId) => {
    setActiveFile(fileId);
    setOutput([]);
  };

  // =========================================================
  // CLOSE TAB
  // =========================================================

  const closeTabImmediately = (fileId) => {
    const remaining = openFiles.filter((id) => id !== fileId);

    if (!remaining.length) {
      return;
    }

    setOpenFiles(remaining);

    if (activeFile === fileId) {
      setActiveFile(remaining[0]);
    }
  };

  const handleTabClose = (fileId) => {
    const file = files.find((item) => item.id === fileId);

    if (!file) return;

    if (file.content !== file.savedContent) {
      setFilePendingClose(fileId);

      setSaveModalOpen(true);

      return;
    }

    closeTabImmediately(fileId);
  };

  // =========================================================
  // SAVE MODAL
  // =========================================================

  const handleModalSave = () => {
    if (!filePendingClose) {
      return;
    }

    setFiles((previous) =>
      previous.map((file) =>
        file.id === filePendingClose
          ? {
              ...file,
              savedContent: file.content,
            }
          : file,
      ),
    );

    closeTabImmediately(filePendingClose);

    setFilePendingClose(null);
    setSaveModalOpen(false);
  };

  const handleModalDontSave = () => {
    if (!filePendingClose) {
      return;
    }

    closeTabImmediately(filePendingClose);

    setFilePendingClose(null);
    setSaveModalOpen(false);
  };

  const handleModalCancel = () => {
    setFilePendingClose(null);
    setSaveModalOpen(false);
  };

  // =========================================================
  // NEW TAB
  // =========================================================

  const handleNewTab = () => {
    const unopened = files.find((file) => !openFiles.includes(file.id));

    if (unopened) {
      setOpenFiles((previous) => [...previous, unopened.id]);

      setActiveFile(unopened.id);

      return;
    }

    handleCreateFile(`untitled-${files.length + 1}.cpp`);
  };

  // =========================================================
  // CODE CHANGE
  // =========================================================

  const handleCodeChange = (fileId, code) => {
    setExecutionStatus("Ready");
    setExecutionTime(null);

    setFiles((previous) =>
      previous.map((file) =>
        file.id === fileId
          ? {
              ...file,
              content: code,
            }
          : file,
      ),
    );
  };

  // =========================================================
  // LANGUAGE CHANGE
  // =========================================================

  const handleLanguageChange = (language) => {
    if (!currentFile) return;

    setFiles((previous) =>
      previous.map((file) =>
        file.id === currentFile.id
          ? {
              ...file,
              language,
            }
          : file,
      ),
    );
  };

  // =========================================================
  // RUN PROGRAM
  // =========================================================

  const handleRun = async () => {
    if (!currentFile) {
      return;
    }

    if (!currentFile.content || !currentFile.content.trim()) {
      setOutput(["❌ Code is empty."]);
      setExecutionStatus("Error");
      setTerminalVisible(true);
      setActiveBottomPanel("terminal");
      return;
    }

    if (interactivePollRef.current) {
      clearInterval(interactivePollRef.current);
      interactivePollRef.current = null;
    }

    interactiveProcessRef.current = null;
    interactiveInputEchoRef.current = [];
    executionStartRef.current = Date.now();

    setExecutionStatus("Running");
    setExecutionTime(null);
    setTerminalVisible(true);
    setActiveBottomPanel("terminal");

    setOutput([`> Running ${currentFile.name}...`, ""]);

    try {
      const response = await fetch(
        `${EXECUTION_API_URL}/api/interactive/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: currentFile.language,
            code: currentFile.content,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.output ||
            "Failed to start interactive process.",
        );
      }

      const processId = result.processId;

      if (!processId) {
        throw new Error("Execution service did not return a process ID.");
      }

      interactiveProcessRef.current = processId;

      interactivePollRef.current = setInterval(async () => {
        try {
          const outputResponse = await fetch(
            `${EXECUTION_API_URL}/api/interactive/output/${processId}`,
          );

          const outputResult = await outputResponse.json();

          if (!outputResponse.ok || !outputResult.success) {
            return;
          }

          const text = String(outputResult.output || "");

          if (text) {
            // PTY programs on Windows emit ANSI/OSC terminal
            // control sequences. Remove them before displaying
            // output in the React terminal.
            const cleanTerminalOutput = (value) => {
              return (
                String(value || "")
                  // Remove OSC escape sequences
                  .replace(/\x1B\][^\x07]*(?:\x07|\x1B\\)/g, "")

                  // Remove ANSI CSI sequences
                  .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "")

                  // Remove remaining ANSI escape sequences
                  .replace(/\x1B[@-_]/g, "")

                  // Remove C1 control sequences
                  .replace(/[\x80-\x9F]/g, "")

                  // Normalize line endings
                  .replace(/\r\n/g, "\n")
                  .replace(/\r/g, "")

                  // Remove unwanted terminal control remnants
                  .replace(/\?[0-9;]*[a-zA-Z]/g, "")

                  // Remove excessive blank lines
                  .replace(/\n{3,}/g, "\n")

                  .trim()
              );
            };

            const normalized = cleanTerminalOutput(text);

            if (normalized) {
              // The PTY echoes characters typed by the user. The terminal UI
              // already renders the typed value locally, so remove only the
              // matching pending input echo from process output. This prevents
              // output such as 4 / 4, 5 / 5, 6 / 6 from appearing twice.
              const pendingEchoes = interactiveInputEchoRef.current;
              let filteredText = normalized;

              if (pendingEchoes.length) {
                const lines = filteredText.split("\n");
                const filteredLines = [];

                for (let line of lines) {
                  let currentLine = String(line);
                  let consumed = false;

                  while (pendingEchoes.length) {
                    const expected = String(pendingEchoes[0] ?? "");

                    if (!expected) {
                      pendingEchoes.shift();
                      continue;
                    }

                    const lineTrimmed = currentLine.trim();
                    const expectedTrimmed = expected.trim();

                    if (lineTrimmed === expectedTrimmed) {
                      pendingEchoes.shift();
                      currentLine = "";
                      consumed = true;
                      break;
                    }

                    // Handles prompts that do not end with a newline, e.g.
                    // "Enter number: 4" where "4" is the PTY echo.
                    if (
                      expectedTrimmed &&
                      lineTrimmed.endsWith(expectedTrimmed) &&
                      lineTrimmed.length > expectedTrimmed.length
                    ) {
                      pendingEchoes.shift();
                      const suffixIndex = currentLine
                        .toLowerCase()
                        .lastIndexOf(expectedTrimmed.toLowerCase());

                      if (suffixIndex >= 0) {
                        currentLine = currentLine.slice(0, suffixIndex);
                      }
                      break;
                    }

                    break;
                  }

                  // Keep empty lines that are real program output, but discard
                  // a line that existed only for the local input echo.
                  if (!consumed || currentLine !== "") {
                    filteredLines.push(currentLine);
                  }
                }

                filteredText = filteredLines.join("\n");
              }

              if (filteredText) {
                const chunks = filteredText.split("\n");

                setOutput((previous) => {
                  const updated = Array.isArray(previous) ? [...previous] : [];

                  if (!updated.length) {
                    return chunks;
                  }

                  updated[updated.length - 1] =
                    String(updated[updated.length - 1] ?? "") + chunks[0];

                  if (chunks.length > 1) {
                    updated.push(...chunks.slice(1));
                  }

                  return updated;
                });
              }
            }
          }

          if (outputResult.finished) {
            if (interactivePollRef.current) {
              clearInterval(interactivePollRef.current);
              interactivePollRef.current = null;
            }

            interactiveProcessRef.current = null;
            interactiveInputEchoRef.current = [];

            if (executionStartRef.current) {
              const elapsed = Date.now() - executionStartRef.current;

              setExecutionTime(`${(elapsed / 1000).toFixed(2)}s`);
            }

            executionStartRef.current = null;

            if (outputResult.timedOut) {
              setOutput((previous) => [
                ...(Array.isArray(previous) ? previous : []),
                "",
                "⏱ Program timed out.",
              ]);

              setExecutionStatus("Error");
            } else {
              setExecutionStatus(
                Number(outputResult.exitCode) === 0 ? "Success" : "Error",
              );
            }
          }
        } catch (error) {
          console.error("Interactive output error:", error);
        }
      }, 300);
    } catch (error) {
      console.error("Interactive start error:", error);

      setOutput([`❌ ${error.message || "Unable to start program."}`]);

      setExecutionStatus("Error");
      executionStartRef.current = null;
      interactiveProcessRef.current = null;
    }
  };

  // =========================================================
  // TERMINAL INPUT
  // =========================================================

  const handleTerminalInput = async (input) => {
    const processId = interactiveProcessRef.current;

    if (!processId) {
      return;
    }

    try {
      const normalizedInput = String(input ?? "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

      const inputLines = normalizedInput
        .split("\n")
        .filter((line) => line.length > 0);

      if (inputLines.length) {
        interactiveInputEchoRef.current.push(...inputLines);
      }

      const response = await fetch(
        `${EXECUTION_API_URL}/api/interactive/input`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            processId,
            input: String(input ?? ""),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("Interactive input failed:", result.message);
      }
    } catch (error) {
      console.error("Interactive input error:", error);
    }
  };

  // =========================================================
  // STOP EXECUTION
  // =========================================================

  const handleStopExecution = async () => {
    const processId = interactiveProcessRef.current;

    if (interactivePollRef.current) {
      clearInterval(interactivePollRef.current);
      interactivePollRef.current = null;
    }

    if (processId) {
      try {
        await fetch(`${EXECUTION_API_URL}/api/interactive/stop`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            processId,
          }),
        });
      } catch (error) {
        console.error("Stop interactive process error:", error);
      }
    }

    interactiveProcessRef.current = null;
    interactiveInputEchoRef.current = [];
    executionStartRef.current = null;

    setExecutionStatus("Ready");
    setExecutionTime(null);
  };

  // =========================================================
  // CLEAR TERMINAL
  // =========================================================

  const handleClearTerminal = () => {
    interactiveInputEchoRef.current = [];
    setOutput([]);
    setExecutionStatus("Ready");
    setExecutionTime(null);
  };

  // =========================================================
  // =========================================================
  // GEMINI AI
  // =========================================================
  // =========================================================

  const openAI = () => {
    if (!geminiAI) return;

    setAiOpen(true);

    setTimeout(() => {
      aiInputRef.current?.focus();
    }, 50);
  };

  const closeAI = () => {
    if (!aiLoading) {
      setAiOpen(false);
    }
  };

  // =========================================================
  // GENERATE AI CODE
  // =========================================================

  const handleGenerateAI = async () => {
    const prompt = aiPrompt.trim();

    if (!prompt) {
      setAiError("Please enter a request.");

      return;
    }

    if (!currentFile) {
      setAiError("Please open a file first.");

      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiResponse("");

    try {
      const response = await fetch(AI_API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt,
          language: currentFile.language,
          currentCode: currentFile.content || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "AI request failed.");
      }

      if (!data?.success || !data?.code) {
        throw new Error(data?.message || "Gemini did not return code.");
      }

      setAiResponse(data.code);
    } catch (error) {
      console.error("Gemini AI error:", error);

      setAiError(error.message || "Could not connect to Gemini.");
    } finally {
      setAiLoading(false);
    }
  };

  // =========================================================
  // INSERT AI CODE
  // =========================================================

  const handleInsertAI = () => {
    if (!currentFile || !aiResponse) {
      return;
    }

    handleCodeChange(currentFile.id, aiResponse);

    setOutput(["✓ Gemini code inserted into editor."]);

    setAiOpen(false);
  };

  // =========================================================
  // COPY AI CODE
  // =========================================================

  const handleCopyAI = async () => {
    if (!aiResponse) {
      return;
    }

    try {
      await navigator.clipboard.writeText(aiResponse);

      setOutput(["✓ AI code copied to clipboard."]);
    } catch {
      setAiError("Could not copy code.");
    }
  };

  // =========================================================
  // CLEAR AI
  // =========================================================

  const handleClearAI = () => {
    setAiPrompt("");
    setAiResponse("");
    setAiError("");
  };

  // =========================================================
  // RESET SETTINGS
  // =========================================================

  const handleResetSettings = () => {
    setTheme("dark");
    setFontSize(14);
    setWordWrap(false);
    setMinimap(true);
    setTabSize(4);
    setLineNumbers(true);
    setAutoSave(false);
    setGeminiAI(true);

    localStorage.removeItem(THEME_STORAGE_KEY);
    localStorage.removeItem(FONT_SIZE_KEY);
    localStorage.removeItem(WORD_WRAP_KEY);
    localStorage.removeItem(MINIMAP_KEY);
    localStorage.removeItem(TAB_SIZE_KEY);
    localStorage.removeItem(LINE_NUMBERS_KEY);
    localStorage.removeItem(AUTO_SAVE_KEY);
    localStorage.removeItem(GEMINI_AI_KEY);

    setOutput(["✓ Settings reset to default."]);
  };

  // =========================================================
  // COMMAND PALETTE
  // =========================================================

  const handleCommandNewFile = () => {
    handleCreateFile(`untitled-${files.length + 1}.cpp`);
  };

  const handleCommandCloseTab = () => {
    if (currentFile) {
      handleTabClose(currentFile.id);
    }
  };

  const handleCommandSearch = () => {
    window.dispatchEvent(new CustomEvent("rohit-code-search"));

    setCommandPaletteOpen(false);
  };

  // =========================================================
  // KEYBOARD SHORTCUTS
  // =========================================================

  useEffect(() => {
    const handleKeyboard = (event) => {
      const ctrl = event.ctrlKey || event.metaKey;

      // Ctrl + S
      if (ctrl && event.key.toLowerCase() === "s") {
        event.preventDefault();

        handleSave();
      }

      // Ctrl + Enter
      if (ctrl && event.key === "Enter") {
        event.preventDefault();

        if (executionStatus !== "Running") {
          handleRun();
        }
      }

      // Ctrl + W
      if (ctrl && event.key.toLowerCase() === "w") {
        event.preventDefault();

        if (currentFile) {
          handleTabClose(currentFile.id);
        }
      }

      // Ctrl + Shift + P
      if (ctrl && event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();

        setCommandPaletteOpen((previous) => !previous);

        setQuickOpen(false);
      }

      // Ctrl + P
      if (ctrl && !event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();

        setQuickOpen(true);

        setCommandPaletteOpen(false);
      }

      // Ctrl + `
      if (ctrl && event.key === "`") {
        event.preventDefault();

        setTerminalVisible((previous) => !previous);
      }

      // Ctrl + Shift + A
      if (ctrl && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();

        if (geminiAI) {
          openAI();
        }
      }

      // Escape
      if (event.key === "Escape") {
        setCommandPaletteOpen(false);

        setQuickOpen(false);

        setSettingsOpen(false);

        setCheatsheetOpen(false);

        if (aiOpen && !aiLoading) {
          setAiOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [
    currentFile,
    executionStatus,
    files,
    openFiles,
    aiOpen,
    aiLoading,
    geminiAI,
  ]);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className={`app theme-${theme}`}>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header
        onRun={handleRun}
        onSave={handleSave}
        language={currentFile?.language || "cpp"}
        onLanguageChange={handleLanguageChange}
        onSettings={() => setSettingsOpen((previous) => !previous)}
        onAI={geminiAI ? openAI : undefined}
        onToggleTerminal={() => setTerminalVisible((previous) => !previous)}
      />

      {/* =====================================================
          SETTINGS
      ====================================================== */}

      {settingsOpen && (
        <SettingsPanel
          theme={theme}
          fontSize={fontSize}
          minimap={minimap}
          wordWrap={wordWrap}
          tabSize={tabSize}
          lineNumbers={lineNumbers}
          autoSave={autoSave}
          geminiAI={geminiAI}
          onThemeChange={setTheme}
          onFontSizeChange={setFontSize}
          onMinimapChange={setMinimap}
          onWordWrapChange={setWordWrap}
          onTabSizeChange={setTabSize}
          onLineNumbersChange={setLineNumbers}
          onAutoSaveChange={setAutoSave}
          onGeminiAIChange={setGeminiAI}
          onClose={() => setSettingsOpen(false)}
          onReset={handleResetSettings}
        />
      )}

      {/* =====================================================
          GEMINI AI PANEL
      ====================================================== */}

      {aiOpen && (
        <div className="rohit-ai-overlay">
          <div className="rohit-ai-panel">
            <div className="rohit-ai-header">
              <div>
                <strong>✦ Gemini AI</strong>

                <span>ROHIT-CODE Assistant</span>
              </div>

              <button
                type="button"
                onClick={closeAI}
                disabled={aiLoading}
                title="Close AI"
              >
                ×
              </button>
            </div>

            <div className="rohit-ai-context">
              <span>Language:</span>

              <strong>{currentFile?.language || "Unknown"}</strong>

              <span>File:</span>

              <strong>{currentFile?.name || "No file"}</strong>
            </div>

            <div className="rohit-ai-input-area">
              <textarea
                ref={aiInputRef}
                value={aiPrompt}
                onChange={(event) => setAiPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();

                    if (!aiLoading) {
                      handleGenerateAI();
                    }
                  }
                }}
                placeholder={
                  "Ask Gemini anything...\n\nExample:\nGive me prime number code\nExplain this code\nFix this error\nOptimize my code"
                }
                disabled={aiLoading}
              />

              <div className="rohit-ai-input-footer">
                <span>Enter to send • Shift + Enter for new line</span>

                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={aiLoading || !aiPrompt.trim()}
                >
                  {aiLoading ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>

            {aiError && <div className="rohit-ai-error">❌ {aiError}</div>}

            {aiResponse && (
              <div className="rohit-ai-result">
                <div className="rohit-ai-result-header">
                  <span>Generated Code</span>

                  <div>
                    <button type="button" onClick={handleCopyAI}>
                      Copy
                    </button>

                    <button type="button" onClick={handleInsertAI}>
                      Insert into Editor
                    </button>
                  </div>
                </div>

                <pre>{aiResponse}</pre>
              </div>
            )}

            {!aiResponse && !aiLoading && !aiError && (
              <div className="rohit-ai-empty">
                <div className="rohit-ai-empty-icon">✦</div>

                <strong>Ask Gemini to help you code</strong>

                <p>
                  Generate code, explain code, fix errors, optimize programs and
                  more.
                </p>

                <div className="rohit-ai-examples">
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Give me prime number code")}
                  >
                    Prime number
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPrompt("Explain my current code")}
                  >
                    Explain code
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setAiPrompt("Find and fix errors in my current code")
                    }
                  >
                    Fix errors
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPrompt("Optimize my current code")}
                  >
                    Optimize
                  </button>
                </div>
              </div>
            )}

            {aiLoading && (
              <div className="rohit-ai-loading">
                <div className="rohit-ai-spinner">✦</div>

                <span>Gemini is generating your code...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN LAYOUT
      ====================================================== */}

      <div className="main-layout">
  
        {/* ===================================================
            SIDEBAR
        ==================================================== */}

        <Sidebar
          files={files}
          folders={folders}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onDeleteFile={handleDeleteFile}
          onRenameFile={handleRenameFile}
          onRun={handleRun}
          onStop={handleStopExecution}
          isRunning={executionStatus === "Running"}
        />

        {/* ===================================================
            MAIN AREA
        ==================================================== */}

        <main className="main-area">

          {cheatsheetOpen && (
            <div className="rohit-cheatsheet-overlay">
              <div className="rohit-cheatsheet-panel">
                <div className="rohit-cheatsheet-header">
                  <div className="rohit-cheatsheet-title">
                    <strong>CodeWithRohit Cheatsheets</strong>
                    <span>Quick programming reference</span>
                  </div>

                  <button
                    type="button"
                    className="rohit-cheatsheet-close"
                    onClick={() => {
                      setCheatsheetOpen(false);
                      setActiveActivityPanel("explorer");
                    }}
                    title="Close Cheatsheet"
                    aria-label="Close Cheatsheet"
                  >
                    ×
                  </button>
                </div>

                <div className="rohit-cheatsheet-body">
                  <aside className="rohit-cheatsheet-list">
                    <div className="rohit-cheatsheet-list-title">
                      CHEATSHEETS
                    </div>

                    {cheatsheets.map((item) => (
                      <button
                        key={item.file}
                        type="button"
                        className={`rohit-cheatsheet-item ${
                          selectedCheatsheet === item.file ? "active" : ""
                        }`}
                        onClick={() => openCheatsheet(item.file)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </aside>

                  <section className="rohit-cheatsheet-content">
                    <iframe
                      key={selectedCheatsheet}
                      title="ROHIT-CODE Cheatsheet"
                      src={`/cheatsheet/cheatsheets/${encodeURIComponent(
                        selectedCheatsheet,
                      )}`}
                      className="rohit-cheatsheet-frame"
                    />
                  </section>
                </div>
              </div>
            </div>
          )}
          {/* =================================================
              CODE EDITOR
          ================================================== */}

          <CodeEditor
            file={currentFile}
            files={openFileObjects}
            activeFile={activeFile}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
            onNewTab={handleNewTab}
            onCodeChange={handleCodeChange}
            output={output}
            setOutput={setOutput}
            terminalVisible={terminalVisible}
            onToggleTerminal={() => setTerminalVisible((previous) => !previous)}
            onCursorPositionChange={setCursorPosition}
            theme={theme}
            fontSize={fontSize}
            wordWrap={wordWrap}
            minimap={minimap}
            tabSize={tabSize}
            lineNumbers={lineNumbers}
          />

          {/* =================================================
              BOTTOM TERMINAL
          ================================================== */}

          {terminalVisible && (
            <section className="bottom-panel-area">
              <BottomPanel
                activePanel={activeBottomPanel}
                onPanelChange={setActiveBottomPanel}
                output={output}
                problems={[]}
                onClose={() => setTerminalVisible(false)}
                onTerminalInput={handleTerminalInput}
                onStopExecution={handleStopExecution}
                isRunning={executionStatus === "Running"}
              />
            </section>
          )}

          {/* =================================================
              STATUS BAR
          ================================================== */}

          <StatusBar
            file={currentFile}
            cursorPosition={cursorPosition}
            status={executionStatus}
            executionTime={executionTime}
          />

          {/* =================================================
              COMMAND PALETTE
          ================================================== */}

          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            onRun={handleRun}
            onSave={handleSave}
            onNewFile={handleCommandNewFile}
            onSearch={handleCommandSearch}
            onClearTerminal={handleClearTerminal}
            onCloseTab={handleCommandCloseTab}
          />

          {/* =================================================
              QUICK OPEN
          ================================================== */}

          <QuickOpen
            isOpen={quickOpen}
            files={files}
            activeFile={activeFile}
            onSelectFile={handleFileSelect}
            onClose={() => setQuickOpen(false)}
          />

          {/* =================================================
              SAVE MODAL
          ================================================== */}

          <SaveChangesModal
            isOpen={saveModalOpen}
            fileName={
              files.find((file) => file.id === filePendingClose)?.name || ""
            }
            onSave={handleModalSave}
            onDontSave={handleModalDontSave}
            onCancel={handleModalCancel}
          />
        </main>
      </div>

      {/* =====================================================
          AI STYLES
      ====================================================== */}

      <style>{`
        /* ==============================================
           CHEATSHEET
        ============================================== */

        .rohit-cheatsheet-overlay {
          position: absolute;
          inset: 0;
          z-index: 25000;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          background: #1e1e1e;
        }

        .rohit-cheatsheet-panel {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #1e1e1e;
          color: #cccccc;
          font-family: "Segoe UI", Inter, system-ui, sans-serif;
        }

        .rohit-cheatsheet-header {
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px 0 16px;
          background: #252526;
          border-bottom: 1px solid #3a3a3a;
        }

        .rohit-cheatsheet-title {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rohit-cheatsheet-title strong {
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
        }

        .rohit-cheatsheet-title span {
          color: #858585;
          font-size: 10px;
        }

        .rohit-cheatsheet-close {
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 4px;
          background: transparent;
          color: #858585;
          font-size: 22px;
          cursor: pointer;
        }

        .rohit-cheatsheet-close:hover {
          background: #3a3a3a;
          color: #ffffff;
        }

        .rohit-cheatsheet-body {
          min-height: 0;
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .rohit-cheatsheet-list {
          width: 190px;
          min-width: 190px;
          overflow-y: auto;
          padding: 8px 0;
          background: #181818;
          border-right: 1px solid #303030;
        }

        .rohit-cheatsheet-list-title {
          padding: 7px 14px;
          color: #858585;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .6px;
        }

        .rohit-cheatsheet-item {
          width: 100%;
          min-height: 32px;
          padding: 0 14px;
          border: 0;
          border-left: 2px solid transparent;
          background: transparent;
          color: #aaaaaa;
          text-align: left;
          font-size: 12px;
          cursor: pointer;
        }

        .rohit-cheatsheet-item:hover {
          background: #252526;
          color: #ffffff;
        }

        .rohit-cheatsheet-item.active {
          background: #37373d;
          border-left-color: #007acc;
          color: #ffffff;
        }

        .rohit-cheatsheet-content {
          min-width: 0;
          min-height: 0;
          flex: 1;
          background: #ffffff;
        }

        .rohit-cheatsheet-frame {
          width: 100%;
          height: 100%;
          display: block;
          border: 0;
          background: #ffffff;
        }

        @media (max-width: 700px) {
          .rohit-cheatsheet-list {
            width: 145px;
            min-width: 145px;
          }

          .rohit-cheatsheet-item {
            padding-left: 10px;
            font-size: 11px;
          }
        }

        /* ==============================================
           AI OVERLAY
        ============================================== */

        .rohit-ai-overlay {
          position: fixed;
          inset: 0;

          z-index: 30000;

          display: flex;
          justify-content: flex-end;
          align-items: flex-start;

          padding-top: 55px;
          padding-right: 20px;

          background: rgba(0, 0, 0, 0.25);
        }

        /* ==============================================
           AI PANEL
        ============================================== */

        .rohit-ai-panel {
          width: min(
            720px,
            calc(100vw - 40px)
          );

          max-height: calc(
            100vh - 80px
          );

          display: flex;
          flex-direction: column;

          overflow: hidden;

          background: #1e1e1e;

          border: 1px solid #454545;
          border-radius: 8px;

          box-shadow:
            0 20px 60px
              rgba(0, 0, 0, 0.65);

          color: #cccccc;

          font-family:
            "Segoe UI",
            Inter,
            sans-serif;
        }

        /* ==============================================
           AI HEADER
        ============================================== */

        .rohit-ai-header {
          min-height: 54px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 16px;

          background: #252526;

          border-bottom: 1px solid #3a3a3a;
        }

        .rohit-ai-header > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .rohit-ai-header strong {
          color: #ffffff;
          font-size: 15px;
        }

        .rohit-ai-header span {
          color: #858585;
          font-size: 11px;
        }

        .rohit-ai-header > button {
          width: 30px;
          height: 30px;

          border: 0;
          border-radius: 4px;

          background: transparent;

          color: #858585;

          font-size: 22px;

          cursor: pointer;
        }

        .rohit-ai-header > button:hover {
          background: #3a3a3a;
          color: #ffffff;
        }

        .rohit-ai-header > button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ==============================================
           AI CONTEXT
        ============================================== */

        .rohit-ai-context {
          min-height: 34px;

          display: flex;
          align-items: center;

          gap: 7px;

          padding: 0 16px;

          background: #181818;

          border-bottom: 1px solid #303030;

          color: #858585;

          font-size: 11px;
        }

        .rohit-ai-context strong {
          color: #cccccc;
          margin-right: 10px;
        }

        /* ==============================================
           AI INPUT
        ============================================== */

        .rohit-ai-input-area {
          padding: 12px;
        }

        .rohit-ai-input-area textarea {
          width: 100%;
          min-height: 105px;

          resize: vertical;

          box-sizing: border-box;

          padding: 12px;

          outline: none;

          border: 1px solid #3f3f46;
          border-radius: 5px;

          background: #181818;

          color: #ffffff;

          font-family:
            "Segoe UI",
            Inter,
            sans-serif;

          font-size: 13px;

          line-height: 1.5;
        }

        .rohit-ai-input-area textarea:focus {
          border-color: #007acc;
        }

        .rohit-ai-input-area textarea::placeholder {
          color: #666666;
        }

        .rohit-ai-input-area textarea:disabled {
          opacity: 0.6;
        }

        .rohit-ai-input-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 8px;
        }

        .rohit-ai-input-footer span {
          color: #707070;
          font-size: 10px;
        }

        .rohit-ai-input-footer button {
          min-width: 95px;
          height: 32px;

          padding: 0 13px;

          border: 0;
          border-radius: 4px;

          background: #007acc;

          color: #ffffff;

          font-size: 12px;
          font-weight: 600;

          cursor: pointer;
        }

        .rohit-ai-input-footer button:hover {
          background: #0e8ad9;
        }

        .rohit-ai-input-footer button:disabled {
          background: #333333;
          color: #707070;
          cursor: not-allowed;
        }

        /* ==============================================
           AI ERROR
        ============================================== */

        .rohit-ai-error {
          margin: 0 12px 12px;

          padding: 10px 12px;

          border: 1px solid #5a2828;
          border-radius: 4px;

          background: #2b1b1b;

          color: #f48771;

          font-size: 12px;
        }

        /* ==============================================
           AI RESULT
        ============================================== */

        .rohit-ai-result {
          margin: 0 12px 12px;

          overflow: hidden;

          border: 1px solid #3a3a3a;
          border-radius: 5px;

          background: #181818;
        }

        .rohit-ai-result-header {
          min-height: 40px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 10px;

          background: #252526;

          border-bottom: 1px solid #3a3a3a;
        }

        .rohit-ai-result-header > span {
          color: #cccccc;
          font-size: 12px;
          font-weight: 600;
        }

        .rohit-ai-result-header > div {
          display: flex;
          gap: 6px;
        }

        .rohit-ai-result-header button {
          height: 27px;

          padding: 0 9px;

          border: 1px solid #454545;
          border-radius: 4px;

          background: #2d2d2d;

          color: #cccccc;

          font-size: 10px;

          cursor: pointer;
        }

        .rohit-ai-result-header button:hover {
          background: #094771;
          border-color: #007acc;
          color: #ffffff;
        }

        .rohit-ai-result pre {
          max-height: 380px;

          margin: 0;

          padding: 14px;

          overflow: auto;

          white-space: pre-wrap;
          word-break: break-word;

          color: #d4d4d4;

          font-family:
            "Cascadia Code",
            Consolas,
            monospace;

          font-size: 12px;

          line-height: 1.55;
        }

        /* ==============================================
           AI EMPTY
        ============================================== */

        .rohit-ai-empty {
          padding: 35px 20px;

          text-align: center;
        }

        .rohit-ai-empty-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 12px;

          border-radius: 50%;

          background: #252526;

          color: #4fc1ff;

          font-size: 20px;
        }

        .rohit-ai-empty strong {
          color: #ffffff;
          font-size: 14px;
        }

        .rohit-ai-empty p {
          max-width: 440px;

          margin: 7px auto 18px;

          color: #858585;

          font-size: 12px;
          line-height: 1.5;
        }

        .rohit-ai-examples {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 7px;
        }

        .rohit-ai-examples button {
          padding: 7px 10px;

          border: 1px solid #3f3f46;
          border-radius: 4px;

          background: #252526;

          color: #aaaaaa;

          font-size: 11px;

          cursor: pointer;
        }

        .rohit-ai-examples button:hover {
          background: #094771;
          border-color: #007acc;
          color: #ffffff;
        }

        /* ==============================================
           AI LOADING
        ============================================== */

        .rohit-ai-loading {
          min-height: 120px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 10px;

          color: #858585;

          font-size: 12px;
        }

        .rohit-ai-spinner {
          animation:
            rohit-ai-spin 1s
            linear infinite;

          color: #4fc1ff;

          font-size: 24px;
        }

        @keyframes rohit-ai-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ==============================================
           MOBILE
        ============================================== */

        @media (max-width: 800px) {
          .rohit-ai-floating-button {
            right: 85px;
          }

          .rohit-ai-overlay {
            padding: 50px 10px 10px;
          }

          .rohit-ai-panel {
            width: 100%;
            max-height: calc(100vh - 60px);
          }

          .rohit-ai-result pre {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;