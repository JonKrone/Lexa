import type { DefaultError } from '@tanstack/query-core'
import type { UseMutationOptions } from '@tanstack/react-query'

export function mutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
  return options
}

/**
 * Takes an interface and returns a union of all the key:value pairs of that interface
 *
 * Example:
 * interface User {
 *  name: string
 *  email: string
 * }
 *
 * type UpdateableFields = OneFieldUpdate<User> // { name: string } | { email: string }
 */
export type OneFieldUpdate<T> = {
  [K in keyof T]: { [P in K]: T[P] }
}[keyof T]
