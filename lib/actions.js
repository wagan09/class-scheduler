"use client"

import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"

// Helper to get data from localStorage
const getLocalData = (key, defaultValue = []) => {
  if (typeof window === "undefined") return defaultValue

  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : defaultValue
}

// Helper to save data to localStorage
const setLocalData = (key, data) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// Section Actions
export async function getSections() {
  try {
    return getLocalData("sections", [])
  } catch (error) {
    console.error("Storage Error:", error)
    return []
  }
}

export async function getSection(id) {
  try {
    const sections = getLocalData("sections", [])
    return sections.find((section) => section.id === id) || null
  } catch (error) {
    console.error("Storage Error:", error)
    return null
  }
}

export async function createSection(name) {
  try {
    const sections = getLocalData("sections", [])
    const newSection = {
      id: uuidv4(),
      name,
      created_at: new Date().toISOString(),
    }

    sections.push(newSection)
    setLocalData("sections", sections)

    return newSection
  } catch (error) {
    console.error("Storage Error:", error)
    throw new Error("Failed to create section")
  }
}

export async function deleteSection(id) {
  try {
    // Delete section
    const sections = getLocalData("sections", [])
    const updatedSections = sections.filter((section) => section.id !== id)
    setLocalData("sections", updatedSections)

    // Delete all schedules for this section
    const schedules = getLocalData("schedules", [])
    const updatedSchedules = schedules.filter((schedule) => schedule.sectionId !== id)
    setLocalData("schedules", updatedSchedules)

    return { success: true }
  } catch (error) {
    console.error("Storage Error:", error)
    throw new Error("Failed to delete section")
  }
}

// Schedule Actions
export async function getSchedules(sectionId) {
  try {
    const schedules = getLocalData("schedules", [])
    return schedules
      .filter((schedule) => schedule.sectionId === sectionId)
      .sort((a, b) => {
        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        if (dayDiff !== 0) return dayDiff
        return a.startTime.localeCompare(b.startTime)
      })
  } catch (error) {
    console.error("Storage Error:", error)
    return []
  }
}

// Helper to check for schedule conflicts
const hasScheduleConflict = (newSchedule, existingSchedules) => {
  // Convert time strings to minutes for easier comparison
  const convertTimeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    if (period === "PM" && hours !== 12) {
      hours += 12
    } else if (period === "AM" && hours === 12) {
      hours = 0
    }

    return hours * 60 + minutes
  }

  const newStart = convertTimeToMinutes(newSchedule.startTime)
  const newEnd = convertTimeToMinutes(newSchedule.endTime)
  const newDay = newSchedule.day

  return existingSchedules.some((schedule) => {
    // Skip if different day or it's the same schedule being edited
    if (schedule.day !== newDay || (newSchedule.id && schedule.id === newSchedule.id)) {
      return false
    }

    const existingStart = convertTimeToMinutes(schedule.startTime)
    const existingEnd = convertTimeToMinutes(schedule.endTime)

    // Check for overlap
    return (
      (newStart >= existingStart && newStart < existingEnd) || // New start time is within existing schedule
      (newEnd > existingStart && newEnd <= existingEnd) || // New end time is within existing schedule
      (newStart <= existingStart && newEnd >= existingEnd) // New schedule completely contains existing schedule
    )
  })
}

// Update the createSchedule function to better handle conflicts
export async function createSchedule(data) {
  try {
    const schedules = getLocalData("schedules", [])
    const sectionSchedules = schedules.filter((schedule) => schedule.sectionId === data.sectionId)

    // Check for conflicts
    if (hasScheduleConflict(data, sectionSchedules)) {
      toast({
        title: "Schedule Conflict",
        description: "This schedule conflicts with an existing schedule. Please choose a different time or day.",
        variant: "destructive",
      })
      // Return an object with error information instead of throwing
      return { error: true, message: "Schedule has a conflict" }
    }

    const newSchedule = {
      id: uuidv4(),
      sectionId: data.sectionId,
      courseName: data.courseName,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
      professorName: data.professorName,
      color: data.color || "maroon", // Add color field with default
      createdAt: new Date().toISOString(),
    }

    schedules.push(newSchedule)
    setLocalData("schedules", schedules)

    return newSchedule
  } catch (error) {
    console.error("Storage Error:", error)
    return { error: true, message: error.message || "Failed to create schedule" }
  }
}

// Update the updateSchedule function to match the same pattern
export async function updateSchedule(id, data) {
  try {
    const schedules = getLocalData("schedules", [])
    const index = schedules.findIndex((schedule) => schedule.id === id)

    if (index === -1) {
      return { error: true, message: "Schedule not found" }
    }

    const sectionId = schedules[index].sectionId
    const sectionSchedules = schedules.filter((schedule) => schedule.sectionId === sectionId)

    // Check for conflicts (include the schedule ID to exclude itself from conflict check)
    if (hasScheduleConflict({ ...data, id }, sectionSchedules)) {
      toast({
        title: "Schedule Conflict",
        description: "This schedule conflicts with an existing schedule. Please choose a different time or day.",
        variant: "destructive",
      })
      return { error: true, message: "Schedule has a conflict" }
    }

    const updatedSchedule = {
      ...schedules[index],
      courseName: data.courseName,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
      professorName: data.professorName,
      color: data.color || schedules[index].color || "maroon", // Preserve or set default color
    }

    schedules[index] = updatedSchedule
    setLocalData("schedules", schedules)

    return updatedSchedule
  } catch (error) {
    console.error("Storage Error:", error)
    return { error: true, message: error.message || "Failed to update schedule" }
  }
}

export async function deleteSchedule(id) {
  try {
    const schedules = getLocalData("schedules", [])
    const filteredSchedules = schedules.filter((schedule) => schedule.id !== id)

    setLocalData("schedules", filteredSchedules)

    return { success: true }
  } catch (error) {
    console.error("Storage Error:", error)
    throw new Error("Failed to delete schedule")
  }
}

// Initialize with sample data if empty
export function initializeSampleData() {
  const sections = getLocalData("sections", [])

  if (sections.length === 0) {
    const sampleSections = [
      { id: uuidv4(), name: "CPE2-1", created_at: new Date().toISOString() },
      { id: uuidv4(), name: "CPE3-2", created_at: new Date().toISOString() },
      { id: uuidv4(), name: "CPE2-2", created_at: new Date().toISOString() },
    ]

    setLocalData("sections", sampleSections)
  }
}
