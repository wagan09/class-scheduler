"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const HOURS = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export function Calendar({ schedules, onScheduleClick }) {
  const [calendarSchedules, setCalendarSchedules] = useState([]);

  useEffect(() => {
    // Process schedules for calendar display
    const processedSchedules = schedules.map((schedule) => {
      const dayIndex = DAYS.findIndex(
        (day) => day.toLowerCase() === schedule.day.toLowerCase()
      );

      // Convert time strings to hour indices
      const startTime = convertTimeToIndex(schedule.startTime);
      const endTime = convertTimeToIndex(schedule.endTime);

      return {
        ...schedule,
        dayIndex,
        startIndex: startTime,
        endIndex: endTime,
        duration: endTime - startTime,
      };
    });

    setCalendarSchedules(processedSchedules);
  }, [schedules]);

  // Convert time string (e.g., "7:00 AM") to hour index (0-10)
  const convertTimeToIndex = (timeString) => {
    const hour = Number.parseInt(timeString.split(":")[0]);
    const isPM = timeString.includes("PM");

    if (isPM && hour !== 12) {
      return hour + 5; // 1 PM = index 6
    } else if (!isPM && hour === 12) {
      return 5; // 12 PM = index 5
    } else {
      return hour - 7; // 7 AM = index 0
    }
  };

  // Get the appropriate CSS class based on the schedule color
  const getColorClass = (color) => {
    switch (color) {
      case "gold":
        return "schedule-gold";
      case "blue":
        return "schedule-blue";
      case "green":
        return "schedule-green";
      case "purple":
        return "schedule-purple";
      case "orange":
        return "schedule-orange";
      case "maroon":
      default:
        return "schedule-maroon";
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Calendar Header */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="h-12 flex items-center justify-center font-medium bg-ub-maroon text-white rounded-md">
            Time
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-12 flex items-center justify-center font-medium bg-ub-maroon text-white rounded-md"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        {HOURS.map((hour, hourIndex) => (
          <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
            {/* Time Column */}
            <div className="h-16 flex items-center justify-center text-sm bg-gray-100 rounded-md font-medium text-gray-800">
              {hour}
            </div>

            {/* Day Columns */}
            {DAYS.map((day, dayIndex) => {
              const schedulesForCell = calendarSchedules.filter(
                (schedule) =>
                  schedule.dayIndex === dayIndex &&
                  hourIndex >= schedule.startIndex &&
                  hourIndex < schedule.endIndex
              );

              // Find schedules that start at this hour
              const startingSchedules = calendarSchedules.filter(
                (schedule) =>
                  schedule.dayIndex === dayIndex &&
                  schedule.startIndex === hourIndex
              );

              return (
                <div
                  key={`${day}-${hour}`}
                  className="relative h-16 border border-gray-200 rounded-md bg-white"
                >
                  {startingSchedules.map((schedule) => (
                    <Card
                      key={schedule.id}
                      className={cn(
                        "absolute inset-x-0 cursor-pointer overflow-hidden",
                        getColorClass(schedule.color),
                        schedule.duration > 1 ? "text-xs" : "text-[0.65rem]"
                      )}
                      style={{
                        top: 0,
                        height: `${schedule.duration * 100}%`,
                        zIndex: 10,
                      }}
                      onClick={() => onScheduleClick(schedule)}
                    >
                      <CardContent className="p-1 h-full flex flex-col justify-between">
                        <div className="font-medium truncate">
                          {schedule.courseName}
                        </div>
                        {schedule.duration > 1 && (
                          <>
                            <div className="truncate">
                              Room: {schedule.room}
                            </div>
                            <div className="truncate">
                              Prof: {schedule.professorName}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
