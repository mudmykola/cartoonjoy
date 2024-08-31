import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.join(__dirname, '..', '.env');

dotenv.config({ path: envFilePath });

const currentVersion = process.env.VITE_APP_VERSION || '1.0.0';

const incrementVersion = (version) => {
  const [major, minor, patch] = version
    .split('.')
    .map((num) => parseInt(num, 10));
  return `${major}.${minor}.${patch + 1}`;
};

const newVersion = incrementVersion(currentVersion);

const envVariables = fs.readFileSync(envFilePath, 'utf-8').split('\n');
const newEnvVariables = envVariables.map((line) => {
  if (line.startsWith('VITE_APP_VERSION=')) {
    return `VITE_APP_VERSION=${newVersion}`;
  }
  return line;
});

if (!newEnvVariables.some((line) => line.startsWith('VITE_APP_VERSION='))) {
  newEnvVariables.push(`VITE_APP_VERSION=${newVersion}`);
}

fs.writeFileSync(envFilePath, newEnvVariables.join('\n'), 'utf-8');
console.log(`Version bumped to ${newVersion}`);
