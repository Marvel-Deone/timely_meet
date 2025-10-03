import { NextResponse } from "next/server";
import { availabilityService } from "@/lib/services/availability.service";

export async function GET() {
  try {
    const res = await availabilityService.getUserAvailability();
    if (!res?.success) {
      const status = (res as any).error.code || 400;
      return NextResponse.json(res, { status });
    }
    return NextResponse.json(res, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || "Invalid request" } },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  const payload = await req.json();

  const res = await availabilityService.updateUserAvailability(payload);
  console.log('resfdd:', res);
  console.log('dddfff');

  if ("error" in res) {
    const status = (res as any)?.error?.code || 400;
    return NextResponse.json(res, { status });
  }
  return NextResponse.json(res, { status: 200 });
}
