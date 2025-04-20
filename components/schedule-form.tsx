"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const TIMES = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
]

const COLOR_OPTIONS = [
  { value: "maroon", label: "Maroon", class: "bg-ub-maroon/20" },
  { value: "gold", label: "Gold", class: "bg-ub-gold/20" },
  { value: "blue", label: "Blue", class: "bg-blue-100" },
  { value: "green", label: "Green", class: "bg-green-100" },
  { value: "purple", label: "Purple", class: "bg-purple-100" },
  { value: "orange", label: "Orange", class: "bg-orange-100" },
]

export function ScheduleForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    courseName: "",
    day: "Monday",
    startTime: "7:00 AM",
    endTime: "8:00 AM",
    room: "",
    professorName: "",
    color: "maroon", // Default color
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        courseName: initialData.courseName || "",
        day: initialData.day || "Monday",
        startTime: initialData.startTime || "7:00 AM",
        endTime: initialData.endTime || "8:00 AM",
        room: initialData.room || "",
        professorName: initialData.professorName || "",
        color: initialData.color || "maroon",
      })
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate end time is after start time
    const startIndex = TIMES.indexOf(formData.startTime)
    const endIndex = TIMES.indexOf(formData.endTime)

    if (endIndex <= startIndex) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive",
      })
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="courseName">Course Name</Label>
        <Input
          id="courseName"
          value={formData.courseName}
          onChange={(e) => handleChange("courseName", e.target.value)}
          required
          className="border-ub-maroon/20 focus-visible:ring-ub-maroon"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="day">Day</Label>
        <Select value={formData.day} onValueChange={(value) => handleChange("day", value)}>
          <SelectTrigger className="border-ub-maroon/20">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Select value={formData.startTime} onValueChange={(value) => handleChange("startTime", value)}>
            <SelectTrigger className="border-ub-maroon/20">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {TIMES.slice(0, -1).map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Select value={formData.endTime} onValueChange={(value) => handleChange("endTime", value)}>
            <SelectTrigger className="border-ub-maroon/20">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {TIMES.slice(1).map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="room">Room</Label>
        <Input
          id="room"
          value={formData.room}
          onChange={(e) => handleChange("room", e.target.value)}
          required
          className="border-ub-maroon/20 focus-visible:ring-ub-maroon"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="professorName">Professor Name</Label>
        <Input
          id="professorName"
          value={formData.professorName}
          onChange={(e) => handleChange("professorName", e.target.value)}
          required
          className="border-ub-maroon/20 focus-visible:ring-ub-maroon"
        />
      </div>

      <div className="space-y-2">
        <Label>Card Color</Label>
        <RadioGroup
          value={formData.color}
          onValueChange={(value) => handleChange("color", value)}
          className="grid grid-cols-3 gap-2"
        >
          {COLOR_OPTIONS.map((color) => (
            <div key={color.value} className="flex items-center space-x-2">
              <RadioGroupItem value={color.value} id={`color-${color.value}`} />
              <Label htmlFor={`color-${color.value}`} className="flex items-center cursor-pointer">
                <span className={`w-4 h-4 rounded-full mr-2 ${color.class}`}></span>
                {color.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full bg-ub-maroon hover:bg-ub-darkMaroon text-white">
        {initialData ? "Update Schedule" : "Add Schedule"}
      </Button>
    </form>
  )
}
