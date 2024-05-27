var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as graphql from "graphql";
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
const hxql = (htmx_1, id_1, request_1, ...args_1) => __awaiter(void 0, [htmx_1, id_1, request_1, ...args_1], void 0, function* (htmx, id, request, options = {
    process: true,
    trigger: "load",
}) {
    var _a;
    if (!request.query) {
        throw new Error("Query is required");
    }
    // If url is a URL object, fetch the graphql query
    if (typeof request.query === "object") {
        const response = yield fetchGraphQL(request.query);
        request.query = response;
    }
    // Parse the Operation Name
    const gql = graphql.parse(request.query);
    const definition = gql.definitions[0];
    if (definition.kind !== "OperationDefinition") {
        throw new Error("Only operation definitions are allowed");
    }
    const operation_name = (_a = definition.name) === null || _a === void 0 ? void 0 : _a.value;
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
    if (options.process)
        htmx.process(element);
    return element;
});
const fetchGraphQL = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield fetch(url.toString(), {
        method: "GET",
    });
    return (yield request.text());
});
export default hxql;
