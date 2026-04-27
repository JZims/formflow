import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to FormFlow</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create collaborative forms, share them with others, and see real-time updates as people respond
        </p>
        <Link href="/forms/new">
          <Button variant="primary" size="lg">
            Create Your First Form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">📝 Easy to Use</h2>
          <p className="text-gray-600">
            Drag and drop to build forms. No coding required.
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">🔗 Share Instantly</h2>
          <p className="text-gray-600">
            Share your form via link with collaborators and collectors.
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">⚡ Real-time Sync</h2>
          <p className="text-gray-600">
            See changes and responses update instantly without refreshing.
          </p>
        </div>
      </div>
    </div>
  )
}
