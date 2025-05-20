import { binding } from "cf-bindings-proxy";
import { D1Database } from '@cloudflare/workers-types';

export const db = binding<D1Database>("DB");