import {
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const SEVERITY_ICON = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function ProblemsPanel({ problems = [], onClose, onProblemClick }) {
  const errors = problems.filter((item) => item.severity === "error");
  const warnings = problems.filter((item) => item.severity === "warning");
  const infos = problems.filter((item) => item.severity === "info");

  const renderProblem = (problem, index) => {
    const Icon = SEVERITY_ICON[problem.severity] || Info;
    return (
      <button
        key={problem.id ?? index}
        type="button"
        className="rohit-problem-item"
        onClick={() => onProblemClick?.(problem)}
        aria-label={`${problem.severity || "info"}: ${problem.message || "Unknown problem"}`}
      >
        <span className="rohit-problem-icon" aria-hidden="true">
          <Icon size={15} />
        </span>
        <span className="rohit-problem-content">
          <span className="rohit-problem-message">
            {problem.message || "Unknown problem"}
          </span>
          <span className="rohit-problem-location">
            {problem.file || "Current File"}
            {problem.line ? `:${problem.line}` : ""}
            {problem.column ? `:${problem.column}` : ""}
          </span>
        </span>
      </button>
    );
  };

  return (
    <section className="rohit-problems-panel">
      <header className="rohit-problems-header">
        <div>
          <span>PROBLEMS</span>
          <span className="rohit-problems-count">{problems.length}</span>
        </div>
        <button type="button" onClick={onClose} title="Close Problems" aria-label="Close Problems panel">
          <X size={15} />
        </button>
      </header>

      <div className="rohit-problems-summary">
        <span className="rohit-problem-error-count">
          <AlertCircle size={14} /> {errors.length} Errors
        </span>
        <span className="rohit-problem-warning-count">
          <AlertTriangle size={14} /> {warnings.length} Warnings
        </span>
        <span className="rohit-problem-info-count">
          <Info size={14} /> {infos.length} Info
        </span>
      </div>

      <div className="rohit-problems-list">
        {problems.length === 0 ? (
          <div className="rohit-problems-empty">
            <span className="rohit-problems-check">✓</span>
            <span>No problems detected</span>
          </div>
        ) : (
          problems.map(renderProblem)
        )}
      </div>
    </section>
  );
}

export default ProblemsPanel;