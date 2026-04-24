import fs from 'fs';

function loadKey(envVar: string): string {
  const path = process.env[envVar];
  if (!path) {
    throw new Error(`Missing required env var: ${envVar}`);
  }
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read key from ${path} (${envVar}): ${(err as Error).message}`);
  }
}

export const PUB_KEY = loadKey('JWT_PUBLIC_KEY_PATH');
export const PRIV_KEY = loadKey('JWT_PRIVATE_KEY_PATH');