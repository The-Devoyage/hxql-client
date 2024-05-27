interface Request {
    query: string | URL;
    variables?: object;
}
interface Options {
    process?: boolean;
    trigger?: string;
}
/**
 * hxql - Prepare an element to be hydrated with GraphQL queries
 * @param id - The id of the element to hydrate
 * @param queries - An array of queries to hydrate the element with
 * @returns void
 * @example
 * ```tsx
 * hxql("my-element", {
 *  query: `
 *    query GetUsers {
 *      users {
 *        id
 *        name
 *      }
 *    }
 *  `,
 *  variables: {
 *    query: {
 *      id: 1
 *      name: "John Doe"
 *    }
 *  }
 * });
 *
 * @example
 * hxql("my-element", {
 *   query: new URL("https://mywebsite.com/path/to/query.graphql"),
 * }, {
 *  process: false // default is true
 *  trigger: "load" // default is "load"
 * });
 *  ```
 *  */
declare const hxql: (htmx: any, id: string, request: Request, options?: Options) => Promise<Element>;
export default hxql;
