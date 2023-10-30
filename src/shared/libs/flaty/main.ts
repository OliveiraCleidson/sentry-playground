/**
 * Flaty - Biblioteca responsável por transformar objetos aninhados
 * em objetos planos.
 *
 * @author Cleidson Oliveira <contato@cleidsonoliveira.dev>
 * @version 0.0.1
 */

/**
 * Transforma um objeto aninhado em um objeto plano.
 * @example
 * input: { name: 'John', age: 30, address: { street: '123 Main St', city: 'New York' } }
 * output: { name: 'John', age: 30, address_street: '123 Main St', address_city: 'New York' }
 */
function flattenObject<T = any>(toFlatten: any, prefix?: string) {
  if (!toFlatten) return toFlatten;
  if (Array.isArray(toFlatten)) return toFlatten.map((v) => flattenObject(v));

  let obj = {} as any;
  const keys = Object.keys(toFlatten);
  keys.forEach((key) => {
    const value = toFlatten[key];
    const newKey = prefix ? `${prefix}_${key}` : key;
    if (typeof value !== 'object' || value instanceof Date) {
      obj[newKey] = value;
    } else obj = { ...obj, ...flattenObject(value, newKey) };
  });

  return obj as T;
}

/**
 * Transforma um objeto plano em um objeto aninhado.
 *
 * @example
 * input: { name: 'John', age: 30, address_street: '123 Main St', address_city: 'New York' }
 * output: { name: 'John', age: 30, address: { street: '123 Main St', city: 'New York' } }
 */
function unflattenObject<T = any>(toUnflatten: any): T {
  if (
    !toUnflatten ||
    typeof toUnflatten !== 'object' ||
    toUnflatten instanceof Date
  )
    return toUnflatten;
  if (Array.isArray(toUnflatten)) return toUnflatten.map(unflattenObject) as T;

  const result = {};
  for (const key in toUnflatten) {
    const hasSplit = key.includes('_');
    if (!hasSplit) {
      result[key] = unflattenObject(toUnflatten[key]);
      continue;
    }

    splitAndUnflatten(key, result, toUnflatten);
  }
  return result as T;
}

// person_children_name // {} // { persona_children_name: {} }
function splitAndUnflatten(
  key: string,
  result: any,
  toUnflatten: any,
  originalKey?: string,
) {
  const properties = key.split('_');
  if (properties.length === 1) {
    result[key] = unflattenObject(toUnflatten[originalKey ?? key]);
    return;
  }

  result[properties[0]] = result[properties[0]] ?? {};

  splitAndUnflatten(
    properties.slice(1).join('_'),
    result[properties[0]],
    toUnflatten,
    originalKey ?? key,
  );
}

const Flaty = {
  flattenObject,
  unflattenObject,
};

// eslint-disable-next-line import/no-default-export
export default Flaty;
