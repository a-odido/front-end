import { useState } from "react"
import { useRouter } from "next/router"

export default function Signup() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        profilePicture: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    })
    const [error, setError] = useState("")
    const [previewImage, setPreviewImage] = useState("")

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
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
            alert("File is too large or invalid.")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
      
        try {
          const res = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          })
      
          const data = await res.json()
      
          if (res.ok) {
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            router.push("/profile")
          } else {
            setError(data.message || "Signup failed")
          }
        } catch (err) {
          setError("Something went wrong. Please try again.")
        }
      }
      

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-1">Personal Info</label>
                    <p className="text-sm text-gray-500 mb-4">Update your photo and personal details here</p>

                    <div className="border rounded-lg p-6 bg-gray-50">
                        <label className="block font-medium mb-2">Display Image</label>

                        <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-6">
                            <div className="shrink-0 mb-4 md:mb-0">
                                {previewImage ? (
                                    <img
                                        className="h-28 w-28 rounded-full object-cover border border-gray-300"
                                        src={previewImage}
                                        alt="Profile preview"
                                    />
                                ) : (
                                    <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <label className="flex-1 cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                                    <div className="flex justify-center mb-2">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h3m10-6l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                    <p className="text-blue-600 font-medium">Click to upload</p>
                                    <p className="text-sm text-gray-500 mt-1">or drag and drop an image here</p>
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG square photos (Max. 5MB). An image of size 640×640 is recommended.</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-1/2 px-4 py-2 border rounded" />
                    <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-1/2 px-4 py-2 border rounded" />
                </div>
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Sign Up
                </button>
            </form>
        </div>
    )
}