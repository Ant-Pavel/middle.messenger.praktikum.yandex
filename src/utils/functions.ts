
export type PlainObject<T = unknown> = {
  [k in string]: T;
};

export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object'
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';
}

function isArrayOrObject(val: unknown): val is [] | PlainObject {
  return isPlainObject(val) || Array.isArray(val);
}

function isDateObj(value: unknown): value is Date {
  return typeof (value) === 'object' && value !== null && value.constructor === Date;
}


export function isEqual(a: object, b: object): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key: string) => {
    if (!b.hasOwnProperty(key)) return false;
    if (isArrayOrObject(a[key as keyof typeof a]) && isArrayOrObject(b[key as keyof typeof b])) {
      return isEqual(a[key as keyof typeof a] as object, b[key as keyof typeof b] as object);
    }
    if (isDateObj(a[key as keyof typeof a]) && isDateObj(b[key as keyof typeof b])) {
      return (a[key as keyof typeof a] as Date).getTime() === (b[key as keyof typeof b] as Date).getTime();
    }
    return a[key as keyof typeof a] === b[key as keyof typeof b];
  });
}


export function cloneDeep<T extends object = object>(obj: T) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return (function _cloneDeep(item: T): T | Date | Set<unknown> | Map<unknown, unknown> | object | T[] {
    // Handle:
    // * null
    // * undefined
    // * boolean
    // * number
    // * string
    // * symbol
    // * function
    if (item === null || typeof item !== 'object') {
      return item;
    }

    // Handle:
    // * Date
    if (item instanceof Date) {
      return new Date(item.valueOf());
    }

    // Handle:
    // * Array
    if (item instanceof Array) {
      const copy: unknown[] = [];

      item.forEach((_, i) => (copy[i] = _cloneDeep(item[i] as T)));

      return copy;
    }

    // Handle:
    // * Set
    if (item instanceof Set) {
      const copy = new Set();

      item.forEach(v => copy.add(_cloneDeep(v as T)));

      return copy;
    }

    // Handle:
    // * Map
    if (item instanceof Map) {
      const copy = new Map();

      item.forEach((v, k) => copy.set(k, _cloneDeep(v as T)));

      return copy;
    }

    // Handle:
    // * Object
    if (item instanceof Object) {
      const copy: Record<string | symbol, unknown> = {};

      // Handle:
      // * Object.symbol
      Object.getOwnPropertySymbols(item).forEach(s => (copy[s] = _cloneDeep((item as Record<symbol, T>)[s])));

      // Handle:
      // * Object.name (other)
      Object.keys(item).forEach((k) => (copy[k] = _cloneDeep((item as Record<string, T>)[k])));

      return copy;
    }

    throw new Error('Unable to copy object');
  })(obj);
}

export function getRussianDate(date: Date) {
  const russianMonths = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря'
  ];

  return `${date.getDate()} ${russianMonths[date.getMonth()]}`;
}

export function getChatTimeStr(date: Date) {
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  return `${hours}:${minutes}`;
}


export function debounce(f: (...args: unknown[]) => void, delay: number = 15) {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return function a(...args: unknown[]) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      timerId = null;
      f(...args);
    }, delay);
  };
} 
