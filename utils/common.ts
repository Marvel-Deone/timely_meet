import { Event } from "@/lib/types/event.types";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

export const formatMeetingTime = (startTime: Date): string => {
    // const date = parseISO(startTime);
    const date = startTime;

    if (isToday(date)) {
        return `Today, ${format(date, "h:mm a")}`
    } else if (isTomorrow(date)) {
        return `Tomorrow, ${format(date, "h:mm a")}`
    } else {
        return `${format(date, "EEE")}, ${format(date, "h:mm a")}` // EEE = short day, like Mon/Tue
    }
}


// / Utility function to generate consistent colors for events
// export const generateEventColor = (event: Event): string => {
//   const colors = ["blue", "green", "purple", "orange", "pink", "indigo", "teal", "red"]

//   // Create a simple hash from the event ID to ensure consistency
//   let hash = 0
//   for (let i = 0; i < eventId.length; i++) {
//     const char = eventId.charCodeAt(i)
//     hash = (hash << 5) - hash + char
//     hash = hash & hash // Convert to 32-bit integer
//   }

//   // Use absolute value and modulo to get a consistent index
//   const colorIndex = Math.abs(hash) % colors.length
//   return colors[colorIndex]
// }

// const generateEventColor = (event: Event): { event: Event } => {
//     const colors = ["blue", "green", "purple", "orange", "pink", "indigo", "teal", "red"]

//     // Create a simple hash from the event ID to ensure consistency
//     let hash = 0
//     for (let i = 0; i < event.id.length; i++) {
//         const char = event.id.charCodeAt(i)
//         hash = (hash << 5) - hash + char
//         hash = hash & hash // Convert to 32-bit integer
//     }

//     // Use absolute value and modulo to get a consistent index
//     const colorIndex = Math.abs(hash) % colors.length
//     return colors[colorIndex]
// }

export const generateEventColor = (event: Event): string => {
  const colors = ["blue", "green", "purple", "orange", "pink", "indigo", "teal", "red"]

  // Create a simple hash from the event ID to ensure consistency
  let hash = 0
  for (let i = 0; i < event.id.length; i++) {
    const char = event.id.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a consistent index
  const colorIndex = Math.abs(hash) % colors.length
  return colors[colorIndex]
}

export const getColorClasses = (color: string) => {
    const colors = {
        blue: "from-blue-500 to-indigo-500",
        green: "from-green-500 to-emerald-500",
        purple: "from-purple-500 to-pink-500",
        orange: "from-orange-500 to-red-500",
        pink: "from-pink-500 to-rose-500",
        indigo: "from-indigo-500 to-purple-500",
        teal: "from-teal-500 to-cyan-500",
        red: "from-red-500 to-pink-500",
    }
    return colors[color as keyof typeof colors] || colors.blue
}