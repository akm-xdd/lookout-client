import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  maxHeight?: string;
  searchable?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  dropdownClassName = "",
  maxHeight = "200px",
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions =
    searchable && searchTerm
      ? options.filter(
          (option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.value
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : options;

  // Find selected option for display
  const selectedOption = options.find((option) => option.value === value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Focus first option
          const firstOption = selectRef.current?.querySelector(
            '[role="option"]'
          ) as HTMLElement;
          firstOption?.focus();
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          // Focus last option
          const options =
            selectRef.current?.querySelectorAll('[role="option"]');
          const lastOption = options?.[options.length - 1] as HTMLElement;
          lastOption?.focus();
        }
        break;
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    optionValue: string | number
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleSelect(optionValue);
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;
      case "ArrowDown":
        event.preventDefault();
        const nextSibling = (event.target as HTMLElement)
          .nextElementSibling as HTMLElement;
        nextSibling?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        const prevSibling = (event.target as HTMLElement)
          .previousElementSibling as HTMLElement;
        if (prevSibling) {
          prevSibling.focus();
        } else if (searchable && inputRef.current) {
          inputRef.current.focus();
        }
        break;
    }
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
          text-white disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-between transition-colors
          ${
            isOpen
              ? "border-blue-500 ring-1 ring-blue-500"
              : "hover:border-white/20"
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
      >
        <span className={selectedOption ? "text-white" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 
            rounded-lg shadow-lg z-50 overflow-hidden ${dropdownClassName}
          `}
          role="listbox"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-white/10">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-3 py-2 bg-black border border-white/10 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const firstOption = selectRef.current?.querySelector(
                      '[role="option"]'
                    ) as HTMLElement;
                    firstOption?.focus();
                  } else if (e.key === "Escape") {
                    setIsOpen(false);
                    setSearchTerm("");
                  }
                }}
              />
            </div>
          )}

          {/* Options Container with Scroll */}
          <div className="overflow-y-auto bg-black" style={{ maxHeight }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-sm">
                {searchable && searchTerm
                  ? "No options found"
                  : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                  disabled={option.disabled}
                  tabIndex={-1}
                  className={`
    w-full px-4 py-3 text-left transition-colors flex items-center justify-between
    focus:outline-none focus:bg-white/10
    ${
      option.disabled
        ? "text-gray-500 cursor-not-allowed"
        : "text-white hover:bg-white/10 cursor-pointer"
    }
    ${option.value === value ? "bg-blue-500/20 text-blue-300" : "bg-black"}
  `}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
