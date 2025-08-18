"use client";

import { cancelBooking } from "@/actions/booking";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Clock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface CancelMeetingProps {
  bookingId: string;
}

const CancelMeeting = ({ bookingId }: CancelMeetingProps) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { fn: fnCancelBooking, loading } = useFetch(cancelBooking);

  const router = useRouter();

  const handleCancelClick = useCallback(() => {
    setIsCancelDialogOpen(true);
  }, []);

  const handleCancelConfirm = async () => {
    try {
      const res = await fnCancelBooking(bookingId);
      if (res.success && "data" in res) {
        toast.success(res.message || "Meeting cancelled successfully!");
        router.refresh();
      } else if ("error" in res) {
        toast.error(res.error?.message || "Failed to cancel booking");
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={handleCancelClick} className="flex-1 cursor-pointer">
        <Trash2 className="w-4 h-4 mr-2" />
        Cancel
      </Button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={loading} className="cursor-pointer">
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  Yes
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CancelMeeting;
