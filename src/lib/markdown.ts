import MarkdownIt from "markdown-it";
import MarkdownItKatex from "markdown-it-katex";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import markdownItMermaid from "@wekanteam/markdown-it-mermaid";

const markdownIt = new MarkdownIt({
  html: true,
  breaks: true,
});

markdownIt
  .use(MarkdownItKatex)
  .use(MarkdownItHighlightjs, { inline: true })
  .use(markdownItMermaid);

export default markdownIt;
