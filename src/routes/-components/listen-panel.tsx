import { Music } from "lucide-react"

export default function ListenPanel() {
    
  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-4 m-2 overflow-y-auto max-h-screen">
      <div className="flex items-center mb-4">
        <Music className="w-6 h-6 mr-2 text-purple-600" />
        <h2 className="text-xl font-bold">Listen Now</h2>
      </div>
    </div>
  )
}