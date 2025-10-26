"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { useFormContext } from "../context/FormContext"
import type { ThemeConfig } from "../types"
import { defaultTheme } from "../styles/theme"

export interface FileUploadProps {
  name: string
  label?: string
  accept?: string
  multiple?: boolean
  maxSize?: number
  required?: boolean
  disabled?: boolean
  helperText?: string
  theme?: Partial<ThemeConfig>
  className?: string
  style?: React.CSSProperties
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
  theme: customTheme,
  className,
  style: customStyle,
  showPreview = true,
}) => {
  const theme = { ...defaultTheme, ...customTheme }
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

  const styles = {
    container: {
      marginBottom: theme.spacing,
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      ...customStyle,
    },
    label: {
      fontSize: "14px",
      fontWeight: 500,
      color: theme.textColor,
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    required: {
      color: theme.errorColor,
    },
    dropzone: {
      padding: "24px",
      border: `2px dashed ${
        isUploading ? theme.primaryColor :
        isDragOver ? theme.primaryColor : 
        displayError ? theme.errorColor : 
        theme.borderColor
      }`,
      borderRadius: theme.borderRadius,
      backgroundColor: isDragOver ? "#f9fafb" : "#ffffff",
      cursor: disabled || isUploading ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      textAlign: "center" as const,
      opacity: disabled ? 0.6 : 1,
    },
    dropzoneLabel: {
      cursor: disabled || isUploading ? "not-allowed" : "pointer",
      display: "block",
    },
    dropzoneText: {
      fontSize: "14px",
      color: theme.textColor,
      marginBottom: "4px",
    },
    sizeText: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
    },
    progressContainer: {
      marginTop: "12px",
      width: "100%",
    },
    progressBar: {
      width: "100%",
      height: "8px",
      backgroundColor: "#e5e7eb",
      borderRadius: "4px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.primaryColor,
      transition: "width 0.1s ease",
      borderRadius: "4px",
    },
    progressText: {
      fontSize: "12px",
      color: theme.primaryColor,
      marginTop: "4px",
      fontWeight: 600,
    },
    filesContainer: {
      marginTop: "12px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
    },
    fileItem: {
      fontSize: "13px",
      color: theme.textColor,
      padding: "10px 12px",
      backgroundColor: "#f9fafb",
      borderRadius: theme.borderRadius,
      border: `1px solid ${theme.borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
    },
    fileInfo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flex: 1,
    },
    fileIcon: {
      fontSize: "16px",
    },
    fileName: {
      fontWeight: 500,
    },
    fileSize: {
      fontSize: "11px",
      color: "#6b7280",
    },
    removeButton: {
      background: "none",
      border: "none",
      color: theme.errorColor,
      cursor: "pointer",
      fontSize: "18px",
      padding: "0",
      lineHeight: 1,
      transition: "opacity 0.2s",
    },
    error: {
      fontSize: "12px",
      color: theme.errorColor,
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280",
    },
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div style={styles.container} className={className}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
      )}
      
      <div
        style={styles.dropzone}
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
          style={{ display: "none" }}
          id={`file-input-${name}`}
        />
        <label htmlFor={`file-input-${name}`} style={styles.dropzoneLabel}>
          <div style={styles.dropzoneText}>
            {isUploading ? "Uploading..." : "Drag and drop files here or click to select"}
          </div>
          {maxSize && (
            <div style={styles.sizeText}>
              Max file size: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </div>
          )}
        </label>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${uploadProgress}%`
                }}
              />
            </div>
            <div style={styles.progressText}>
              Uploading... {uploadProgress}%
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files Display */}
      {showPreview && uploadedFiles.length > 0 && (
        <div style={styles.filesContainer}>
          {uploadedFiles.map((file: any, index: number) => (
            <div key={index} style={styles.fileItem}>
              <div style={styles.fileInfo}>
                <span style={styles.fileIcon}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={styles.fileName}>{file.name}</div>
                  <div style={styles.fileSize}>{formatFileSize(file.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                style={styles.removeButton}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="Remove file"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {displayError && (
        <span style={styles.error}>
          ⚠️ {fieldError}
        </span>
      )}
      {helperText && !displayError && (
        <span style={styles.helperText}>{helperText}</span>
      )}
    </div>
  )
}