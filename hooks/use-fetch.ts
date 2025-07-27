import { ErrorResponse, SuccessResponse } from "@/utils/response";
import { useCallback, useState } from "react";

// const useFetch = <T = unknown>(cb: (...args: any[]) => Promise<SuccessResponse<T> | ErrorResponse>) => {
//     const [data, setData] = useState<T | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<ErrorResponse["error"] | null>(null);

//     const fn = useCallback(async (...args: any[]) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await cb(...args);

//             if (response.success) {
//                 setData((response as SuccessResponse<T>).data ?? null);
//             } else {
//                 setError((response as ErrorResponse).error);
//             }

//             return response;
//         } catch (err: any) {
//             const fallback = {
//                 message: err?.message || "Unexpected error",
//                 code: 500,
//                 status: "Internal Server Error"
//             };

//             setError(fallback);
//             return { success: false, error: fallback };
//         } finally {
//             setLoading(false);
//         }
//     },
//      []);

//     return { data, loading, error, fn };
// };

const useFetch = <T = unknown>(
    cb: (...args: any[]) => Promise<SuccessResponse<T> | ErrorResponse>
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorResponse["error"] | null>(null);

    const fn = useCallback(
        async (...args: any[]) => {
            const silent = typeof args[args.length - 1] === "boolean" ? args.pop() : false;

            if (!silent) setLoading(true);
            setError(null);

            try {
                const response = await cb(...args);
console.log('Response from useFetch:', response);

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
                    status: "Internal Server Error",
                };

                setError(fallback);
                return { success: false, error: fallback };
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [cb]
    );

    return { data, loading, error, fn };
};


export default useFetch;