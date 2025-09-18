import { db } from "@/lib/db/prisma";

export const pollVoteRepository = {
    create: (data: any) => db.pollVote.create({ data })
}