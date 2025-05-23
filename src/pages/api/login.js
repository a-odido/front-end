export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body

    if (email && password) {
      return res.status(200).json({ token: "fake-jwt-token" })
    }

    return res.status(401).json({ message: "Invalid credentials" })
  }

  res.setHeader("Allow", ["POST"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
