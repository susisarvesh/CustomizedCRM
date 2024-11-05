import React from 'react'

export function Dialog({ children, open, onOpenChange }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {children}
      </div>
    </div>
  )
}

export function DialogTrigger({ children, asChild }) {
  return <>{children}</>
}

export function DialogContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}