"use client"

import { UserCheck } from "lucide-react"

interface Admin {
  name: string
  email: string
  role: string
  status: string
  lastActive: string
}

interface AdminUsersProps {
  admins: Admin[]
}

export function AdminUsers({ admins }: AdminUsersProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Admin Users</h2>
      <div className="space-y-4">
        {admins.map((admin, idx) => (
          <div key={idx} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{admin.name}</p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  admin.status === "active"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-500/10 text-gray-500"
                }`}
              >
                {admin.status}
              </span>
              <p className="text-xs text-muted-foreground mt-1">{admin.lastActive}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
