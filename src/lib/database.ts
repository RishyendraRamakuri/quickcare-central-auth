// Simple in-memory database (replace with real database in production)
interface Admin {
  id: string
  username: string
  password: string // In production, this should be hashed
  role: string
  hospitalId: string
  active: boolean
  createdAt: Date
  lastLogin?: Date
}

interface Hospital {
  id: string
  name: string
  url: string
  active: boolean
}

// Hospital database
export const hospitals: Hospital[] = [
  {
    id: "hospital_a",
    name: "Hospital A",
    url: "https://quickcare-hospa-production.up.railway.app",
    active: true,
  },
  {
    id: "hospital_b",
    name: "Hospital B",
    url: "https://quickcare-hospb-production.up.railway.app",
    active: true,
  },
  {
    id: "hospital_c",
    name: "Hospital C",
    url: "https://hospital-c.railway.app",
    active: true,
  },
]

// Admin database (in production, use MongoDB/PostgreSQL)
export const admins: Admin[] = [
  // Hospital A Admins
  {
    id: "admin_1",
    username: "admin_hospital_a",
    password: "SecurePass123!", // Hash this in production
    role: "super_admin",
    hospitalId: "hospital_a",
    active: true,
    createdAt: new Date(),
  },
  {
    id: "admin_2",
    username: "dr_smith",
    password: "DrSmith456!",
    role: "doctor_admin",
    hospitalId: "hospital_a",
    active: true,
    createdAt: new Date(),
  },

  // Hospital B Admins
  {
    id: "admin_3",
    username: "admin_hospital_b",
    password: "SecurePass789!",
    role: "super_admin",
    hospitalId: "hospital_b",
    active: true,
    createdAt: new Date(),
  },
  {
    id: "admin_4",
    username: "nurse_manager",
    password: "NursePass012!",
    role: "nurse_admin",
    hospitalId: "hospital_b",
    active: true,
    createdAt: new Date(),
  },

  // Hospital C Admins
  {
    id: "admin_5",
    username: "admin_hospital_c",
    password: "SecurePass345!",
    role: "super_admin",
    hospitalId: "hospital_c",
    active: true,
    createdAt: new Date(),
  },
]

export function findHospitalById(id: string): Hospital | undefined {
  return hospitals.find((h) => h.id === id && h.active)
}

export function findAdminByCredentials(hospitalId: string, username: string, password: string): Admin | undefined {
  return admins.find(
    (a) => a.hospitalId === hospitalId && a.username === username && a.password === password && a.active,
  )
}

export function updateLastLogin(adminId: string): void {
  const admin = admins.find((a) => a.id === adminId)
  if (admin) {
    admin.lastLogin = new Date()
  }
}
