import { SessionRevocationReason } from "./session-revocation-reason.interface";

export interface SessionRevokedPayload {
  sid: string;
  reason: SessionRevocationReason;
}