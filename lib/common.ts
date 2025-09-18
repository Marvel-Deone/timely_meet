"use client";

import { Event } from "@/lib/types/event.types";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { Clock, Calendar, Info, Users, Vote, UserCheck } from "lucide-react";

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

export const generateEventColor = (event: Event): string => {
    const colors = ["blue", "green", "purple", "orange", "pink", "indigo", "teal", "red"]

    // Create a simple hash from the event ID to ensure consistency
    let hash = 0
    for (let i = 0; i < event.id.length; i++) {
        const char = event.id.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }

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

export function getEventTypeLabel(type: string): string {
    const map: Record<string, string> = {
        ONE_ON_ONE: "One on One",
        GROUP: "Group",
        POLL: "Poll",
        ROUND_ROBIN: "Round Robin",
        COLLECTIVE: "Collective",
    };
    return map[type] || type; // fallback to raw value
}

export function toLocalInputValue(isoString: string) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

export function toISOStringValue(localValue: string) {
    if (!localValue) return "";
    return new Date(localValue).toISOString();
}

  export const getEventTypeInfo = (type: string) => {
    switch (type) {
      case "ONE_ON_ONE":
        return { label: "One-on-One", icon: UserCheck, color: "bg-blue-100 text-blue-700" }
      case "GROUP":
        return { label: "Group Event", icon: Users, color: "bg-green-100 text-green-700" }
      case "POLL":
        return { label: "Poll Event", icon: Vote, color: "bg-purple-100 text-purple-700" }
      default:
        return { label: "Event", icon: Calendar, color: "bg-gray-100 text-gray-700" }
    }
  }

// export function LocalizedDate({ date }: { date: string }) {
//   const [formatted, setFormatted] = useState("");

//   useEffect(() => {
//     setFormatted(
//       new Date(date).toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })
//     );
//   }, [date]);

// return <span>{formatted ?? "…"}</span>;

// }


// export function LocalizedDate({ date }: { date: string }) {
//  const [formatted, setFormatted] = useState<string | null>("" as string | null);


//   useEffect(() => {
//     setFormatted(
//       new Date(date).toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })
//     );
//   }, [date]);

//   return <span>{formatted ? formatted : "…"}</span>;

// }

