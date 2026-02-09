"use client"

interface Activity {
  type: string
  message: string
  user: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
            <div
              className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                activity.type === "approval"
                  ? "bg-green-500"
                  : activity.type === "rejection"
                    ? "bg-red-500"
                    : activity.type === "payment"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
              }`}
            ></div>
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium">{activity.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">{activity.user}</p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
