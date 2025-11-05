"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { useFormContext } from "../context/FormContext"
import "../styles/globals.css"

export interface FileUploadProps {
  name: string
  label?: string
  accept?: string
  multiple?: boolean
  maxSize?: number
  required?: boolean
  disabled?: boolean
  helperText?: string
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  showPreview?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  accept,
  multiple = false,
  maxSize = 5242880, // 5MB default
  required = false,
  disabled = false,
  helperText,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  showPreview = true,
}) => {
  const { 
    values, 
    errors, 
    touched, 
    setFieldValue, 
    setFieldError, 
    setFieldTouched,
    registerField,
    unregisterField,
  } = useFormContext()

  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const uploadingRef = useRef(false)

  const fieldValue = values[name]
  const fieldError = errors[name]
  const fieldTouched = touched[name]

  // Validation function
  const validate = useCallback(async (): Promise<boolean> => {
    const value = values[name]
    let error = ""

    if (required) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        error = "Please upload at least one file"
      }
    }

    setFieldError(name, error)
    return !error
  }, [values, name, required, setFieldError])

  // Register field with form context
  useEffect(() => {
    registerField(name, validate)
    return () => unregisterField(name)
  }, [name, registerField, unregisterField, validate])

  // Simulate file upload with progress
  const simulateUpload = useCallback(async (files: File[]): Promise<void> => {
    return new Promise((resolve) => {
      setIsUploading(true)
      setUploadProgress(0)
      uploadingRef.current = true

      const duration = 2000 // 2 seconds upload simulation
      const steps = 100
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        setUploadProgress(currentStep)

        if (currentStep >= steps) {
          clearInterval(interval)
          setIsUploading(false)
          uploadingRef.current = false
          resolve()
        }
      }, stepDuration)
    })
  }, [])

  const validateFiles = useCallback((files: FileList | null): string | null => {
    if (!files || files.length === 0) {
      return null
    }

    // Check if already uploading
    if (uploadingRef.current) {
      return "Please wait for the current upload to complete"
    }

    // Check multiple files
    if (!multiple && files.length > 1) {
      return "Only one file is allowed"
    }

    // Check file sizes
    for (let i = 0; i < files.length; i++) {
      if (maxSize && files[i].size > maxSize) {
        return `File "${files[i].name}" exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`
      }
    }

    // Check file types
    if (accept) {
      const allowedTypes = accept.split(',').map(t => t.trim())
      for (let i = 0; i < files.length; i++) {
        const fileExtension = '.' + files[i].name.split('.').pop()?.toLowerCase()
        const fileType = files[i].type
        
        const isAllowed = allowedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.toLowerCase()
          }
          return fileType.match(new RegExp(type.replace('*', '.*')))
        })

        if (!isAllowed) {
          return `File "${files[i].name}" type is not allowed`
        }
      }
    }

    return null
  }, [multiple, maxSize, accept])

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setFieldTouched(name, true)

    const validationError = validateFiles(files)
    if (validationError) {
      setFieldError(name, validationError)
      return
    }

    setFieldError(name, "")

    const fileArray = Array.from(files)

    // Simulate upload with progress
    await simulateUpload(fileArray)

    // Store file information in form values
    if (multiple) {
      const existingFiles = Array.isArray(fieldValue) ? fieldValue : []
      const newFiles = fileArray.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }))
      setFieldValue(name, [...existingFiles, ...newFiles])
    } else {
      const fileInfo = {
        name: fileArray[0].name,
        size: fileArray[0].size,
        type: fileArray[0].type,
        file: fileArray[0],
      }
      setFieldValue(name, fileInfo)
    }
  }, [name, validateFiles, setFieldValue, setFieldError, setFieldTouched, simulateUpload, multiple, fieldValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files)
    e.target.value = '' // Reset input to allow uploading same file again
  }, [handleFileChange])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileChange(e.dataTransfer.files)
  }, [handleFileChange])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragOver(true)
    }
  }, [disabled, isUploading])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const removeFile = useCallback((index: number) => {
    if (multiple && Array.isArray(fieldValue)) {
      const newFiles = fieldValue.filter((_, i) => i !== index)
      setFieldValue(name, newFiles.length > 0 ? newFiles : null)
    } else {
      setFieldValue(name, null)
    }
    setFieldTouched(name, true)
  }, [multiple, fieldValue, name, setFieldValue, setFieldTouched])

  const displayError = fieldTouched && fieldError

  // Get uploaded files for display
  const uploadedFiles = multiple 
    ? (Array.isArray(fieldValue) ? fieldValue : [])
    : (fieldValue ? [fieldValue] : [])

  const dropzoneClasses = `
    form-file-dropzone
    ${isDragOver ? 'form-file-dropzone-dragover' : ''}
    ${isUploading ? 'form-file-dropzone-uploading' : ''}
    ${displayError ? 'form-file-dropzone-error' : ''}
    ${disabled ? 'form-file-dropzone-disabled' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className={`form-field-container ${containerClassName}`}>
      {/* Label */}
      {label && (
        <div className="form-label-wrapper">
          <label className={`form-label ${labelClassName}`}>
            {label}
          </label>
          {required && (
            <span className="form-required-badge" title="Required field">
              *
            </span>
          )}
        </div>
      )}
      
      {/* Dropzone */}
      <div
        className={dropzoneClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled || isUploading}
          className="form-file-input"
          id={`file-input-${name}`}
        />
        <label htmlFor={`file-input-${name}`} className="form-file-dropzone-label">
          <div className="form-file-dropzone-text">
            {isUploading ? "Uploading..." : "Drag and drop files here or click to select"}
          </div>
          {maxSize && (
            <div className="form-file-size-text">
              Max file size: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </div>
          )}
        </label>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="form-file-progress-container">
            <div className="form-file-progress-bar">
              <div 
                className="form-file-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="form-file-progress-text">
              Uploading... {uploadProgress}%
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files Display */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="form-file-list">
          {uploadedFiles.map((file: any, index: number) => (
            <div key={index} className="form-file-item">
              <div className="form-file-info">
                <span className="form-file-icon">📄</span>
                <div className="form-file-details">
                  <div className="form-file-name">{file.name}</div>
                  <div className="form-file-size">{formatFileSize(file.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="form-file-remove-button"
                title="Remove file"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className={`form-error-text ${errorClassName}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 11a1 1 0 110 2 1 1 0 010-2zm0-8a1 1 0 00-1 1v5a1 1 0 002 0V4a1 1 0 00-1-1z"/>
          </svg>
          <span>{fieldError}</span>
        </div>
      )}
      
      {/* Helper Text */}
      {helperText && !displayError && (
        <div className="form-helper-text">{helperText}</div>
      )}
    </div>
  )
}