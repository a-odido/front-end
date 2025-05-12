import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setLoggedIn(!!token)
  }, [router.pathname]) 

  const handleLogout = () => {
    localStorage.removeItem("token")
    setLoggedIn(false)
    router.push("/login")
  }

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-lg font-bold">TailorBoy</Link>
      <div className="space-x-4">
        {loggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  )
}
