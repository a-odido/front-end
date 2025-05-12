import Calendar from "react-calendar"
import { useEffect, useState } from "react"
import 'react-calendar/dist/Calendar.css'

export default function TodaysSchedules() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [deliveries, setDeliveries] = useState([])
    const [allCustomers, setAllCustomers] = useState([])
    const [designs, setDesigns] = useState([])

    const [selectedCustomerId, setSelectedCustomerId] = useState("")
    const [comment, setComment] = useState("")
    const [designId, setDesignId] = useState("")

    const formatDate = (date) => date.toISOString().split("T")[0]

    useEffect(() => {
        const token = localStorage.getItem("token")

        fetch(`http://localhost:8080/api/customers`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAllCustomers(data))

        fetch(`http://localhost:8080/api/designs`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setDesigns(data))
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token")
        const dateKey = formatDate(selectedDate)

        fetch(`http://localhost:8080/api/schedules/${dateKey}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setDeliveries(data.deliveries || []))
    }, [selectedDate])

    const handleDeleteSchedule = async (customerId) => {
        const token = localStorage.getItem("token")
        const dateKey = formatDate(selectedDate)

        const confirm = window.confirm("Are you sure you want to remove this customer from the schedule?")
        if (!confirm) return

        const res = await fetch(`http://localhost:8080/api/schedules/${dateKey}/${customerId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        if (res.ok) {
            setDeliveries(data.deliveries)
        } else {
            alert("Failed to delete schedule.")
        }
    }

    const handleAddCustomerToDate = async () => {
        const token = localStorage.getItem("token")
        const dateKey = formatDate(selectedDate)

        const res = await fetch(`http://localhost:8080/api/schedules/${dateKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                customerId: selectedCustomerId,
                comment,
                designId
            })
        })

        const updated = await res.json()
        if (res.ok) {
            setDeliveries(updated.deliveries)
            setSelectedCustomerId("")
            setComment("")
            setDesignId("")
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Today's Schedules</h1>

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
            />

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">
                    Customers scheduled for: {selectedDate.toDateString()}
                </h2>

                {deliveries.length === 0 ? (
                    <p className="text-gray-500">No customers scheduled for this day.</p>
                ) : (
                    <ul className="space-y-2 text-sm">
                        {deliveries.map((entry, i) => {
                            const cust = allCustomers.find(c => c._id === entry.customerId)
                            const design = designs.find(d => d._id === entry.designId)

                            return (
                                <li key={i} className="border border-gray-200 p-3 rounded shadow-sm bg-gray-50 relative">
                                    <div className="font-semibold">{cust?.name || "Unknown"}</div>
                                    <div className="text-gray-600 text-xs">{cust?.phone}</div>
                                    {entry.comment && <div className="text-gray-700 mt-1 italic">"{entry.comment}"</div>}
                                    {design && <div className="text-blue-600 text-xs mt-1">Design: {design.title}</div>}

                                    <button
                                        onClick={() => handleDeleteSchedule(entry.customerId)}
                                        className="absolute top-2 right-2 text-red-600 text-xs hover:underline"
                                    >
                                        Delete
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                )}

                <div className="mt-6 space-y-3">
                    <label className="block font-medium">Add Customer to this day:</label>

                    <select
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    >
                        <option value="">-- Select customer --</option>
                        {allCustomers.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Add a comment (e.g., pick up at 3PM)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <select
                        value={designId}
                        onChange={(e) => setDesignId(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    >
                        <option value="">-- Link design (optional) --</option>
                        {designs.map((d) => (
                            <option key={d._id} value={d._id}>{d.title}</option>
                        ))}
                    </select>

                    {designId && (
                        <div className="flex items-center space-x-4 border p-3 rounded bg-gray-50">
                            <img
                                src={designs.find(d => d._id === designId)?.imageUrl}
                                alt="Selected Design"
                                className="w-16 h-16 object-cover rounded border"
                            />
                            <div>
                                <p className="text-sm font-medium">{designs.find(d => d._id === designId)?.title}</p>
                                <p className="text-xs text-gray-500">{designs.find(d => d._id === designId)?.description}</p>
                            </div>
                        </div>
                    )}


                    <button
                        onClick={handleAddCustomerToDate}
                        disabled={!selectedCustomerId}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Assign to Date
                    </button>
                </div>
            </div>
        </div>
    )
}
