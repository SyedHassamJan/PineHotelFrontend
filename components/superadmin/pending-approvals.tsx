"use client"

import { Clock } from "lucide-react"

interface PendingApproval {
  type: string
  name: string
  submittedBy: string
  date: string
  status: string
}

interface PendingApprovalsProps {
  approvals: PendingApproval[]
}

export function PendingApprovals({ approvals }: PendingApprovalsProps) {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Pending Approvals</h2>
        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-semibold rounded-full">
          {approvals.length} Pending
        </span>
      </div>
      <div className="space-y-4">
        {approvals.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between pb-4 border-b border-border last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {item.type}
                  </span>
                  <p className="font-semibold text-foreground">{item.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">By: {item.submittedBy}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
