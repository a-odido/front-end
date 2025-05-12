import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function EditProfile() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    profilePicture: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [previewImage, setPreviewImage] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setFormData(user)
      setPreviewImage(user.profilePicture)
    } else {
      router.push("/login")
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }))
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      alert("Image must be under 5MB.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("user", JSON.stringify(formData))
    router.push("/profile")
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-2">Profile Picture</label>
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              {previewImage ? (
                <img className="h-20 w-20 rounded-full object-cover border" src={previewImage} />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border">
                  <span className="text-sm text-gray-500">No image</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <span className="text-sm text-blue-600 underline">Change Image</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex space-x-2">
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-1/2 px-4 py-2 border rounded" />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-1/2 px-4 py-2 border rounded" />
        </div>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  )
}
