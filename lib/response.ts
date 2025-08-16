export type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code: number;
    status: string;
  };
};

export type SuccessResponse<T = unknown> = {
  message: string;
  success: true;
  data: T;
};

export const error = (
  message: string,
  code: number,
  status = "Internal Server Error"
): ErrorResponse => ({
  success: false,
  error: { message, code, status },
});

export const success = <T = unknown>(message: string, data: T): SuccessResponse<T> => ({
  message,
  success: true,
  data,
});