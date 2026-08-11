import axios from 'axios';
import type { IProblemDetails } from '../types';

function isHtmlPayload(value: string): boolean {
  const trimmed = value.trimStart().toLowerCase();
  return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html');
}

export function getApiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data;

  if (typeof data === 'string' && data.trim()) {
    return isHtmlPayload(data) ? fallback : data;
  }

  if (data && typeof data === 'object') {
    const problem = data as IProblemDetails & {
      detail?: string;
      title?: string;
      errors?: Record<string, string[]>;
    };

    if (problem.detail) {
      return problem.detail;
    }

    if (problem.title) {
      return problem.title;
    }

    if (problem.errors) {
      const firstError = Object.values(problem.errors).flat()[0];
      if (firstError) {
        return firstError;
      }
    }
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
}
