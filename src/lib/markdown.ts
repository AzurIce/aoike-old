import MarkdownIt from "markdown-it";
import MarkdownItKatex from "markdown-it-katex";

const markdownIt = new MarkdownIt({
  html: true,
  breaks: true,
});

markdownIt.use(MarkdownItKatex);

export default markdownIt;
