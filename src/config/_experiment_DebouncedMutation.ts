// import {
//   MutateOptions,
//   Mutation,
//   MutationCache,
//   MutationOptions,
//   QueryClient,
// } from '@tanstack/react-query'

// /**
//  * DebouncedMutation class extends the base Mutation class to add debouncing functionality.
//  * It overrides the execute and cancel methods to incorporate debounce logic.
//  */
// class DebouncedMutation<
//   TData = unknown,
//   TError = unknown,
//   TVariables = void,
//   TContext = unknown,
// > extends Mutation<TData, TError, TVariables, TContext> {
//   private debounceMs?: number
//   private debounceTimeout?: ReturnType<typeof setTimeout>
//   private abortController?: AbortController

//   constructor(config: {
//     mutationCache: MutationCache
//     mutationId: number
//     options: MutationOptions<TData, TError, TVariables, TContext>
//     state?: Mutation['state']
//   }) {
//     super(config as any)
//     const { meta } = config.options

//     // Check if meta.debounceMs is provided and is a number
//     if (meta && typeof meta.debounceMs === 'number') {
//       this.debounceMs = meta.debounceMs
//     }
//   }

//   /**
//    * Overrides the execute method to implement debouncing.
//    * If debounceMs is set, delays the execution of the mutation function.
//    * @param variables - Variables to pass to the mutation function.
//    * @param options - Additional mutate options.
//    * @returns A promise that resolves with the mutation result.
//    */
//   execute(
//     variables?: TVariables,
//     options?: MutateOptions<TData, TError, TVariables, TContext>,
//   ): Promise<TData> {
//     // If no debounceMs is set, execute immediately
//     if (!this.debounceMs) return super.execute(variables, options)

//     if (this.debounceMs) {
//       // Clear any existing debounce timeout
//       if (this.debounceTimeout) {
//         clearTimeout(this.debounceTimeout)
//       }

//       // Abort any previous request
//       if (this.abortController) {
//         this.abortController.abort()
//       }
//       this.abortController = new AbortController()

//       return new Promise((resolve, reject) => {
//         // Set a new debounce timeout
//         this.debounceTimeout = setTimeout(() => {
//           // Include the abort signal in the options
//           const executeOptions = {
//             ...options,
//             signal: this.abortController?.signal,
//           }

//           // Execute the original mutation function
//           super.execute(variables, executeOptions).then(resolve).catch(reject)

//           // Reset the debounce timeout
//           this.debounceTimeout = undefined
//         }, this.debounceMs)
//       })
//     } else {
//     }
//   }

//   /**
//    * Overrides the cancel method to clear any pending debounce timeouts and abort controllers.
//    */
//   cancel(): void {
//     // Clear the debounce timeout if it exists
//     if (this.debounceTimeout) {
//       clearTimeout(this.debounceTimeout)
//       this.debounceTimeout = undefined
//     }
//     // Abort the current request if it exists
//     if (this.abortController) {
//       this.abortController.abort()
//       this.abortController = undefined
//     }
//     // Call the base class cancel method
//     super.cancel()
//   }
// }

// /**
//  * DebouncedMutationCache class extends the base MutationCache to use DebouncedMutation.
//  * It overrides the build method to create instances of DebouncedMutation.
//  */
// class DebouncedMutationCache extends MutationCache {
//   private mutationId = 0

//   /**
//    * Overrides the build method to return instances of DebouncedMutation.
//    * @param client - The QueryClient instance.
//    * @param options - Mutation options.
//    * @param state - Initial state of the mutation.
//    * @returns A new instance of DebouncedMutation.
//    */
//   build<TData, TError, TVariables, TContext>(
//     client: QueryClient,
//     options: MutationOptions<TData, TError, TVariables, TContext>,
//     state?: Mutation<TData, TError, TVariables, TContext>['state'],
//   ): Mutation<TData, TError, TVariables, TContext> {
//     const mutation = new DebouncedMutation<TData, TError, TVariables, TContext>(
//       {
//         mutationCache: this,
//         mutationId: ++this.mutationId,
//         options: client.defaultMutationOptions(options),
//         state,
//       },
//     )
//     mutation.scheduleGc()
//     this.notify({ type: 'added', mutation })
//     return mutation
//   }
// }
