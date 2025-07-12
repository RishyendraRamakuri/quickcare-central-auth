import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "quickcare-dileepkumar09956-rishi31"

// Hospital database (in production, use a real database)
const hospitals = [
  {
    id: "hospital_a",
    name: "Hospital A",
    url: "https://quickcare-hospa-production.up.railway.app",
    admins: [{ username: "admin", password: "admin123" }],
  },
  {
    id: "hospital_b",
    name: "Hospital B",
    url: "https://quickcare-hospb-production.up.railway.app",
    admins: [{ username: "admin", password: "admin123" }],
  },
]

export async function POST(request: NextRequest) {
  try {
    const { hospitalId, username, password } = await request.json()

    // Find hospital
    const hospital = hospitals.find((h) => h.id === hospitalId)
    if (!hospital) {
      return NextResponse.json(
        {
          success: false,
          message: "Hospital not found",
        },
        { status: 404 },
      )
    }

    // Validate credentials
    const admin = hospital.admins.find((a) => a.username === username && a.password === password)
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // Generate real JWT token
    const token = jwt.sign(
      {
        hospitalId,
        username,
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
      },
      JWT_SECRET,
    )

    // Redirect to hospital with secure token
    const redirectUrl = `${hospital.url}/admin?auth_token=${token}&hospital_id=${hospitalId}`

    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectUrl,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 },
    )
  }
}
