import { useState, useEffect } from "react"
const baseUrl = process.env.NEXT_PUBLIC_API_URL

export default function CustomerDetails() {
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [search, setSearch] = useState("")
    const [filteredList, setFilteredList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState(getEmptyCustomer())

    function getEmptyCustomer() {
        return {
            name: "",
            phone: "",
            address: "",
            note: "",
            profileImage: "",
            createdAt: null,
            updatedAt: null,
            measurements: {
                neck: "",
                shoulder: "",
                bust: "",
                waist: "",
                hips: "",
                sleeve: "",
                legLength: "",
                chest: "",
                inseam: "",
                ankle: "",
                wrist: ""
            }
        }
    }

    const handleAddOrUpdateCustomer = async () => {
        const token = localStorage.getItem("token")
        const timestamp = new Date().toISOString()
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        if (formData._id) {
            const res = await fetch(`http://localhost:8080/api/customers/${formData._id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ ...formData, updatedAt: timestamp })
            })

            const updated = await res.json()
            if (res.ok) {
                const list = customers.map(c => (c._id === updated._id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name))
                setCustomers(list)
                setSelectedCustomer(updated)
            }
        } else {
            const res = await fetch(`http://localhost:8080/api/customers`, {
                method: "POST",
                headers,
                body: JSON.stringify({ ...formData, createdAt: timestamp, updatedAt: timestamp })
            })
console.log(res, "customers created")
            const created = await res.json()
            if (res.ok) {
                const list = [...customers, created].sort((a, b) => a.name.localeCompare(b.name))
                setCustomers(list)
                setSelectedCustomer(created)
            }
        }

        setShowModal(false)
        setFormData(getEmptyCustomer())
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            const token = localStorage.getItem("token")
            const res = await fetch(`http://localhost:8080/api/customers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()
            if (res.ok) {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name))
                setCustomers(sorted)
            }
        }

        fetchCustomers()
    }, [])

    useEffect(() => {
        if (search.length > 0) {
            const list = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
            setFilteredList(list)
        } else {
            setFilteredList([])
        }
    }, [search, customers])

    const handleSelect = (customer) => {
        setSelectedCustomer(customer)
        setSearch("")
        setFilteredList([])
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        if (name in formData.measurements) {
            setFormData((prev) => ({
                ...prev,
                measurements: { ...prev.measurements, [name]: value }
            }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?")
        if (!confirmDelete) return


        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/customers/${selectedCustomer._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })

        if (res.ok) {
            const list = customers.filter(c => c._id !== selectedCustomer._id)
            setCustomers(list)
            setSelectedCustomer(null)
        }
    }

    function formatShareMessage(customer) {
        const lines = [
            `Customer: ${customer.name}`,
            `Phone: ${customer.phone}`,
            `Address: ${customer.address}`,
            ``,
            `Measurements:`,
            ...Object.entries(customer.measurements).map(
                ([key, value]) => `${key.replace(/([A-Z])/g, ' $1')}: ${value || "-"}`
            ),
            ``,
            `Note: ${customer.note || "-"}`
        ]
        return lines.join("\n")
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customer Details</h1>
                <button
                    onClick={() => {
                        setFormData(getEmptyCustomer())
                        setShowModal(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Customer
                </button>
            </div>

            <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded mb-6"
            />

            {/* Alphabetical listing */}
            {search === "" && customers.length > 0 && (
                <div className="mb-8 space-y-3">
                    {customers.map((c) => (
                        <div
                            key={c._id}
                            onClick={() => handleSelect(c)}
                            className="border px-4 py-3 rounded cursor-pointer hover:bg-gray-50 shadow-sm"
                        >
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-sm text-gray-600">{c.phone}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Search dropdown */}
            {filteredList.length > 0 && (
                <ul className="bg-white border mt-1 max-h-60 overflow-y-auto shadow-md rounded z-10">
                    {filteredList.map((customer) => (
                        <li
                            key={customer._id}
                            onClick={() => handleSelect(customer)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {customer.name}
                        </li>
                    ))}
                </ul>
            )}

            {selectedCustomer && (
                <div className="bg-white p-6 rounded shadow space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">{selectedCustomer.name}</h2>
                        <div className="space-x-2">
                            <button
                                onClick={() => {
                                    setFormData(selectedCustomer)
                                    setShowModal(true)
                                }}
                                className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600"
                            >Edit</button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                            >Delete</button>
                            <button
                                onClick={() => window.print()}
                                className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
                            >Print</button>
                            <a
                                href={`mailto:?subject=Customer Measurements for ${selectedCustomer.name}&body=${encodeURIComponent(formatShareMessage(selectedCustomer))}`}
                                className="text-blue-600 text-xs underline"
                                target="_blank"
                            >Share via Email</a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(formatShareMessage(selectedCustomer))}`}
                                className="text-green-600 text-xs underline"
                                target="_blank"
                            >Share via WhatsApp</a>
                        </div>
                    </div>
                    <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                    <p><strong>Address:</strong> {selectedCustomer.address}</p>
                    <p><strong>Note:</strong> {selectedCustomer.note || "—"}</p>
                    <div>
                        <h3 className="font-semibold mb-1">Measurements</h3>
                        <ul className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(selectedCustomer.measurements).map(([key, value]) => (
                                <li key={key} className="capitalize">
                                    <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value || "-"}
                                </li>
                            ))}
                        </ul>
                        <div className="text-sm text-gray-500 mt-4 space-y-1">
                            {selectedCustomer.createdAt && (
                                <p><strong>Created:</strong> {new Date(selectedCustomer.createdAt).toLocaleString()}</p>
                            )}
                            {selectedCustomer.updatedAt && (
                                <p><strong>Last Updated:</strong> {new Date(selectedCustomer.updatedAt).toLocaleString()}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">{formData._id ? "Edit" : "Add"} Customer</h2>
                        <div className="space-y-3">
                            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" />
                            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" />
                            <input name="address" placeholder="Address" value={formData.address} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" />
                            <textarea name="note" placeholder="Additional Note" value={formData.note} onChange={handleFormChange} className="w-full border px-3 py-2 rounded" rows={3} />
                            <h3 className="font-semibold mt-4 mb-1">Measurements</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.keys(formData.measurements).map((key) => (
                                    <input
                                        key={key}
                                        name={key}
                                        placeholder={`${key.replace(/([A-Z])/g, ' $1')} (in)`}
                                        value={formData.measurements[key]}
                                        onChange={handleFormChange}
                                        className="border px-3 py-2 rounded"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-2">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setFormData(getEmptyCustomer())
                                }}
                                className="px-4 py-2 border rounded"
                            >Cancel</button>
                            <button
                                onClick={handleAddOrUpdateCustomer}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}