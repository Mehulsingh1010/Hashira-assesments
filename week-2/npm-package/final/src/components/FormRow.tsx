"use client"

import type React from "react"

export interface FormRowProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: string
}

export const FormRow: React.FC<FormRowProps> = ({ children, columns = 2, gap = "16px" }) => {
  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
      marginBottom: gap,
    },
  }

  return <div style={styles.container}>{children}</div>
}
