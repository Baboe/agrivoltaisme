"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

export default function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to the server
    console.log("Form submitted:", formData)

    // Show success message
    setIsSubmitted(true)

    // Reset form
    setFormData({
      name: "",
      email: "",
      role: "",
      location: "",
    })

    // Hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
          <p>We've added you to our waitlist and will notify you when Ombaa launches in your region.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="bg-white/90 border-0"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="bg-white/90 border-0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select value={formData.role} onValueChange={handleRoleChange} required>
                <SelectTrigger className="bg-white/90 border-0">
                  <SelectValue placeholder="I am a..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar_farm">Solar Farm Owner/Manager</SelectItem>
                  <SelectItem value="shepherd">Shepherd</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your Location/Region"
                className="bg-white/90 border-0"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-white text-green-600 hover:bg-gray-100">
            Join Waitlist
          </Button>
        </form>
      )}
    </div>
  )
}
