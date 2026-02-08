export const generateClientMessageId = (prefix = 'cmid'): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = (globalThis as any).crypto;

  if (c?.randomUUID) {
    return `${prefix}_${c.randomUUID()}`;
  }
  const bytes = new Uint8Array(16);
  if (c?.getRandomValues) {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');

  return `${prefix}_${hex}`;
}
