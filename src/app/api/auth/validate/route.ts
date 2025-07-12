import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "quickcare-dileepkumar09956-rishi31"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const { hospitalId } = await request.json()

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "No authorization token provided",
        },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7)

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Validate token claims
      if (decoded.hospitalId === hospitalId && decoded.username && decoded.role === "admin") {
        return NextResponse.json({
          success: true,
          data: {
            hospitalId: decoded.hospitalId,
            username: decoded.username,
            role: decoded.role,
          },
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid token claims",
          },
          { status: 401 },
        )
      }
    } catch (jwtError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
