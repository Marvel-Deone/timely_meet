import { eventService } from "@/lib/services/event.service";
import { pollService } from "@/lib/services/poll.service";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/:eventId/polls → get details of poll event
export async function GET(req: NextRequest, context: any) {
    const { eventId } = await context.params as { eventId: string };
    const res = await eventService.getPollEventDetails(eventId);

    if (!res.success) {
        const status = (res as any).error.code || 400;
        return NextResponse.json(res, { status });
    }

    return NextResponse.json(res, { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const res = await pollService.finalizeEventTime(body.eventId, body.chosenOptionId);
        // return res;
        if (!res.success) {
            const status = (res as any).error.code || 400;
            return NextResponse.json(res, { status });
        }

        return NextResponse.json(res, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: { message: err.message || "Invalid request" } },
            { status: 500 }
        )
    }
}