import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// export const useUserEvents = () => {
//     return useQuery({
//         queryKey: ["events"],
//         queryFn: async () => {
//             const res = await fetch("/api/events");
//             const data = await res.json();

//             if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");
//             console.log('res.data,', data.data);

//             return data.data;
//         },
//     });
// };

// export const useUserEvents = () => {
//     return useQuery({
//         queryKey: ["events"],
//         queryFn: async () => {
//             const res = await fetch("/api/events");
//             const data = await res.json();

//             if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");
//             return data.data; // ✅ data.data = array of events
//         },
//     });
// };

export const useUserEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: async () => {
            const res = await fetch("/api/events");
            const data = await res.json();

            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");
            return data.data; // <-- returns array of events
        },
    });
};



// export const useCreateEvent = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (payload: any) => {
//             const res = await fetch("/api/events", {
//                 method: "POST",
//                 body: JSON.stringify(payload),
//                 headers: { "Content-Type": "application/json" },
//             });
//             const data = await res.json();
//             if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");

//             return data.data;
//         },
//         onSuccess: (res) => {
//             const newEvent = res.data; // <-- THIS is the newEvent
//             queryClient.setQueryData(["userEvents"], (oldData: any) => {
//                 if (!oldData) return oldData;

//                 return {
//                     ...oldData,
//                     events: [newEvent, ...oldData.events], // prepend to list
//                 };
//             });
//             // queryClient.invalidateQueries({ queryKey: ["events"] });
//         },
//     });
// };

// Get single event

// export const useCreateEvent = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (payload: any) => {
//             const res = await fetch("/api/events", {
//                 method: "POST",
//                 body: JSON.stringify(payload),
//                 headers: { "Content-Type": "application/json" },
//             });

//             const data = await res.json();
//             if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed");

//             return data.data; // ✅ API returns the created event
//         },
//         onSuccess: (newEvent) => {
//             // ✅ Optimistically update cache
//             queryClient.setQueryData(["events"], (old: any) => {
//                 if (!old) return [newEvent];

//                 // If cache is already an array
//                 if (Array.isArray(old)) return [...old, newEvent];

//                 // If cache is wrapped in { data: [...] } format
//                 if (old.data) return { ...old, data: [...old.data, newEvent] };

//                 return old;
//                 // return [...old, newEvent];
//             });
//         },
//     });
// };

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    console.log('Got here');

    return useMutation({
        mutationFn: async (payload: any) => {
            console.log('Hoping...');
            const res = await fetch("/api/events", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            console.log("Let's see, guess it's successful");
            console.log('res:dd:', res);

            const data = await res.json();
            console.log('datahdh:', data);
            console.log('logging res:', res);
            if (!res.ok || !data.success) {
                console.log('Nothing is ok oooo');
                throw new Error(data.error?.message || "Failed");
            }
            return data.data; // return just the created event object
        },
        onSuccess: (newEvent) => {
            console.log('dddddd', newEvent);
            queryClient.setQueryData(["events"], (old: any) => {
                if (!old) return null; // don’t overwrite if query hasn’t loaded yet
                console.log('newEvent', newEvent, 'old:', old);

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

// export const useUpdateUserEvent = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         // mutationFn: async (eventId: string, payload: any) => {
//         mutationFn: async ({
//             eventId,
//             payload,
//         }: {
//             eventId: string;
//             payload: any;
//         }) => {
//             const res = await fetch(`/api/events/${eventId}`, {
//                 method: "PATCH",
//                 body: JSON.stringify(payload),
//                 headers: { "Content-Type": "application/json" },
//             });

//             const data = await res.json();
//             if (!res.ok || !data.success) {
//                 throw new Error(data.error?.message || "Failed to update event");
//             }
//             return data.data;
//         },
//         onSuccess: (res) => {
//             const updatedEvent = res.data; // <-- THIS is the newEvent (but updated)
//             queryClient.setQueryData(["userEvents"], (oldData: any) => {
//                 if (!oldData) return oldData;

//                 return {
//                     ...oldData,
//                     events: oldData.events.map((ev: any) =>
//                         ev.id === updatedEvent.id ? updatedEvent : ev
//                     ),
//                 };
//             });
//             // queryClient.invalidateQueries({ queryKey: ["events"] });
//         },
//     });
// }

// Delete event


// export const useUpdateUserEvent = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ eventId, payload }: { eventId: string; payload: any }) => {
//             const res = await fetch(`/api/events/${eventId}`, {
//                 method: "PATCH",
//                 body: JSON.stringify(payload),
//                 headers: { "Content-Type": "application/json" },
//             });

//             const data = await res.json();
//             if (!res.ok || !data.success) {
//                 throw new Error(data.error?.message || "Failed to update event");
//             }

//             return data.data; // ✅ updated event
//         },
//         onSuccess: (updatedEvent) => {
//             queryClient.setQueryData(["events"], (old: any) => {
//                 if (!old) return [updatedEvent];
//                 if (Array.isArray(old)) {
//                     return old.map((event: any) =>
//                         event.id === updatedEvent.id ? updatedEvent : event
//                     );
//                 }

//                 if (old.data) {
//                     return {
//                         ...old,
//                         data: old.data.map((event: any) =>
//                             event.id === updatedEvent.id ? updatedEvent : event
//                         ),
//                     };
//                 }

//                 return old;
//                 // return old.map((event: any) =>
//                 //   event.id === updatedEvent.id ? updatedEvent : event
//                 // );
//             });
//         },
//     });
// };

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


