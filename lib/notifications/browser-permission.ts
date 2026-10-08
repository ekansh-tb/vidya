/** Browser permission prompts can remain unanswered indefinitely. */
export async function notificationPermissionFromGesture(
  request: () => Promise<NotificationPermission>,
  timeoutMs = 20_000,
): Promise<NotificationPermission> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    // Invoke synchronously while the button's user gesture is still active.
    const pending = request();
    return await Promise.race([
      pending,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("The browser permission prompt is still waiting. Respond to it, then try again here. You can keep using Vidya.")), timeoutMs);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
