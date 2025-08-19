import { eventService } from "@/lib/services/event.service";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await eventService.getUserEvents();
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await eventService.createEvent(body);
  return NextResponse.json(res);
}
