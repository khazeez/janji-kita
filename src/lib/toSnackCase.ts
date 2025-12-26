/**
 * Mengubah string dari camelCase menjadi snake_case
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Mengubah semua keys dalam object dari camelCase menjadi snake_case
 */
function convertKeysToSnakeCase<T = any>(obj: T): any {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnake(key);
    acc[snakeKey] = convertKeysToSnakeCase((obj as any)[key]);
    return acc;
  }, {} as any);
}

export { camelToSnake, convertKeysToSnakeCase };
