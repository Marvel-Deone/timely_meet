import { Button } from '@/components/ui/button'
import React from 'react'

const CancelMeeting = ({ bookingId }: { bookingId: string }) => {
  return (
      <Button variant="destructive" className="cursor-pointer">Cancel Meeting</Button>
  )
}

export default CancelMeeting;