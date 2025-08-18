// lib/fetchers.ts
export const fetchMeetings = async (type: "upcoming" | "past" = "upcoming") => {
  const res = await fetch(`/api/meetings?type=${type}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch meetings");

//   console.log('resMeetingRes', res.json());
  
  return res.json();
};
