// TriangleBackground.jsx
export default function TriangleBackground({ flipped = false }) {
  return (
    <div
      className={`absolute top-0 ${flipped ? "right-0 rotate-180" : "left-0"}`}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-64 h-64 text-amber-100 opacity-30"
        fill="currentColor"
      >
        <polygon points="0,0 500,0 0,500" />
      </svg>
    </div>
  );
}
