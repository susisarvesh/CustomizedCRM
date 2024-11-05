import React from 'react'

export function Select({ children, ...props }) {
  return (
    <select
      className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      {...props}
    >
      {children}
    </select>
  )
}

export function SelectContent({ children }) {
  return <>{children}</>
}

export function SelectItem({ children, ...props }) {
  return <option {...props}>{children}</option>
}

export function SelectTrigger({ children }) {
  return <>{children}</>
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>
}