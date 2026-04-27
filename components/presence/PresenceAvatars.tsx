'use client'

interface PresenceUser {
  name: string
  color: string
}

interface PresenceAvatarsProps {
  presenceState: Record<string, PresenceUser>
}

export function PresenceAvatars({ presenceState }: PresenceAvatarsProps) {
  const users = Object.values(presenceState)
  const displayedUsers = users.slice(0, 3)
  const remainingCount = Math.max(0, users.length - 3)

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {displayedUsers.map((user, index) => {
          const initials = user.name
            .split(' ')
            .map(n => n.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)

          return (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
              style={{ backgroundColor: user.color }}
              aria-label={`${user.name} is present`}
              title={user.name}
            >
              {initials}
            </div>
          )
        })}
      </div>
      {remainingCount > 0 && (
        <span className="text-xs font-medium text-gray-600">+{remainingCount}</span>
      )}
    </div>
  )
}
