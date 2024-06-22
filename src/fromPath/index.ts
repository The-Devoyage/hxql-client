interface Options {
  match?: RegExpMatchArray | string[];
  process?: boolean;
  trigger?: string;
}
/**
 * @param htmx - htmx object
 * @param id - id of the element
 * @param fileName - name of the file to fetch
 * @param match - optional array of strings to match the path with
 * @param options - optional object with the following properties
 * @param options.process - whether to process the content after fetching default is true
 * @param options.trigger - htmx trigger event to use default is "load"
 * @returns HTMLElement | null
 * @description Uses the current path as the hx-get value. Appends the file name to the path and replaces the target element with the content of the file.
 * @example
 * fromPath(htmx, "content", "content.html");
 * @example
 **/
export const fromPath = (
  htmx: any,
  id: string,
  fileName: string,
  options: Options = {
    process: true,
    trigger: "load",
  }
): HTMLElement | null => {
  const content = document.getElementById(id);

  if (!content) {
    throw new Error(`Element with id ${id} not found`);
  }

  // When page loads, use url path as hx-get value
  const path = window.location.pathname;

  // If match is provided, only fetch the file if the path matches the match value
  // else, fetch the file regardless of the path
  if (options.match && options.match.length > 0) {
    // If it is an array of strings
    // Check if the path matches any of the strings
    // else, if it is a RegExpMatchArray, check if the path matches the string
    if (Array.isArray(options.match)) {
      if (!options.match.includes(path)) return null;
    } else {
      if (!path.match(options.match)) return null;
    }
  }

  content.setAttribute("hx-get", path + `/${fileName}`);
  content.setAttribute("hx-trigger", options.trigger || "load");

  if (options.process) htmx.process(content);

  return content;
};
