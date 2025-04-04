import path from "path";
import {
  toISOString,
  toAbsoluteUrl,
  formatDateFr,
  excludeCSS,
  toAbsoluteImageUrl,
} from "./config/filters/index.js";
import dir from "./config/constants/dir.js";
import { imageShortcode } from "./config/shortcodes/image.js";
import { faviconShortcode } from "./config/shortcodes/favicon.js";
import { minify } from "html-minifier-terser";
import esbuild from "esbuild";
import browserslist from "browserslist";
import { bundle, browserslistToTargets } from "lightningcss";

const TEMPLATE_ENGINE = "liquid";

export default function(eleventyConfig) {
  // Watch targets
  eleventyConfig.addWatchTarget(path.join(dir.input, "/assets/styles"));
  eleventyConfig.addWatchTarget(path.join(dir.input, "/assets/scripts"));

  eleventyConfig.addPassthroughCopy(
    path.join(dir.input, "/assets/images/svg/sprites")
  );
  eleventyConfig.addPassthroughCopy(path.join(dir.input, "/assets/scripts"));
  eleventyConfig.addPassthroughCopy(path.join(dir.input, "/assets/fonts"));

  // Custom shortcodes
  eleventyConfig.addShortcode("image", imageShortcode);
  eleventyConfig.addShortcode("favicon", faviconShortcode);

  // Custom filters
  eleventyConfig.addFilter("toAbsoluteUrl", toAbsoluteUrl); // utilisé
  eleventyConfig.addFilter("toIsoString", toISOString); // utilisé
  eleventyConfig.addFilter("formatDateFr", formatDateFr); // utilisé
  eleventyConfig.addFilter("excludeCSS", excludeCSS); // utilisé
  eleventyConfig.addFilter("toAbsoluteImageUrl", toAbsoluteImageUrl); // utilisé
  eleventyConfig.addFilter("toJson", JSON.stringify); // non utilisé
  eleventyConfig.addFilter("fromJson", JSON.parse); // utilisé 
  eleventyConfig.addFilter("keys", Object.keys); // non utilisé
  eleventyConfig.addFilter("values", Object.values); // non utilisé
  eleventyConfig.addFilter("entries", Object.entries); // non utilisé

  // Process CSS
  eleventyConfig.addTemplateFormats("css");

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (_inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }
      if (parsed.name === "index.css") {
        return;
      }

      let targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

      return async () => {
        let { code } = await bundle({
          filename: inputPath,
          minify: true,
          sourceMap: false,
          targets,
        });
        return code;
      };
    },
  });

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }

    return content;
  });

  // Minify JS
  eleventyConfig.on("afterBuild", () => {
    return esbuild.build({
      entryPoints: [path.join(dir.input, "/assets/scripts/index.js")],
      outdir: path.join(dir.output, "/assets/scripts/"),
      minify: process.env.ELEVENTY_ENV === "production",
      sourcemap: process.env.ELEVENTY_ENV !== "production",
    });
  });

  return {
    dir,
    dataTemplateEngine: TEMPLATE_ENGINE,
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
    templateFormats: ["html", "md", TEMPLATE_ENGINE],
  };
};
