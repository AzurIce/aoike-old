import MarkdownIt from "markdown-it";

const markdownIt = new MarkdownIt({
  html: true,
  breaks: true,
});

export default markdownIt;
