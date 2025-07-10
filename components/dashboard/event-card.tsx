'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/types/event.types';
import useFetch from '@/hooks/use-fetch';
import { deleteEvent } from '@/actions/event';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import Toaster from './Toaster';
import { AlertColor } from '@mui/material';

type EventCardProps = {
    event: Event;
    username: string,
    is_public: boolean;
};

const EventCard = ({ event, username, is_public }: EventCardProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [toasterType, setToasterType] = useState<AlertColor>('success');
    const router = useRouter();

    const { loading, error, fn: fnDeleteEvent } = useFetch(deleteEvent);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/${username}/${event.id}`);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.log('Failed to copy');
        }
    };

    const showDeleteConfirmation = (id: string) => {
        setIsOpen(true);
        setEventId(id);
    }

    const handleToasterClose = () => {
        setOpen(false);
    }

    const handleDeleteEvent = async () => {
        const res = await fnDeleteEvent(eventId);
        setOpen(true);
        setIsOpen(false);
        setToasterType(res.success ? 'success' : 'error');
        console.log('resdd:', res);
        setMessage(
            res.success ? (res as any)?.message ?? '' : res?.error?.message ?? 'An error occurred'
        );
        if (!loading && !error) {
            router.refresh();
        }
    }

    return (
        <>
            <Card className='flex flex-col justify-between cursor-pointer'>
                <CardHeader>
                    <CardTitle className='text-2xl'>{event.title}</CardTitle>
                    <CardDescription className='flex justify-between'>
                        <span>
                            {event.duration} mins | {event.is_private ? "Private" : "Public"}
                        </span>
                        <span>{event._count.bookings} Bookings</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{event.description}</p>
                    {/* .substring(0, event.description.indexOf(".")) */}
                </CardContent>
                {!is_public && <CardFooter className='flex gap-2'>
                    <Button className='cursor-pointer flex items-center' variant="outline" onClick={handleCopy}>
                        <Link className='mr-1 h-4 w-4' />
                        {isCopied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button className='cursor-pointer' disabled={loading} variant="destructive" onClick={() => showDeleteConfirmation(event.id)}>
                        <Trash2 className='mr-1 h-4 w-4' /> Delete
                    </Button>
                </CardFooter>}
            </Card>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is irreversible and will permanently delete this event.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                        <Button onClick={handleDeleteEvent} className='cursor-pointer'>{loading ? "Deleting..." : "Continue"}</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Snackbar */}
            <Toaster
                open={open}
                message={message}
                type={toasterType}
                onClose={handleToasterClose}
            />
        </>
    )
}

export default EventCard
