import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1 bg-brand-light-pale text-brand-primary text-xs font-medium px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
    >
      {label} <X size={12} />
    </button>
  );
}
