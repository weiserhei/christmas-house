// vite.config.js
import { createHtmlPlugin } from "vite-plugin-html";
import { defineConfig } from "vite";

export default defineConfig({
  // config options
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true, // also necessary
    chunkSizeWarningLimit: 1000,
  },
  server: {
    open: true,
    host: "0.0.0.0",
    port: 80,
  },
  optimizeDeps: {
    include: ["three"],
  },
  // optimizeDeps: {
  // needed bc vite cant find entry due to createHtml
  // entries: "src/js/main.js",
  // },
  plugins: [
    createHtmlPlugin({
      minify: true,
      entry: "js/main.js",
      template: "index.html",
      /**
       * Data that needs to be injected into the index.html ejs template
       */
      inject: {
        data: {
          title: "Christmas 2015",
          // injectScript: `<script src="./inject.js"></script>`,
        },
        // tags: [
        //   {
        //     injectTo: "body-prepend",
        //     tag: "div",
        //     attrs: {
        //       id: "tag",
        //     },
        //   },
        // ],
      },
    }),
  ],
});
