"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useFieldValidation } from "../hooks/useFieldValidation"
import { debounce } from "../utils/debounce"

export interface TagsInputProps {
  name: string
  label?: string
  placeholder?: string
  value?: string[]
  required?: boolean
  disabled?: boolean
  error?: string
  onChange?: (tags: string[]) => void
  onBlur?: () => void
  className?: string
  helperText?: string
  maxTags?: number
}

export const TagsInput: React.FC<TagsInputProps> = ({
  name,
  label,
  placeholder = "Add tags and press Enter",
  value = [],
  required = false,
  disabled = false,
  error,
  onChange,
  onBlur,
  className = "",
  helperText,
  maxTags,
}) => {
  const [tags, setTags] = useState<string[]>(value)
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const { validateField } = useFieldValidation(name)

  const debouncedValidate = useCallback(
    debounce((newTags: string[]) => {
      validateField("")
      onChange?.(newTags)
    }, 300),
    [onChange, validateField],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!maxTags || tags.length < maxTags) {
        const newTags = [...tags, inputValue.trim()]
        setTags(newTags)
        setInputValue("")
        debouncedValidate(newTags)
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1)
      setTags(newTags)
      debouncedValidate(newTags)
    }
  }

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
    debouncedValidate(newTags)
  }

  return (
    <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }} className={className}>
      {label && (
        <label
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {label}
          {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}
      <div
        style={{
          padding: "10px 12px",
          fontSize: "14px",
          border: `1px solid ${error ? "#ef4444" : isFocused ? "#000000" : "#e5e7eb"}`,
          borderRadius: "6px",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
          color: "#1f2937",
          transition: "all 0.2s ease",
          outline: "none",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center",
        }}
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 8px",
              backgroundColor: "#00000010",
              color: "#000000",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
disabled={disabled || Boolean(maxTags && tags.length >= maxTags)}
          style={{
            flex: 1,
            minWidth: "100px",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: "#1f2937",
            fontSize: "14px",
          }}
        />
      </div>
      {error && <span style={{ fontSize: "12px", color: "#ef4444" }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: "12px", color: "#6b7280" }}>{helperText}</span>}
    </div>
  )
}
