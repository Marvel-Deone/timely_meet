export type Event = {
    id: string;
    title: string;
    duration: number;
    is_private: boolean;
    description: string | null;
    type: string;
    _count: {
        bookings: number;
    };
};

export type PollEvent = {
    id: string
    title: string
    description?: string
    status: "pending" | "finalized"
    totalVotes: number
    capacity?: number
    created_at: string
    // poll_options: Array<{
    //     id: string
    //     start_time: string
    //     end_time: string
    //     votes: number
    // }>
    poll_options: PollOption[]
}

export type PollOption = {
    id: string
    start_time: string
    end_time: string
    votes: Array<{
        id: string
        user: {
            id: string
            name: string
            email: string
            avatar?: string
        }
    }>
}