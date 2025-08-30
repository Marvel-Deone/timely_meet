import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Create Booking
export const useCreateBooking = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Booking creation failed");
      }

      console.log('res.ko:', json);
      

      return json.data;
    },
    // Optional: refetch bookings if you’re listing them
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

// Cancel Booking
export const useCancelBooking = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Cancel failed");
      }

      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
