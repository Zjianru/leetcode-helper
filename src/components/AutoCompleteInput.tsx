import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AutoCompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  onSelect?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AutoCompleteInput({ 
  value, 
  onChange, 
  suggestions, 
  onSelect,
  placeholder,
  className
}: AutoCompleteInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, suggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    if (onSelect) {
      onSelect(suggestion);
    }
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"

        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className={className}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md shadow-lg bg-white border border-gray-300">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
