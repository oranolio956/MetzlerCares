import type { NumericRange } from '@sveltejs/kit'

export type HttpErrorStatus = NumericRange<400, 599>

export function normalizeHttpErrorStatus(status: number): HttpErrorStatus {
  if (status >= 400 && status <= 599) {
    return status as HttpErrorStatus
  }

  console.warn(`[security] invalid HTTP error status ${status}, defaulting to 500`)
  return 500 as HttpErrorStatus
}
