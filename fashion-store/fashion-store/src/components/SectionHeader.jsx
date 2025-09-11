// src/components/SectionHeader.jsx
import { Link } from "react-router-dom";

export default function SectionHeader({ title, to }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {to && (
        <Link to={to} className="text-sm hover:underline">
          See all →
        </Link>
      )}
    </div>
  );
}
