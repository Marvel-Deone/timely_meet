"use client";

import React, { Suspense } from "react";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Calendar, Clock, Users, Plus, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RiseLoader } from "react-spinners";
import { getUserEvents } from "@/actions/event";
import type { Event } from "@/lib/types/event.types";
import Image from "next/image";
import useFetch from "@/hooks/use-fetch";
import EventCard from "@/components/dashboard/event-card";
import { useEventContext } from "@/context/EventContext";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "all" | "public" | "private" | "active";

interface EventsResponse {
  events: Event[]
  username: string
}

interface EventStats {
  total: number
  totalBookings: number
  publicEvents: number
  activeEvents: number
}

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const { eventData: userEvents, loading, refetchEvents, error } = useEventContext();
  useEffect(() => {
    refetchEvents();
  }, [refetchEvents]);

  const processedData = useMemo(() => {
    if (!userEvents?.events) {
      return { events: [], username: "", stats: { total: 0, totalBookings: 0, publicEvents: 0, activeEvents: 0 } }
    }

    const events: Event[] = userEvents.events.map((event: any) => ({
      ...event,
      description: event.description ?? "",
    }));

    const stats: EventStats = {
      total: events.length,
      totalBookings: events.reduce((sum, event) => sum + event._count.bookings, 0),
      publicEvents: events.filter((e) => !e.is_private).length,
      activeEvents: events.filter((e) => e._count.bookings > 0).length,
    }

    return {
      events,
      username: userEvents.username,
      stats,
    }
  }, [userEvents])

  const filteredEvents = useMemo(() => {
    return processedData.events.filter((event) => {
      const description = (event.description ?? "").toLowerCase();

      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        (filterType === "public" && !event.is_private) ||
        (filterType === "private" && event.is_private) ||
        (filterType === "active" && event._count.bookings > 0)

      return matchesSearch && matchesFilter
    })
  }, [processedData.events, searchQuery, filterType]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleFilterChange = useCallback((filter: FilterType) => {
    setFilterType(filter)
  }, [])

  if (loading) {
    return <EventsLoading />
  }

  if (error) {
    return <div className="w-full py-10 text-center text-red-500">Failed to load events. Please try again later.</div>
  }

  if (processedData.events.length === 0) {
    return (
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first event"}
          </p>
          {!searchQuery && filterType === "all" && (
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const { stats } = processedData;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage your meeting events and bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Total Events" value={stats.total} icon={Calendar} bgColor="bg-blue-500" />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={Users} bgColor="bg-green-500" />
        <StatsCard title="Public Events" value={stats.publicEvents} icon={Globe} bgColor="bg-purple-500" />
        <StatsCard title="Active Events" value={stats.activeEvents} icon={Clock} bgColor="bg-orange-500" />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-white/50 border-gray-200/50"
          />
        </div>
        <FilterButtons activeFilter={filterType} onFilterChange={handleFilterChange} />
      </div>

      {/* Events Grid */}
      <EventsGrid
        events={filteredEvents}
        username={processedData.username}
        searchQuery={searchQuery}
        filterType={filterType}
        onRefresh={() => refetchEvents(true)}
      />
    </div>
  )
}

const StatsCard = React.memo<{
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
}>(({ title, value, icon: Icon, bgColor }) => (
  <Card className="bg-white border shadow-sm">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
))

StatsCard.displayName = "StatsCard";

const FilterButtons = React.memo<{
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}>(({ activeFilter, onFilterChange }) => {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "public", label: "Public" },
    { key: "private", label: "Private" },
    { key: "active", label: "Active" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ key, label }) => (
        <Button
          key={key}
          className="cursor-pointer"
          variant={activeFilter === key ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
})

FilterButtons.displayName = "FilterButtons";


// Loading skeleton for event list
const EventsLoading = () => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
)

const EventsGrid = React.memo<{
  events: Event[]
  username: string
  searchQuery: string
  filterType: FilterType
  onRefresh: () => void
}>(({ events, username, searchQuery, filterType, onRefresh }) => {
  if (events.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} username={username} is_public={false} onEventDeleted={onRefresh} />
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600 mb-4">
          {searchQuery || filterType !== "all"
            ? "Try adjusting your search or filter criteria"
            : "Get started by creating your first event"}
        </p>
        {!searchQuery && filterType === "all" && (
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        )}
      </CardContent>
    </Card>
  )
});

EventsGrid.displayName = "EventsGrid";

export default Events;
