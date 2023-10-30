export enum Environments {
  PRODUCTION = 'production',
  HOMOLOG = 'homolog',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
}

/**
 * Se o parametro for passado, ele é usado para verificar se é produção.
 * Caso contrário, o NODE_ENV é usado.
 */
function isProduction(env?: string) {
  if (env) return env === Environments.PRODUCTION;
  return process.env.NODE_ENV === Environments.PRODUCTION;
}

/**
 * Se o parametro for passado, ele é usado para verificar se é homologação.
 * Caso contrário, o NODE_ENV é usado.
 */
function isHomolog(env?: string) {
  if (env) return env === Environments.HOMOLOG;
  return process.env.NODE_ENV === Environments.HOMOLOG;
}

/**
 * Se o parametro for passado, ele é usado para verificar se é desenvolvimento.
 * Caso contrário, o NODE_ENV é usado.
 * @param env
 */
function isDevelopment(env?: string) {
  if (env) return env === Environments.DEVELOPMENT;
  return process.env.NODE_ENV === Environments.DEVELOPMENT;
}

/**
 * Se o parametro for passado, ele é usado para verificar se é staging.
 * Caso contrário, o NODE_ENV é usado.
 */
function isStaging(env?: string) {
  if (env) return env === Environments.STAGING;
  return process.env.NODE_ENV === Environments.STAGING;
}

/**
 * Se o parametro for passado, ele é usado para verificar se é produção ou homolog.
 * Caso contrário, o NODE_ENV é usado.
 */
function isProductionOrHomolog(env?: string) {
  return isProduction(env) || isHomolog(env);
}

/**
 * Se o parametro for passado, ele é usado para verificar se não é produção.
 * Caso contrário, o NODE_ENV é usado.
 */
function isNotProduction(env?: string) {
  return !isProduction(env);
}

// @TODO: Testar isto
export const EnvironmentUtils = {
  isProduction,
  isHomolog,
  isDevelopment,
  isStaging,
  isProductionOrHomolog,
  isNotProduction,
};
