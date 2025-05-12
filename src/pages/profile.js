import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <button
          onClick={() => router.push("/edit-profile")}
          className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-6">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="h-28 w-28 object-cover rounded-full border border-gray-300"
        />
        <div className="text-center">
          <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="w-full mt-6 space-y-2 text-sm">
          <div className="flex justify-between border-b pb-1">
            <span className="font-medium text-gray-700">Phone:</span>
            <span>{user.phone}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="text-right max-w-[60%] truncate">{user.address}</span>
          </div>
        </div>
      </div>

      {/* Tailor Links */}
      <div className="space-y-3">
        <Link href="/my-designs" className="block bg-gray-100 hover:bg-gray-200 p-3 rounded text-center font-medium">
          My Designs
        </Link>
        <Link href="/customer-details" className="block bg-gray-100 hover:bg-gray-200 p-3 rounded text-center font-medium">
          Customer Details
        </Link>
        <Link href="/todays-schedules" className="block bg-gray-100 hover:bg-gray-200 p-3 rounded text-center font-medium">
          Today's Schedules
        </Link>
      </div>

      <button
        onClick={() => router.push("/add-customer")}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
      >
        + Add Customer
      </button>
    </div>
  )
}
