"use client";

import React, { useState, KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
}

export default function TagInput({ tags, setTags, placeholder = "Type and press Enter", error }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, tags.length - 1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div
      className={`flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border bg-white p-2 text-sm transition-colors focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 ${
        error ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-400" : "border-slate-200"
      }`}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-slate-700"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={`Remove ${tag}`}
          >
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 bg-transparent py-1 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
