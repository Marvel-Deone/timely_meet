'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import useFetch from '@/hooks/use-fetch';
import { getUserEvents } from '@/actions/event';
import { SuccessResponse } from '@/utils/response';
import { Event } from '@/lib/types/event.types';
// import { isSuccessResponse } from '@/lib/utils';

interface EventsResponse {
    events: Event[];
    username: string;
};

interface EventContextType {
    refetchEvents: (skipLoading?: boolean) => void;
    eventData: EventsResponse | null;
    loading: boolean;
    error: {
        message: string;
        code: number;
        status: string;
    } | null
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, fn: fetchUserEvents, loading, error } = useFetch<{
        events: Event[];
        username: string;
    }>(getUserEvents);

    const [eventData, setEventData] = useState<EventsResponse | null>(null);

    const refetchEvents = useCallback(async (skipLoading = false) => {
        const res = skipLoading ? await getUserEvents() : await fetchUserEvents();
        if (res?.success && "data" in res) {
            setEventData(res.data || null);
        }
    }, [fetchUserEvents]);

    return (
        <EventContext.Provider value={{
            refetchEvents, eventData, loading, error
        }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) throw new Error('useEventContext must be used within an EventProvider');
    return context;
};
