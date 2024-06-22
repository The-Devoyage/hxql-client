import * as graphql from "graphql";
import { fromPath } from "./fromPath";

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
 * @param request - The request object containing the query and variables
 * @param options - Optional object with the following properties
 * @param options.process - Whether to process the content after fetching default is true
 * @param options.trigger - htmx trigger event to use default is "load"
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

const hxql = async (
  htmx: any,
  id: string,
  request: Request,
  options: Options = {
    process: true,
    trigger: "load",
  }
): Promise<Element> => {
  if (!request.query) {
    throw new Error("Query is required");
  }

  // If url is a URL object, fetch the graphql query
  if (typeof request.query === "object") {
    const response = await fetchGraphQL(request.query);
    request.query = response;
  }

  // Parse the Operation Name
  const gql = graphql.parse(request.query);
  const definition = gql.definitions[0];
  if (definition.kind !== "OperationDefinition") {
    throw new Error("Only operation definitions are allowed");
  }
  const operation_name = definition.name?.value;

  // Set the hx-vals attribute
  const hxVals = JSON.stringify({
    // trim the query to remove newlines and whitespace
    query: request.query.replace(/\s+/g, " ").trim(),
    variables: request.variables || {},
    operation_name,
  });

  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Element with id ${id} not found`);
  }

  element.setAttribute("hx-vals", hxVals);
  element.setAttribute("hx-trigger", options.trigger || "load");
  if (options.process) htmx.process(element);
  return element;
};

const fetchGraphQL = async (url: URL) => {
  const request = await fetch(url.toString(), {
    method: "GET",
  });
  return (await request.text()) as string;
};

export { fromPath, hxql };
