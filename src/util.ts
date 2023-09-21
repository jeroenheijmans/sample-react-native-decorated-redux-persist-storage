export function log(...args: unknown[]) {
  console.log(`[${new Date().toISOString().substring(11)}]`, ...args);
}

export async function delay(ms?: number) {
  log(`[DELAY] ${ms || 0}ms started`);
  await new Promise(r => setTimeout(r, ms));
  log(`[DELAY] ${ms || 0}ms finished`);
}
