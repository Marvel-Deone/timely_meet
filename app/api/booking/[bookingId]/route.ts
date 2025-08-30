import { bookingService } from "@/lib/services/booking.service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: any) {
    const { bookingId } = await context.params as { bookingId: string };
    const res = await bookingService.cancelBooking(bookingId);
    if (!res || "error" in res) {
        const status = (res as any)?.error?.code || 400;
        return NextResponse.json(res, { status });
    }
    return NextResponse.json({ success: true, data: res }, { status: 200 });
}