/**
 * @jest-environment jsdom
 */
const { hxql, fromPath } = require("../dist/hxql.cjs.js");

describe("hxql", () => {
  beforeEach(() => {
    const element = document.createElement("div");
    element.id = "test";
    document.body.appendChild(element);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: { users: [] } }),
      })
    );

    global.htmx = {
      process: jest.fn(),
    };

    // set current path to /blog
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/blog",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Get element by id", () => {
    const element = document.getElementById("test");
    expect(element).not.toBeNull();
  });

  test("Expect hxql function", () => {
    expect(hxql).toBeDefined();
    expect(typeof hxql).toBe("function");
  });

  test("expect hx-vals", async () => {
    await hxql(htmx, "test", {
      variables: { id: 1 },
      query: `
        query GetUsers {
          users {
            id
            name
          }
        }
      `,
    });
    const element = document.getElementById("test");
    expect(element).not.toBeNull();

    const hxVals = element.getAttribute("hx-vals");
    expect(hxVals).not.toBeNull();

    const parsed = JSON.parse(hxVals);
    expect(parsed).toEqual({
      query: "query GetUsers { users { id name } }",
      variables: { id: 1 },
      operation_name: "GetUsers",
    });
  });

  test("expect trigger load", async () => {
    await hxql(htmx, "test", {
      variables: { id: 1 },
      query: `
        query GetUsers {
          users {
            id
            name
          }
        }
      `,
    });
    const element = document.getElementById("test");
    expect(element).not.toBeNull();
    const hxTrigger = element.getAttribute("hx-trigger");
    expect(hxTrigger).not.toBeNull();
    expect(hxTrigger).toEqual("load");
  });

  test("expect fromPath defined", async () => {
    expect(fromPath).toBeDefined();
    expect(typeof fromPath).toBe("function");
  });

  test("expect fromPath element updated", async () => {
    const element = document.getElementById("test");
    expect(element).not.toBeNull();
    fromPath(htmx, "test", "user.md");
    const hxGet = element.getAttribute("hx-get");
    expect(hxGet).not.toBeNull();
    expect(hxGet).toEqual("/blog/user.md");
  });
});
