import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAvailability = () => {
    return useQuery({
        queryKey: ["availability"],
        queryFn: async () => {
            const res = await fetch("/api/availability");
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.error?.message || "Fetch failed");
            return json.data;
        },
    });
};

export const useUpdateAvailability = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await fetch("/api/availability", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok || !json.success) throw new Error(json.error?.message || "Update failed");
            return json.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["availability"] }),
    });
};
