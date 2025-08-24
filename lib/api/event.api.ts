import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: async () => {
            const res = await fetch("/api/events");
            const data = await res.json();
            console.log('data:dd', data.data);

            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");
            return data.data;
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
            console.log('reddsss:', res);

            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};

// Get single event
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
        mutationFn: async (payload: any) => {
            const res = await fetch(`/api/events/${payload.id}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error?.message || "Failed to update event");
            }
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

// Delete event
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


