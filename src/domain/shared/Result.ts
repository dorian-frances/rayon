/**
 * Résultat discriminé (Ok | Err) — utile pour les use cases qui ne veulent pas
 * exposer d'exceptions à la couche UI. Simple, non générique sur l'erreur.
 */

export type Ok<T> = { readonly ok: true; readonly value: T };
export type Err<E extends Error = Error> = { readonly ok: false; readonly error: E };
export type Result<T, E extends Error = Error> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E extends Error>(error: E): Err<E> => ({ ok: false, error });

export const isOk = <T, E extends Error>(r: Result<T, E>): r is Ok<T> => r.ok;
export const isErr = <T, E extends Error>(r: Result<T, E>): r is Err<E> => !r.ok;
