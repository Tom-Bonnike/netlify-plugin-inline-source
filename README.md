# netlify-plugin-inline-source

A Netlify Build plugin to inline your assets/sources, built on top of the [`inline-source` package](https://github.com/popeindustries/inline-source). By default, it inlines and compresses tags that use the `inline` attribute and supports `<script>`, `<link>`, and `<img>`.

Inlining your assets/sources can lead to faster websites as it reduces the number of HTTP requests, at the cost of making your HTML files heavier. For best performance, you should usually only inline critical, [render-blocking resources](https://web.dev/render-blocking-resources/) and let the rest load normally.
If you want to automatically extract and inline your critical CSS, you can use [`netlify-plugin-inline-critical-css`](https://github.com/Tom-Bonnike/netlify-plugin-inline-critical-css).

```html
<html>
  <head>
    <!-- inline `styles.css` to a `<style>` tag -->
    <link inline href="styles.css" />

    <!-- inline `main.js` to a `<script>` tag -->
    <script inline src="main.js"></script>

    <!-- inline a remote file to a `<script>` tag -->
    <script inline src="https://some-website.com/script.js"></script>
  </head>
  <body>
    <!-- inline `image.png` to a `<img src="data:image/png;base64, …">` tag -->
    <img inline src="image.png" />

    <!-- inline `image.svg` to a `<svg>` tag -->
    <img inline src="image.svg" />
  </body>
</html>
```

## Usage and inputs

To install the plugin in the Netlify UI, use this [direct in-app installation link](https://app.netlify.com/plugins/netlify-plugin-inline-source/install) or go to the [Plugins directory](https://app.netlify.com/plugins).


For file-based installation, add it to your `netlify.toml` file.

```toml
[[plugins]]
  package = "netlify-plugin-inline-source"

  # All inputs are optional, so you can omit this section.
  # Defaults are shown below.
  # You can also refer to the `inline-source` documentation: https://github.com/popeindustries/inline-source#usage.
  [plugins.inputs]
    # Attribute used to parse sources. All tags will be parsed if set to `false`.
    attribute = "inline"

    # Enable/disable compression of inlined content.
    compress = true

    # Maintain leading whitespace when `compress` is `false`.
    pretty = false

    # Disable inlining based on tag, type, and/or format.
    ignore = []

    # Convert `<img inline src="*.svg" />` to `<img>` and not `<svg>`.
    svgAsImage = false
```

To complete file-based installation, from your project's base directory, use npm, yarn, or any other Node.js package manager to add the plugin to `devDependencies` in `package.json`.

```bash
npm install -D netlify-plugin-inline-source
```

Once installed and configured, the plugin will automatically run on the Netlify CI.

### Testing locally

To test this plugin locally, you can use the [Netlify CLI](https://github.com/netlify/cli):

```bash
# Install the Netlify CLI.
npm install netlify-cli -g

# In the project working directory, run the build as Netlify would with the build bot.
netlify build
```
