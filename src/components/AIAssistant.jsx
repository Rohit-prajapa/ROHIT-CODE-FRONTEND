import {
  Bot,
  Send,
  X,
  Sparkles,
  Copy,
  Trash2,
  Bug,
  WandSparkles,
  Code2,
  Loader2,
} from "lucide-react";

import { useState } from "react";

function AIAssistant({
  isOpen = true,
  onClose,
  code = "",
  language = "plaintext",
  fileName = "",
  onInsertCode = () => {},
}) {
  const [message, setMessage] = useState("");

  const [isThinking, setIsThinking] =
    useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi Rohit 👋\n\nI'm ROHIT AI, your coding assistant. I can explain code, find bugs, optimize your program, or help you write new code.",
    },
  ]);

  /* =====================================================
     GEMINI AI
     ===================================================== */

  const generateWithGemini = async (
    prompt,
    displayMessage = prompt,
  ) => {
    const text = String(prompt || "").trim();

    if (!text || isThinking) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: displayMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setIsThinking(true);

    try {
      const response = await fetch(
       "https://rohit-code.onrender.com/api/ai/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: text,
            language,
            currentCode: code || "",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            data.error ||
            "Gemini AI request failed.",
        );
      }

      const generatedCode =
        typeof data.code === "string"
          ? data.code.trim()
          : "";

      const generatedText =
        generatedCode ||
        data.message ||
        data.output ||
        "Gemini did not return a response.";

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: generatedText,
          generatedCode: generatedCode || null,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            `❌ Gemini AI error:\n\n${
              error.message ||
              "Unable to connect to the AI backend."
            }`,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const sendMessage = () => {
    const text = message.trim();

    if (!text || isThinking) return;

    generateWithGemini(
      text,
      text,
    );
  };

  /* =====================================================
     QUICK ACTIONS
     ===================================================== */

  const explainCode = () => {
    if (!code.trim()) {
      setMessage(
        "There is no code open to explain.",
      );
      return;
    }

    generateWithGemini(
      `Explain this ${language} code step by step. Explain the logic, important functions, time complexity, space complexity, and any important concepts.\n\nCODE:\n${code}`,
      `Explain this ${language} code step by step.`,
    );
  };

  const debugCode = () => {
    if (!code.trim()) {
      setMessage(
        "There is no code open to debug.",
      );
      return;
    }

    generateWithGemini(
      `Find bugs in this ${language} code. Explain every problem and then provide the complete corrected ${language} code. Return the corrected code clearly.\n\nCODE:\n${code}`,
      `Debug my ${language} code and give me the corrected version.`,
    );
  };

  const optimizeCode = () => {
    if (!code.trim()) {
      setMessage(
        "There is no code open to optimize.",
      );
      return;
    }

    generateWithGemini(
      `Optimize this ${language} code for performance, readability, memory usage, and best practices. Explain the important improvements and then provide the complete optimized ${language} code.\n\nCODE:\n${code}`,
      `Optimize my ${language} code for performance and readability.`,
    );
  };

  const generateCode = () => {
    setMessage(
      `Generate clean ${language} code for: `,
    );
  };

  /* =====================================================
     COPY
     ===================================================== */


  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard unavailable.
    }
  };

  /* =====================================================
     CLEAR
     ===================================================== */

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Conversation cleared. What would you like to build?",
      },
    ]);
  };

  /* =====================================================
     CLOSE
     ===================================================== */

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="rohit-ai-panel">
      <style>{`
        /* =================================================
           ROHIT AI PANEL
           ================================================= */

        .rohit-ai-panel {
          width: 390px;
          min-width: 330px;
          max-width: 45vw;

          height: 100%;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          background: #181818;
          color: #cccccc;

          border-left: 1px solid #2b2b2b;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;
        }

        /* =================================================
           HEADER
           ================================================= */

        .rohit-ai-header {
          height: 52px;
          min-height: 52px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 12px;

          border-bottom: 1px solid #2b2b2b;

          background: #181818;
        }

        .rohit-ai-title {
          display: flex;
          align-items: center;

          gap: 10px;
        }

        .rohit-ai-logo {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 7px;

          background: #0e639c;

          color: #ffffff;

          box-shadow:
            0 2px 8px rgba(0, 122, 204, .18);
        }

        .rohit-ai-title-text {
          display: flex;
          flex-direction: column;

          gap: 2px;
        }

        .rohit-ai-title-text strong {
          color: #ffffff;

          font-size: 14px;

          font-weight: 600;

          letter-spacing: .2px;
        }

        .rohit-ai-title-text small {
          color: #858585;

          font-size: 11px;
        }

        .rohit-ai-close {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 5px;

          background: transparent;

          color: #858585;

          cursor: pointer;
        }

        .rohit-ai-close:hover {
          background: #2a2d2e;
          color: #ffffff;
        }

        /* =================================================
           CURRENT FILE
           ================================================= */

        .rohit-ai-context {
          display: flex;
          align-items: center;

          gap: 7px;

          margin: 10px;

          padding: 8px 10px;

          border: 1px solid #303030;

          border-radius: 5px;

          background: #202020;

          color: #aaaaaa;

          font-size: 11px;
        }

        .rohit-ai-context svg {
          color: #58a6ff;

          flex-shrink: 0;
        }

        .rohit-ai-context-name {
          flex: 1;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          color: #cccccc;
        }

        .rohit-ai-context-lang {
          flex-shrink: 0;

          padding: 2px 6px;

          border-radius: 4px;

          background: #2a2d2e;

          color: #858585;

          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: .3px;
        }

        /* =================================================
           QUICK ACTIONS
           ================================================= */

        .rohit-ai-actions {
          display: flex;

          gap: 6px;

          padding: 0 10px 10px;

          overflow-x: auto;
        }

        .rohit-ai-action {
          height: 31px;

          display: flex;
          align-items: center;

          gap: 5px;

          flex-shrink: 0;

          padding: 0 9px;

          border: 1px solid #3b3b3b;
          border-radius: 5px;

          background: #252526;

          color: #bdbdbd;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;

          font-size: 11px;

          cursor: pointer;

          transition:
            background .12s ease,
            border-color .12s ease,
            color .12s ease;
        }

        .rohit-ai-action:hover {
          background: #303030;

          border-color: #555555;

          color: #ffffff;
        }

        .rohit-ai-action.primary {
          border-color: #075985;

          background: #0e3f5f;

          color: #d8efff;
        }

        /* =================================================
           MESSAGES
           ================================================= */

        .rohit-ai-messages {
          flex: 1;
          min-height: 0;

          overflow-y: auto;

          padding: 4px 12px 14px;
        }

        .rohit-ai-messages::-webkit-scrollbar {
          width: 8px;
        }

        .rohit-ai-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .rohit-ai-messages::-webkit-scrollbar-thumb {
          background: #3a3a3a;

          border-radius: 8px;
        }

        .rohit-ai-message {
          position: relative;

          margin-bottom: 12px;

          padding: 11px 12px;

          border-radius: 6px;

          font-size: 13px;

          line-height: 1.55;

          word-break: break-word;
        }

        .rohit-ai-message.assistant {
          background: #202020;

          border: 1px solid #303030;
        }

        .rohit-ai-message.user {
          margin-left: 28px;

          background: #094771;

          color: #ffffff;

          border: 1px solid #12639a;
        }

        .rohit-ai-message-role {
          margin-bottom: 6px;

          color: #858585;

          font-size: 10px;

          font-weight: 600;

          letter-spacing: .3px;
        }

        .rohit-ai-message.user
        .rohit-ai-message-role {
          color: #c8e1ff;
        }

        .rohit-ai-message-content {
          white-space: pre-wrap;
        }

        .rohit-ai-message-actions {
          position: absolute;
          top: 7px;
          right: 7px;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .rohit-ai-copy,
        .rohit-ai-insert {
          position: static;


          width: 25px;
          height: 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 4px;

          background: transparent;

          color: #777777;

          cursor: pointer;

          opacity: 0;
        }

        .rohit-ai-message:hover
        .rohit-ai-copy {
          opacity: 1;
        }

        .rohit-ai-copy:hover,
        .rohit-ai-insert:hover {
          background: #333333;

          color: #ffffff;
        }

        .rohit-ai-insert {
          color: #4ec9b0;
        }

        /* =================================================
           THINKING
           ================================================= */

        .rohit-ai-thinking {
          display: flex;
          align-items: center;

          gap: 8px;

          margin-bottom: 12px;

          padding: 10px 12px;

          border: 1px solid #303030;

          border-radius: 6px;

          background: #202020;

          color: #858585;

          font-size: 12px;
        }

        .rohit-ai-thinking svg {
          color: #4ec9b0;

          animation:
            rohit-ai-spin
            1s linear infinite;
        }

        @keyframes rohit-ai-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =================================================
           INPUT
           ================================================= */

        .rohit-ai-input-area {
          padding: 10px;

          border-top: 1px solid #2b2b2b;

          background: #161616;
        }

        .rohit-ai-textarea {
          width: 100%;

          min-height: 78px;
          max-height: 180px;

          resize: vertical;

          padding: 10px;

          border: 1px solid #3b3b3b;

          border-radius: 5px;

          outline: none;

          background: #252526;

          color: #ffffff;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;

          font-size: 13px;

          line-height: 1.5;

          box-sizing: border-box;
        }

        .rohit-ai-textarea:focus {
          border-color: #007acc;

          box-shadow:
            0 0 0 1px rgba(0, 122, 204, .12);
        }

        .rohit-ai-textarea::placeholder {
          color: #777777;
        }

        .rohit-ai-input-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 7px;
        }

        .rohit-ai-clear {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 5px;

          background: transparent;

          color: #777777;

          cursor: pointer;
        }

        .rohit-ai-clear:hover {
          background: #2a2d2e;

          color: #ffffff;
        }

        .rohit-ai-send {
          height: 32px;

          display: flex;
          align-items: center;

          gap: 6px;

          padding: 0 12px;

          border: 0;
          border-radius: 5px;

          background: #0e639c;

          color: #ffffff;

          font-family: "Segoe UI", Inter, system-ui, sans-serif;

          font-size: 12px;

          cursor: pointer;
        }

        .rohit-ai-send:hover:not(:disabled) {
          background: #1177bb;
        }

        .rohit-ai-send:disabled {
          background: #303030;

          color: #666666;

          cursor: not-allowed;
        }

        .rohit-ai-hint {
          margin-top: 7px;

          color: #666666;

          font-size: 10px;

          text-align: center;
        }

        /* =================================================
           RESPONSIVE
           ================================================= */

        @media (max-width: 900px) {
          .rohit-ai-panel {
            width: 340px;

            min-width: 300px;
          }
        }

        @media (max-width: 600px) {
          .rohit-ai-panel {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>

      {/* ===================================================
          HEADER
         =================================================== */}

      <header className="rohit-ai-header">
        <div className="rohit-ai-title">
          <span className="rohit-ai-logo">
            <Bot size={18} />
          </span>

          <div className="rohit-ai-title-text">
            <strong>ROHIT AI</strong>
            <small>
              Your coding assistant
            </small>
          </div>
        </div>

        <button
          type="button"
          className="rohit-ai-close"
          onClick={onClose}
          title="Close AI Assistant"
        >
          <X size={17} />
        </button>
      </header>

      {/* ===================================================
          FILE CONTEXT
          Now shows the actual open file name, with the
          language as a small badge alongside it — instead
          of showing the language where a file name was
          implied.
         =================================================== */}

      <div className="rohit-ai-context">
        <Code2 size={14} />

        <span>
          Current file:
        </span>

        <strong className="rohit-ai-context-name">
          {fileName || "No file open"}
        </strong>

        <span className="rohit-ai-context-lang">
          {language}
        </span>
      </div>

      {/* ===================================================
          QUICK ACTIONS
         =================================================== */}

      <div className="rohit-ai-actions">
        <button
          type="button"
          className="rohit-ai-action primary"
          onClick={explainCode}
        >
          <Sparkles size={13} />
          Explain
        </button>

        <button
          type="button"
          className="rohit-ai-action"
          onClick={debugCode}
        >
          <Bug size={13} />
          Debug
        </button>

        <button
          type="button"
          className="rohit-ai-action"
          onClick={optimizeCode}
        >
          <WandSparkles size={13} />
          Optimize
        </button>

        <button
          type="button"
          className="rohit-ai-action"
          onClick={generateCode}
        >
          <Code2 size={13} />
          Generate
        </button>
      </div>

      {/* ===================================================
          MESSAGES
         =================================================== */}

      <div className="rohit-ai-messages">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`rohit-ai-message ${
              item.role === "user"
                ? "user"
                : "assistant"
            }`}
          >
            <div className="rohit-ai-message-role">
              {item.role === "user"
                ? "YOU"
                : "ROHIT AI"}
            </div>

            <div className="rohit-ai-message-content">
              {item.content}
            </div>

            {item.role === "assistant" && (
              <div className="rohit-ai-message-actions">
                <button
                  type="button"
                  className="rohit-ai-copy"
                  onClick={() =>
                    copyMessage(
                      item.generatedCode ||
                        item.content,
                    )
                  }
                  title="Copy response"
                >
                  <Copy size={13} />
                </button>

                {item.generatedCode && (
                  <button
                    type="button"
                    className="rohit-ai-insert"
                    onClick={() => {
                      onInsertCode(
                        item.generatedCode,
                      );
                    }}
                    title="Insert code into editor"
                  >
                    <Code2 size={13} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="rohit-ai-thinking">
            <Loader2 size={14} />
            ROHIT AI is thinking...
          </div>
        )}
      </div>

      {/* ===================================================
          INPUT
         =================================================== */}

      <div className="rohit-ai-input-area">
        <textarea
          className="rohit-ai-textarea"
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value,
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();

              sendMessage();
            }
          }}
          placeholder="Ask ROHIT AI about your code..."
          rows={3}
        />

        <div className="rohit-ai-input-footer">
          <button
            type="button"
            className="rohit-ai-clear"
            onClick={
              clearConversation
            }
            title="Clear conversation"
          >
            <Trash2 size={15} />
          </button>

          <button
            type="button"
            className="rohit-ai-send"
            onClick={sendMessage}
            disabled={
              !message.trim() ||
              isThinking
            }
          >
            <Send size={14} />
            Send
          </button>
        </div>

        <div className="rohit-ai-hint">
          Enter to send • Shift + Enter
          for new line • Powered by Gemini
        </div>
      </div>
    </aside>
  );
}

export default AIAssistant;