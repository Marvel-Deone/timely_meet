'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/app/lib/validators";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/user";
import Toaster from "@/components/dashboard/Toaster";

interface UsernameFormData {
    username: string;
}

type AlertColor = 'error' | 'info' | 'success' | 'warning';

const Dashboard = () => {
    const [locationOrigin, setLocationOrigin] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [toasterType, setToasterType] = useState<AlertColor>('success');

    const { isLoaded, user } = useUser();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(usernameSchema),
    });


    useEffect(() => {
        setLocationOrigin(window.location.origin);
        setValue("username", user?.username ?? "")
    }, [isLoaded]);

    const { loading, error, fn: fnUpdateUser } = useFetch(updateUsername);


    const handleToasterClose = () => setOpen(false);

    const onSubmit = async (data: UsernameFormData) => {
        const result = await fnUpdateUser(data.username);

        setOpen(true);
        setToasterType(result.success ? 'success' : 'error');
        setMessage(
            result.success ? "Username updated successfully" : result.error.message
        );
    }

    return (
        <div className="space-y-8">
            <Card className="!rounded-[12px] !py-4 !shadow-xl card-box-shadow">
                <CardHeader className="!flex !gap-2">
                    <img className="rounded-full w-[60px] h-[60px]" src={user?.imageUrl} alt={user?.firstName ?? ''} />
                    <CardTitle className="!mt-2 !text-[1.25rem] !font-[600]">Welcome, {user?.firstName}</CardTitle>
                </CardHeader>
                {/* Latest Updates */}
            </Card>
            <Card className="!rounded-[12px] !py-4 !shadow-xl card-box-shadow">
                <CardHeader>
                    <CardTitle>Your Unique Link</CardTitle>
                </CardHeader>

                <CardContent className="!-mt-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2">
                                <span>{locationOrigin}</span>
                                <Input {...register("username")} placeholder="username" className="!rounded-[8px] !py-5" />
                            </div>
                            {loading ? <Button disabled className="!bg-blue-600 cursor-pointer !rounded-[8px] !py-5">Updating...</Button> :
                                <Button type="submit" className="!bg-blue-600 cursor-pointer !rounded-[8px] !py-5">Update Username</Button>
                            }
                        </div>
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                        {error && (
                            <p className="text-red-500 text-sm mt-1">
                                {typeof error === "object" && error !== null && "message" in error
                                    ? (error as { message: string }).message
                                    : String(error)}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Snackbar */}
            <Toaster
                open={open}
                message={message}
                type={toasterType}
                onClose={handleToasterClose}
            />
        </div>
    )
}

export default Dashboard;
