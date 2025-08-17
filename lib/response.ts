// Success response
export type SuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data?: T | null;
};

// Error response
export type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code: number;   // HTTP status code
    status: string; // textual status (Bad Request, Unauthorized, etc.)
  };
};

export function success<T = unknown>(
  message: string,
  data?: T | null
): SuccessResponse<T> {
  return {
    success: true,
    message,
    data: data ?? null,
  };
}

export function error(
  message: string,
  code = 500,
  status = "Internal Server Error"
): ErrorResponse {
  return {
    success: false,
    error: { message, code, status },
  };
}







// // export type ErrorResponse = {
// //   success: false;
// //   error: {
// //     message: string;
// //     code: number;
// //     status: string;
// //   };
// // };

// // export type SuccessResponse<T = unknown> = {
// //   message: string;
// //   success: true;
// //   data: T;
// // };

// // export const error = (
// //   message: string,
// //   code: number,
// //   status = "Internal Server Error"
// // ): ErrorResponse => ({
// //   success: false,
// //   error: { message, code, status },
// // });

// // export const success = <T = unknown>(message: string, data: T): SuccessResponse<T> => ({
// //   message,
// //   success: true,
// //   data,
// // });

// export type SuccessResponse<T = unknown> = {
//   success: true;
//   message: string;
//   data?: T | null;
// };

// export type ErrorResponse = {
//   success: false;
//   error: {
//     message: string;
//     code: number; 
//     status: string;
//   };
// };

// // ✅ success response helper
// export function success<T = unknown>(message: string, data?: T | null): SuccessResponse<T> {
//   return {
//     success: true,
//     message,
//     data: data ?? null,
//   };
// }

// // ✅ error response helper
// export function error(message: string, code = 500, status = "Internal Server Error"): ErrorResponse {
//   return {
//     success: false,
//     error: { message, code, status },
//   };
// }
