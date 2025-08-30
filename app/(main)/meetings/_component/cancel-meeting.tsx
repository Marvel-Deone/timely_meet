"use client";

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
import { useCancelBooking } from "@/lib/api/booking.api";
import { Clock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface CancelMeetingProps {
  bookingId: string;
}

const CancelMeeting = ({ bookingId }: CancelMeetingProps) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const router = useRouter();
  const { mutate: cancelBooking, isPending } = useCancelBooking();

  const handleCancelClick = useCallback(() => {
    setIsCancelDialogOpen(true);
  }, []);

  const handleCancelConfirm = async () => {
    cancelBooking(bookingId, {
      onSuccess: () => {
        toast.success("Meeting cancelled successfully!");
        setIsCancelDialogOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to cancel booking")
      },
    });
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
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={isPending} className="cursor-pointer">
              {isPending ? (
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
