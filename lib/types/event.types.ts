export type Event = {
    id: string;
    title: string;
    duration: number;
    is_private: boolean;
    description: string | null;
    _count: {
        bookings: number;
    };
};