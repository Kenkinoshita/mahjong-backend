export type ObjectLike = Record<PropertyKey, unknown>;

export type Expand<T extends ObjectLike> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * @see https://tech.mobilefactory.jp/entry/2021/12/02/000000
 */
export type NestedExpand<T extends ObjectLike> = T extends infer O
  ? {
      [K in keyof O]: O[K] extends FunctionLike ? O[K] : O[K] extends ObjectLike ? Expand<O[K]> : O[K];
    }
  : never;

export type Entries<T> = (keyof T extends infer U ? (U extends keyof T ? [U, T[U]] : never) : never)[];

export type Keys<T> = Entries<T>[number][0][];

export type Values<T> = Entries<T>[number][1][];

/**
 * 意図的にanyを利用したいときに利用する
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ANY = any;

/**
 * やむおえずanyを利用して解決したいときに利用する
 */
export type FIXME = ANY;

export type FunctionLike = (...args: ANY[]) => ANY;

export type GetReturnTypeIfFunction<T> = T extends FunctionLike ? ReturnType<T> : T;

/**
 * 1つ以上の要素を持つ配列
 */
export type OneOrMore<T> = [T, ...T[]];

/**
 * 1～2つの要素を持つ配列
 */
export type OneOrTwo<T> = [T] | [T, T];

export type ValueOf<T> = T[keyof T];
export type StartsWith<T extends string, U extends string> = T extends `${U}${string}` ? true : false;
export type PickByStartWords<T extends string, S extends string> = ValueOf<{
  [P in T]: StartsWith<P, S> extends true ? P : never;
}>;

/**
 * 第1引数に第2引数の型をmergeする
 */
export type MergeObject<T extends ObjectLike, K extends ObjectLike> = Omit<T, keyof K> & K;

/**
 * 深いプロパティまで必須プロパティとする
 */
export type NestedRequired<T> = {
  [K in keyof T]-?: T[K] extends Array<infer R> ? Array<NestedRequired<R>> : NestedRequired<T[K]>;
};

/**
 * 深いプロパティまで上書き不可とする
 */
export type NestedReadonly<T> = {
  readonly [K in keyof T]-?: T[K] extends Array<infer R> ? Array<NestedReadonly<R>> : NestedReadonly<T[K]>;
};

/**
 * 型引数 または NestedReadonly<型引数>
 */
export type OrNestedReadonly<T> = T | NestedReadonly<T>;

/**
 * Union型をIntersection型に変換する
 */
export type UnionToIntersection<U> = (U extends ANY ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * 同一のkeyを持つObjectのUnion型から同一のkeyの値をkeyとvalueとした交差型を生成する
 * @example
 * type A = { type: 'a'; foo: string };
 * type B = { type: 'b'; bar: number };
 * type C = { type: 'c'; baz: boolean };
 * type Result = UnionToIndexedObject<A | B | C, 'type'>;
 * // type Result = {
 * //   a: A;
 * //   b: B;
 * //   c: C;
 * // };
 */
export type UnionToIndexedObject<T, K extends keyof T> = UnionToIntersection<
  T extends { [U in K]: infer R } ? (R extends string ? { [P in R]: Extract<T, { [U in K]: R }> } : never) : never
>;

type SafeParseSuccess<Output> = {
  success: true;
  data: Output;
  error?: never;
};
type SafeParseError<E extends Error> = {
  success: false;
  error: E;
  data?: never;
};
export type SafeParseReturnType<E extends Error, Output> = SafeParseError<E> | SafeParseSuccess<Output>;

export type ConstructorProps<T> = {
  [K in keyof T as T[K] extends FunctionLike ? never : K]: T[K];
};
