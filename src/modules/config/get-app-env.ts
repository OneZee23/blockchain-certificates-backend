import { AppEnv } from './config.model';

export function isAppEnv(s: string): s is AppEnv {
  return Object.values(AppEnv).includes(s as AppEnv);
}

export function getAppEnv(): AppEnv {
  const env = process.env['ENV'];
  if (env === undefined) throw new Error('Environment var "ENV" not defined');
  if (!isAppEnv(env)) throw new Error('Invalid "ENV" environment variable');
  return env;
}
