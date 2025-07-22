import { ErrorResponse, SuccessResponse } from "@/utils/response";
import { useState } from "react";

const useFetch = <T = unknown>(cb: (...args: any[]) => Promise<SuccessResponse<T> | ErrorResponse>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorResponse["error"] | null>(null);

    const fn = async (...args: any[]) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);

            if (response.success) {
                setData((response as SuccessResponse<T>).data ?? null);
            } else {
                setError((response as ErrorResponse).error);
            }

            return response;
        } catch (err: any) {
            const fallback = {
                message: err?.message || "Unexpected error",
                code: 500,
                status: "Internal Server Error"
            };

            setError(fallback);
            return { success: false, error: fallback };
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn };
};

export default useFetch;