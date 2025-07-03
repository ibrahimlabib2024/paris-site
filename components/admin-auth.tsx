"use client"

import type { ReactNode } from "react"

interface AdminAuthProps {
  children: ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  return <div className="admin-auth-wrapper">{children}</div>
}
