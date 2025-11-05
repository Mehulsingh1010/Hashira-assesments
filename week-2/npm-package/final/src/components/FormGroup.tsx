"use client"

import React from "react"
import "../styles/globals.css"

export interface FormGroupProps {
  children: React.ReactNode
  title?: string
  description?: string
  spacing?: "compact" | "normal" | "relaxed"
  highlight?: boolean
  className?: string
  containerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  title,
  description,
  spacing = "normal",
  highlight = false,
  className = "",
  containerClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}) => {
  const groupClasses = `
    form-group
    form-group-spacing-${spacing}
    ${highlight ? 'form-group-highlight' : ''}
    ${containerClassName}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={groupClasses}>
      {(title || description) && (
        <div className="form-group-header">
          {title && (
            <>
              <div className={`form-group-title ${titleClassName}`}>
                {title}
              </div>
              <div className="form-group-underline" />
            </>
          )}
          {description && (
            <div className={`form-group-description ${descriptionClassName}`}>
              {description}
            </div>
          )}
        </div>
      )}

      <div className={`form-group-content ${className}`}>
        {children}
      </div>
    </div>
  )
}