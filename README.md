# HXQL Client

A client side script to assist appending graphql to the `hx-vals` property from htmx.

## Usage

1. Import script

```html
<script src="https://unpkg.com/hxql@0.0.11/dist/hxql.umd.min.js"></script>
```

2. Use `hxql`

Load graphql from a URL or pass in a query string.

1. Pass in `htmx` as first argument.
2. Pass in the `id` of the element you want to append the query to.
3. Provide the query and options.

```html
<div id="blog-list" hx-post="/blog/components/blog-list" hx-swap="outerHTML transition:true">

<script>
  // Load from URL
  hxql(htmx, "blog-list", {
    query: new URL("/blog/GetBlogs.graphql", window.location.origin),
  })

  // Load query from string
  hxql(htmx, "sidebar", {
    query: `
        query GetTags($get_tags_input: get_tags_input!) {
          get_tags(get_tags_input: $get_tags_input) {
            data {
              id
              name
            }
          }
        }
    `,
    variables: {
      get_tags_input: {
        query: {},
        opts: {
          per_page: -1
        }
      }
    },
  })
</script>
```

## API

### hxql(htmx, id, request)

- `htmx` - HTMX (Object) - Pass in htmx from the parent application.
- `id` - - String - The target where graphql will be appended to the hx-vals.
- `request` - Object
    - `query` - String | URL - Required - A graphql query or mutation.
    - `variables` - Object - Variables associated with the query or mutation.
- `options` - Object
    - `process` - boolean (default true) - Automatically process htmx, triggering the network request.
    - `trigger` - string (default "load") - When to process the htmx (see htmx docs).
