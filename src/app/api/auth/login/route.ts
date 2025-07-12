import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { findHospitalById, findAdminByCredentials, updateLastLogin } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const { hospitalId, username, password } = await request.json()

    // Find hospital
    const hospital = findHospitalById(hospitalId)
    if (!hospital) {
      return NextResponse.json(
        {
          success: false,
          message: "Hospital not found or inactive",
        },
        { status: 404 },
      )
    }

    // Validate credentials
    const admin = findAdminByCredentials(hospitalId, username, password)
    if (!admin) {
      // Log failed login attempt
      console.log(`Failed login attempt for hospital ${hospitalId}, username: ${username}, IP: ${request.ip}`)

      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // Update last login
    updateLastLogin(admin.id)

    // Log successful login
    console.log(`Successful login for hospital ${hospitalId}, username: ${username}, role: ${admin.role}`)

    // Generate JWT token with role information
    const token = jwt.sign(
      {
        hospitalId,
        username,
        role: admin.role,
        adminId: admin.id,
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
      user: {
        username: admin.username,
        role: admin.role,
        hospitalName: hospital.name,
      },
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
