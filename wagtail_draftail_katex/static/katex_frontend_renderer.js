(() => {
  /**
   * This script is executed on the site’s front-end.
   *
   * It looks for the KaTeX blocks, and renders them with KaTeX.
   */
  const katex = window.katex;

  const katexBlocks = [].slice.call(document.querySelectorAll('[data-katex-text]'));

  katexBlocks.forEach((block) => {
    window.katex.render(block.dataset.katexText, block)
  });
})();
