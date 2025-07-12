"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, Users, HospitalIcon } from "lucide-react"

interface Hospital {
  id: string
  name: string
  url: string
  status: "active" | "inactive"
}

const hospitals: Hospital[] = [
  {
    id: "hospital_a",
    name: "Hospital A",
    url: "https://quickcare-hospa-production.up.railway.app",
    status: "active",
  },
  {
    id: "hospital_b",
    name: "Hospital B",
    url: "https://hospital-b.railway.app",
    status: "active",
  },
]

export default function LoginPage() {
  const [selectedHospital, setSelectedHospital] = useState<string>("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!selectedHospital || !username || !password) {
        throw new Error("Please fill in all fields")
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospitalId: selectedHospital,
          username,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to hospital admin dashboard
        window.location.href = data.redirectUrl
      } else {
        throw new Error(data.message || "Login failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <HospitalIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">QuickCare Admin</h1>
          <p className="text-gray-600">Hospital Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Select your hospital and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Hospital Selection */}
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital</Label>
                <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        <div className="flex items-center space-x-2">
                          <HospitalIcon className="h-4 w-4" />
                          <span>{hospital.name}</span>
                          {hospital.status === "active" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-blue-900">Demo Credentials</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Username:</strong> admin
                </p>
                <p>
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg shadow">
              <HospitalIcon className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Multi-Hospital</p>
          </div>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg shadow">
              <Shield className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Secure Login</p>
          </div>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg shadow">
              <Users className="h-6 w-6 text-purple-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-600">Patient Management</p>
          </div>
        </div>
      </div>
    </div>
  )
}
