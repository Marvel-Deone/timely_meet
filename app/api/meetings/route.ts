import { getUserMeetings } from "@/lib/services/meeting.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") as "upcoming" | "past") || "upcoming";

  const result = await getUserMeetings(type);
  return Response.json(result, {
    status: result.success ? 200 : result.error.code,
  });
}
