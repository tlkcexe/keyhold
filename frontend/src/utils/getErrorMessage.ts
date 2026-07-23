import { AxiosError } from 'axios';
import { ApiErrorShape } from '../features/auth/auth.types';

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorShape | undefined;
    if (data?.details?.length) {
      return data.details.map((d) => d.message).join(' ');
    }
    if (data?.message) return data.message;
  }
  return 'Something went wrong. Please try again.';
};
