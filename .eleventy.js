const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const safeLinks = require('@sardine/eleventy-plugin-external-links');
const CleanCSS = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const dumpFilter = require("@jamshop/eleventy-filter-dump");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(safeLinks);
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addFilter("dump", dumpFilter);

    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS().minify(code).styles;
    });

    eleventyConfig.addPlugin(syntaxHighlight, {
        templateFormats: ["njk", "md"],
        alwaysWrapLineHighlights: true,
        trim: true,
        lineSeparator: "\n",
    });

    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true
    }).use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.ariaHidden({
            placement: "after",
            class: "direct-link",
            symbol: "#",
            level: [1, 2, 3, 4],
        }),
    });
    eleventyConfig.setLibrary("md", markdownLibrary);
    return {
        dir: {
            input: 'src',
            output: '_site'
        }
    }
}
