import "server-only";
import { getSql } from "./client";
import { PARENT_ACKNOWLEDGEMENT_TEXT, PARENT_ACKNOWLEDGEMENT_VERSION } from "../auth/parent-enrollment-contract";

/** Identity and email evidence must come from authenticated Clerk server data. */
export async function enrollParent(input: {
  userId: string;
  email: string;
  emailId: string;
  displayName: string | null;
  sessionId: string;
}): Promise<boolean> {
  const rows = await getSql()`select vidya_enroll_parent(
    ${input.userId}, ${input.email}, ${input.displayName}, ${input.emailId},
    ${input.sessionId}, ${PARENT_ACKNOWLEDGEMENT_VERSION}, ${PARENT_ACKNOWLEDGEMENT_TEXT}
  ) as ok`;
  return rows[0]?.ok === true;
}
