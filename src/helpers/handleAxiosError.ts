import axios from "axios";

export const handleAxiosError = (
  error: unknown,
  codeMap?: Record<number, string>
): string => {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.code;
    if (code && codeMap?.[code]) return codeMap[code];
    return (
      error.response?.data?.message || "A server-related error has occurred"
    );
  }
  return (error as Error)?.message || "An unexpected error has occurred";
};
