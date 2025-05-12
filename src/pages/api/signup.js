export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    },
  },
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, ...rest } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." })
    }

    const user = { email, ...rest }

    return res.status(200).json({
      token: "mock-token-123",
      user,
    })
  }

  res.setHeader("Allow", ["POST"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}

