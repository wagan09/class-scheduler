"use client"

import { useState, useEffect } from "react"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

export function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    // Listen for toast events
    const handleToast = (event) => {
      const { toast } = event.detail
      setToasts((prevToasts) => [...prevToasts, { ...toast, id: Date.now() }])
    }

    document.addEventListener("toast", handleToast)
    return () => document.removeEventListener("toast", handleToast)
  }, [])

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          <ToastClose onClick={() => setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export function toast({ title, description, variant = "default" }) {
  const event = new CustomEvent("toast", {
    detail: {
      toast: {
        title,
        description,
        variant,
      },
    },
  })
  document.dispatchEvent(event)
}
