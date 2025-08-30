import { NextResponse } from "next/server";
import { availabilityService } from "@/lib/services/availability.service";

export async function GET() {
  const res = await availabilityService.getUserAvailability();
  if (!res || res.error) {
    const status = (res as any)?.error?.code || 400;
    return NextResponse.json(res, { status });
  }
  return NextResponse.json({ success: true, data: res }, { status: 200 });
}

export async function PATCH(req: Request) {
  const payload = await req.json();
  
  const res = await availabilityService.updateUserAvailability(payload);
  
  if ("error" in res) {
    const status = (res as any)?.error?.code || 400;
    return NextResponse.json(res, { status });
  }
  return NextResponse.json(res, { status: 200 });
}
