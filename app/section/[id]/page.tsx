"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/toaster"
import { getSection, getSchedules, createSchedule, updateSchedule, deleteSchedule } from "@/lib/actions"
import { Calendar } from "@/components/calendar"
import { ScheduleForm } from "@/components/schedule-form"
import { Header } from "@/components/header"

export default function SectionPage({ params }) {
  const { id } = params
  const [section, setSection] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const sectionData = await getSection(id)
        if (sectionData) {
          setSection(sectionData)
          const schedulesData = await getSchedules(id)
          setSchedules(schedulesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Update the handleAddSchedule function to handle the new error response format
  const handleAddSchedule = async (scheduleData) => {
    try {
      const result = await createSchedule({
        ...scheduleData,
        sectionId: id,
      })

      if (result.error) {
        // Error is already handled by the toast in the action
        console.error("Error adding schedule:", result.message)
        return
      }

      setSchedules([...schedules, result])
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding schedule:", error)
    }
  }

  // Update the handleEditSchedule function to match
  const handleEditSchedule = async (scheduleData) => {
    try {
      const result = await updateSchedule(selectedSchedule.id, scheduleData)

      if (result.error) {
        // Error is already handled by the toast in the action
        console.error("Error updating schedule:", result.message)
        return
      }

      setSchedules(schedules.map((schedule) => (schedule.id === result.id ? result : schedule)))
      setIsEditDialogOpen(false)
      setSelectedSchedule(null)
    } catch (error) {
      console.error("Error updating schedule:", error)
    }
  }

  const handleDeleteSchedule = async () => {
    try {
      await deleteSchedule(selectedSchedule.id)
      setSchedules(schedules.filter((schedule) => schedule.id !== selectedSchedule.id))
      setIsDeleteDialogOpen(false)
      setSelectedSchedule(null)
    } catch (error) {
      console.error("Error deleting schedule:", error)
    }
  }

  const openScheduleDetails = (schedule) => {
    setSelectedSchedule(schedule)
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 bg-white">Loading...</div>
      </>
    )
  }

  if (!section) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Section not found</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Sections
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 bg-white">
        <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-ub-maroon">{section.name}</h1>
            <p className="text-muted-foreground">Class Schedule</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => window.history.back()} className="bg-gray-800 hover:bg-gray-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sections
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-ub-maroon hover:bg-ub-darkMaroon text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Schedule</DialogTitle>
                </DialogHeader>
                <ScheduleForm onSubmit={handleAddSchedule} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Calendar schedules={schedules} onScheduleClick={openScheduleDetails} />
        </div>

        {/* Edit Schedule Dialog */}
        {selectedSchedule && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Schedule</DialogTitle>
              </DialogHeader>
              <ScheduleForm initialData={selectedSchedule} onSubmit={handleEditSchedule} />
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setIsDeleteDialogOpen(true)
                  }}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        {selectedSchedule && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Alert variant="destructive">
                  <AlertDescription>
                    Are you sure you want to delete this schedule? This action cannot be undone.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDeleteSchedule} className="bg-gray-800 hover:bg-gray-700 text-white">
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
      <Toaster />
    </>
  )
}
