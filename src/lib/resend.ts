import { Resend } from 'resend';

// Use a fallback placeholder so module-level instantiation does not throw
// during build. Actual sends will still fail if the env var is missing at runtime.
export const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
