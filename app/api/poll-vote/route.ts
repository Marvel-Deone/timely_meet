import { NextResponse } from "next/server";
import { pollService } from "@/lib/services/poll.service";

export async function POST(req: Request) {
    const payload = await req.json();
    const res = await pollService.pollVoting(payload);
    if (!res || "error" in res) {
        const status = (res as any)?.error?.code || 400;
        return NextResponse.json(res, { status });
    }
    return NextResponse.json({ success: true, data: res }, { status: 200 });
}