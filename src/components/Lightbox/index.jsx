import { useEffect } from "react";
import { createPortal } from "react-dom";

function Lightbox({ src, onClose }) {
  if (!src) return null;

  // Nhấn Escape để đóng
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90"
      onClick={handleOverlayClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      >
        <i className="fa-solid fa-xmark text-lg" />
      </button>

      <img
        src={src}
        alt="preview"
        onClick={(e) => e.stopPropagation()}
        className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg animate-in fade-in zoom-in-90 duration-200"
      />
    </div>,
    document.body
  );
}

export default Lightbox;