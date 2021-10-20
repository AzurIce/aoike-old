import MarkdownIt from "markdown-it";
import MarkdownItKatex from "markdown-it-katex";
import MarkdownItHighlightjs from "markdown-it-highlightjs";

const markdownIt = new MarkdownIt({
  html: true,
  breaks: true,
});

markdownIt.use(MarkdownItKatex).use(MarkdownItHighlightjs, { inline: true });

export default markdownIt;
