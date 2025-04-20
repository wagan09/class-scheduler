"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import {
  getSections,
  createSection,
  deleteSection,
  initializeSampleData,
} from "@/lib/actions";
import { Header } from "@/components/header";

export default function Home() {
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();

    const fetchSections = async () => {
      setIsLoading(true);
      try {
        const fetchedSections = await getSections();
        setSections(fetchedSections);
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      try {
        const newSection = await createSection(newSectionName);
        setSections([...sections, newSection]);
        setNewSectionName("");
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error creating section:", error);
      }
    }
  };

  const handleDeleteSection = async () => {
    if (!sectionToDelete) return;

    try {
      await deleteSection(sectionToDelete.id);
      setSections(
        sections.filter((section) => section.id !== sectionToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setSectionToDelete(null);
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const openDeleteDialog = (section) => {
    setSectionToDelete(section);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Class Scheduler</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-ub-maroon hover:bg-ub-darkMaroon text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create New Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Section</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSection} className="space-y-4 mt-4">
                <Input
                  placeholder="Section Name (e.g. CPE2-1)"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full bg-ub-maroon hover:bg-ub-darkMaroon text-white"
                >
                  Create Section
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading sections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">
                  No sections found. Create your first section to get started.
                </p>
              </div>
            ) : (
              sections.map((section) => (
                <Card
                  key={section.id}
                  className="hover:shadow-md transition-shadow border-gray-200 bg-white"
                >
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-ub-maroon">
                        {section.name}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-700"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(section)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Section
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground">
                      Click to view and manage schedules
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/section/${section.id}`} className="w-full">
                      <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                        View Schedule
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {sectionToDelete && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Alert variant="destructive">
                  <AlertDescription>
                    Are you sure you want to delete the section "
                    {sectionToDelete.name}"? This will also delete all schedules
                    associated with this section. This action cannot be undone.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteSection}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
      <Toaster />
    </>
  );
}
