import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
    } else {
      setUserEmail("you@example.com")
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="text-gray-600">Logged in as: <strong>{userEmail}</strong></p>
    </div>
  )
}
