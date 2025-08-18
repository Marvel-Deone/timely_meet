import { ErrorResponse, SuccessResponse } from "@/lib/response";
import { useCallback, useState } from "react";

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

// const useFetchs = <T = unknown>(url: string, options?: RequestInit) => {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<ErrorResponse["error"] | null>(null);

//   const fn = useCallback(
//     async (body?: any, silent = false) => {
//       if (!silent) setLoading(true);
//       setError(null);

//       try {
//         const res = await fetch(url, {
//           ...options,
//           method: options?.method || "POST", // default to POST unless overridden
//           headers: {
//             "Content-Type": "application/json",
//             ...(options?.headers || {}),
//           },
//           body: body ? JSON.stringify(body) : undefined,
//         });

//         const response = (await res.json()) as SuccessResponse<T> | ErrorResponse;

//         if ("success" in response && response.success) {
//           setData((response as SuccessResponse<T>).data ?? null);
//         } else {
//           setError((response as ErrorResponse).error);
//         }

//         return response;
//       } catch (err: any) {
//         const fallback = {
//           message: err?.message || "Unexpected error",
//           code: 500,
//           status: "Internal Server Error",
//         };

//         setError(fallback);
//         return { success: false, error: fallback };
//       } finally {
//         if (!silent) setLoading(false);
//       }
//     },
//     [url, options]
//   );

//   return { data, loading, error, fn };
// };

const useFetchs = <T = unknown>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse["error"] | null>(null);

  const fn = useCallback(
    async (
      payload?: Record<string, any>, // for GET → query params, for others → body
      silent = false
    ) => {
      if (!silent) setLoading(true);
      setError(null);

      try {
        let finalUrl = url;
        let fetchOptions: RequestInit = {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
          },
        };

        const method = (options?.method || "POST").toUpperCase();

        if (method === "GET") {
          // convert payload to query string if provided
          if (payload && Object.keys(payload).length > 0) {
            const query = new URLSearchParams(payload).toString();
            finalUrl = `${url}?${query}`;
          }
        } else {
          // for POST/PUT/PATCH/DELETE → attach JSON body
          if (payload) {
            fetchOptions.body = JSON.stringify(payload);
          }
          fetchOptions.method = method;
        }

        const res = await fetch(finalUrl, fetchOptions);
        const response = (await res.json()) as SuccessResponse<T> | ErrorResponse;

        if ("success" in response && response.success) {
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
    [url, options]
  );

  return { data, loading, error, fn };
};

export { useFetchs };
