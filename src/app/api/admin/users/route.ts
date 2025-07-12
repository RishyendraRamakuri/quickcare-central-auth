import { type NextRequest, NextResponse } from "next/server"
import { admins, hospitals } from "@/lib/database"

// Get all users (for admin management)
export async function GET(request: NextRequest) {
  try {
    // In production, add authentication check here

    const usersWithHospitals = admins.map((admin) => {
      const hospital = hospitals.find((h) => h.id === admin.hospitalId)
      return {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        hospitalId: admin.hospitalId,
        hospitalName: hospital?.name || "Unknown",
        active: admin.active,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
      }
    })

    return NextResponse.json({
      success: true,
      users: usersWithHospitals,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    )
  }
}
