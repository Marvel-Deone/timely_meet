import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserEvents = (params?: {
    type?: "ONE_ON_ONE" | "GROUP" | "POLL" | "ROUND_ROBIN" | "COLLECTIVE";
    status?: "active" | "completed" | "cancelled";
}) => {
    return useQuery({
        queryKey: ["events", params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (params?.type) {
                searchParams.append('type', params.type);
            }
            if (params?.status) {
                searchParams.append('status', params.status);
            }
            const queryString = searchParams.toString();
            const url = `/api/events${queryString ? `?${queryString}` : ''}`;
            const res = await fetch(url);
            const data = await res.json();

            if (res.status == 401) {
                if (window.location.pathname !== '/sign-in') {
                    window.location.replace('/sign-in');
                }
            }

            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");
            return data.data; // <-- returns array of events
        },
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await fetch("/api/events", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");
            return data.data; // return just the created event object
        },
        onSuccess: (newEvent) => {
            queryClient.setQueryData(["events"], (old: any) => {
                if (!old) return null; // don’t overwrite if query hasn’t loaded yet
                return {
                    ...old,
                    events: [...old.events, newEvent],
                };
            });
        },
    });
};


export const useEventById = (eventId: string) => {
    return useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}`);
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed to fetch event");
            return data.data;
        },
        enabled: !!eventId, // only run when id is available
    });
};

export const useUpdateUserEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventId, payload }: { eventId: string; payload: any }) => {
            const res = await fetch(`/api/events/${eventId}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");
            return data.data; // return updated event object
        },
        onSuccess: (updatedEvent) => {
            // queryClient.setQueryData(["events"], (old: any) => {
            //     if (!old) return [updatedEvent];
            //     return old.map((event: any) =>
            //         event.id === updatedEvent.id ? updatedEvent : event
            //     );
            // });
            queryClient.setQueryData(["events"], (old: any) => {
                if (!old) null;
                return {
                    ...old,
                    events: old.events.map((event: any) =>
                        event.id === updatedEvent.id ? updatedEvent : event
                    ),
                };
            });
        },
    });
};

export const useDeleteUserEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            const res = await fetch(`/api/events/${eventId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed to delete event");
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};


