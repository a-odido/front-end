import { useState, useRef } from "react"
import { useEffect } from "react"

const baseUrl = process.env.NEXT_PUBLIC_API_URL


export default function MyDesigns() {
  const [designs, setDesigns] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [previewModal, setPreviewModal] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState(null)

  const fileInputRef = useRef(null)


  useEffect(() => {
    const fetchDesigns = async () => {
      const token = localStorage.getItem("token")
      console.log(token,"this is token")
      const res = await fetch(`http://localhost:8080/api/designs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        setDesigns(data)
      } else {
        console.log("No designs found")
      }
    }

    fetchDesigns()
  }, [])


  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setShowModal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteDesign = async (id) => {
    const token = localStorage.getItem("token")
    const confirmed = window.confirm("Are you sure you want to delete this design?")
    if (!confirmed) return

    const res = await fetch(`http://localhost:8080/api/designs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })



    if (res.ok) {
      setShowModal(false)
      setDesigns((prev) => prev.filter((d) => d._id !== id))
    } else {
      alert("Failed to delete design.")
    }
  }


  const handleAddDesign = async () => {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("image", fileInputRef.current.files[0])
      formData.append("title", newTitle || "Untitled Design")
      formData.append("description", newDescription || "No description added.")

      const res = await fetch(`http://localhost:8080/api/designs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const data = await res.json()
console.log(data,"return data")
      if (res.ok) {
        setDesigns((prev) => [data, ...prev])
        setShowModal(false)
        setPreviewImage(null)
        setNewTitle("")
        setNewDescription("")
      } else {
        alert(data.message || "Failed to upload design.")
      }
    } catch (err) {
      console.error(err)
      alert("Upload error")
    }
  }


  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Designs</h1>
        <button
          onClick={handleUploadClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Design
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {designs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No designs yet. Click “Add Design” to upload.</p>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {designs.map((design) => (
            <div onClick={() => { setSelectedDesign(design); setPreviewModal(true) }} key={design.id} className="break-inside-avoid cursor-pointer shadow rounded overflow-hidden relative group">
              <img
                src={design.imageUrl || design.image}
                alt="Design"
                className="w-full h-64 object-cover object-center rounded"
              />

              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white p-4 text-center">
                <h3 className="text-lg font-semibold">{design.title}</h3>
                <p className="text-sm mt-1">{design.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(design.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <button
                  onClick={() => handleDeleteDesign(design._id)}
                  className="absolute top-2 right-2 bg-white text-red-600 hover:text-red-800 p-1 rounded-full shadow"
                  title="Delete"
                >
                  🗑
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {previewModal && selectedDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full relative">
            <button onClick={() => setPreviewModal(false)} className="absolute top-2 right-2 text-gray-600 text-xl">&times;</button>
            <img src={selectedDesign.imageUrl} alt="Full Design" className="w-full h-auto rounded mb-4" />
            <h2 className="text-xl font-semibold">{selectedDesign.title}</h2>
            <p className="text-gray-600 mt-2">{selectedDesign.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Created on: {new Date(selectedDesign.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Design Details</h2>
            <img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded mb-4" />
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setPreviewImage(null)
                }}
                className="px-4 py-2 text-gray-600 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDesign}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
