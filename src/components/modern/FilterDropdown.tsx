"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string | number;
  slug: string;
  name: string;
  color?: string | null;
}

interface FilterDropdownProps {
  label: string;
  items: FilterOption[];
  selectedItems: string[];
  onToggle: (slug: string) => void;
  type?: "single" | "multi";
  className?: string;
}

export function FilterDropdown({
  label,
  items,
  selectedItems,
  onToggle,
  type = "multi",
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = selectedItems.length > 0;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all",
          hasSelection
            ? "border-blue-500/50 bg-blue-500/20 text-blue-400"
            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800",
        )}
      >
        {hasSelection ? (
          <>
            {label}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/30 text-xs">
              {selectedItems.length}
            </span>
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" />
            {label}
          </>
        )}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-50 mt-2 min-w-[180px] rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-xl shadow-black/20"
          >
            {items.map((item) => {
              const isSelected = selectedItems.includes(item.slug);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onToggle(item.slug);
                    if (type === "single") setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    isSelected
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800",
                  )}
                >
                  <span>{item.name}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  variant?: "primary" | "default";
}

export function FilterChip({
  label,
  onRemove,
  variant = "default",
}: FilterChipProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={onRemove}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors",
        variant === "primary"
          ? "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/20"
          : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800",
      )}
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </motion.button>
  );
}

interface FilterBarProps {
  filters: Array<{
    label: string;
    items: FilterOption[];
    selectedItems: string[];
    onToggle: (slug: string) => void;
    type?: "single" | "multi";
  }>;
  selectedFilters: Array<{
    label: string;
    slug: string;
    onRemove: () => void;
    variant?: "primary" | "default";
  }>;
  onClearAll: () => void;
  showClearAll?: boolean;
  className?: string;
}

export function FilterBar({
  filters,
  selectedFilters,
  onClearAll,
  showClearAll = true,
  className,
}: FilterBarProps) {
  const hasFilters = selectedFilters.length > 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Filter Dropdowns */}
      {filters.map((filter) => (
        <FilterDropdown
          key={filter.label}
          label={filter.label}
          items={filter.items}
          selectedItems={filter.selectedItems}
          onToggle={filter.onToggle}
          type={filter.type}
        />
      ))}

      {/* Selected filters as removable chips */}
      <AnimatePresence>
        {selectedFilters.map((filter) => (
          <FilterChip
            key={`${filter.label}-${filter.slug}`}
            label={filter.label}
            onRemove={filter.onRemove}
            variant={filter.variant}
          />
        ))}
      </AnimatePresence>

      {/* Clear all button */}
      {showClearAll && (
        <AnimatePresence>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClearAll}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-300 shadow-sm transition-colors hover:border-slate-600 hover:bg-slate-800"
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
