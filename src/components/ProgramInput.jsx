import { Trash2 } from "lucide-react";

function ProgramInput({
  value = "",
  onChange = () => {},
  onClear = () => {},
}) {
  return (
    <div className="program-input-panel">
      <div className="program-input-header">
        <span id="program-input-label">PROGRAM INPUT</span>
        <button
          type="button"
          onClick={onClear}
          title="Clear input"
          aria-label="Clear input"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <textarea
        className="program-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={"Enter input...\nExample:\n10\n20"}
        spellCheck={false}
        aria-labelledby="program-input-label"
      />
    </div>
  );
}

export default ProgramInput;