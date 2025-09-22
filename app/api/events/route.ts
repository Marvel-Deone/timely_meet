import { eventService } from "@/lib/services/event.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const status = searchParams.get("status");

        // Build params object for filtering
        const params: { type?: string; status?: string } = {}
        if (type) params.type = type;
        if (status) params.status = status;
        // Call eventService with optional params
        const res = await eventService.getUserEvents(Object.keys(params).length > 0 ? params : undefined)

        if (!res.success) {
            const statusCode = (res as any).error?.code || 400
            return NextResponse.json(res, { status: statusCode })
        }
        
        return NextResponse.json(res, { status: 200 })
    } catch (err) {

    }
    const res = await eventService.getUserEvents();
    if (!res.success) {
        const status = (res as any).error.code || 400;
        return NextResponse.json(res, { status });
    }

    return NextResponse.json(res, { status: 201 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const res = await eventService.createEvent(body);

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