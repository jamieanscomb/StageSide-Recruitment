'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast } from '@/lib/types'

interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '360px',
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="animate-slide-down"
            style={{
              backgroundColor: '#1A1A1A',
              borderLeft: `3px solid ${toast.type === 'success' ? '#E8FF00' : '#FF3D3D'}`,
              padding: '14px 20px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              color: '#F5F5F5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{
                background: 'none',
                border: 'none',
                color: '#555',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1,
                padding: '0',
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
