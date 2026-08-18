import { useEffect, useRef } from "react";

function SaveChangesModal({
  isOpen,
  fileName,
  onSave = () => {},
  onDontSave = () => {},
  onCancel = () => {},
}) {
  const saveButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    saveButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="save-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="save-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="save-modal-title" id="save-modal-title">
          Save Changes
        </div>
        <div className="save-modal-message">
          Do you want to save changes to
          <strong> {fileName}</strong> before closing?
        </div>
        <div className="save-modal-actions">
          <button
            type="button"
            className="modal-button cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-button discard-button"
            onClick={onDontSave}
          >
            Don't Save
          </button>
          <button
            type="button"
            className="modal-button save-button"
            onClick={onSave}
            ref={saveButtonRef}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveChangesModal;