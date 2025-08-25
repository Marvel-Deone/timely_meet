import { eventService } from "@/lib/services/event.service";
import { NextResponse } from "next/server";

export async function GET() {
    const res = await eventService.getUserEvents();
    if (!res.success) {
        const status = (res as any).error.code || 400;
        return NextResponse.json(res, { status });
    }

    return NextResponse.json(res, { status: 201 });
}

export async function POST(req: Request) {
    const body = await req.json();
    const res = await eventService.createEvent(body);

    if (!res.success) {
        const status = (res as any).error.code || 400;
        return NextResponse.json(res, { status });
    }

    return NextResponse.json(res, { status: 201 });
}