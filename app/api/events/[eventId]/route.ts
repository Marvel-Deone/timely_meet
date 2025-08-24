import { eventService } from "@/lib/services/event.service";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/:eventId → get details of owned event
export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
    // const { eventId } = context.params;
    // const res = await eventService.getOwnedEventDetails(eventId);
    const res = await eventService.getOwnedEventDetails(params.eventId);

    if (!res.success) {
        const status = (res as any).error.code || 400;
        return NextResponse.json(res, { status });
    }

    return NextResponse.json(res, { status: 200 });
}

// PATCH /api/events/:eventId → update event
export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
    // const { eventId } = context.params;
    const body = await req.json();
    // const res = await eventService.updateUserEvent(eventId, body);
    const res = await eventService.updateUserEvent(params.eventId, body);

    if (!res.success) {
        const status = (res as any).error.code || 400;
        return NextResponse.json(res, { status });
    }

    return NextResponse.json(res, { status: 200 });
}

// DELETE /api/events/:eventId → delete event
export async function DELETE(req: NextRequest, { params }: { params: { eventId: string } }) {
    // const { eventId } = context.params;
    // const res = await eventService.deleteUserEvent(eventId);
    const res = await eventService.deleteUserEvent(params.eventId);

    if (!res.success) {
        const status = (res as any).error.code || 400;
        return NextResponse.json(res, { status });
    }

    return NextResponse.json(res, { status: 200 });
}
