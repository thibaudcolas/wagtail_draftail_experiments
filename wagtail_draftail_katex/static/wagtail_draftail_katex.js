(() => {
  const React = window.React;
  const AtomicBlockUtils = window.DraftJS.AtomicBlockUtils;
  const katex = window.katex;

  /**
   * A React component that renders nothing.
   * We actually create the entities directly in the componentDidMount lifecycle hook.
   */
  // Warning: This code uses ES2015+ syntax, it will not work in IE11.
  class KaTeXSource extends React.Component {
    componentDidMount() {
        const { editorState, entityType, onComplete } = this.props;

        const content = editorState.getCurrentContent();

        // This is very basic – we do not even support editing existing blocks.
        // This also crashes very hard if no text is supplied.
        const text = window.prompt('KaTeX text:', 'c = \pm\sqrt{a^2 + b^2}');

        // Uses the Draft.js API to create a new entity with the right data.
        const contentWithEntity = content.createEntity(
            entityType.type,
            'IMMUTABLE',
            {
                text: text,
            },
        );
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
        const nextState = AtomicBlockUtils.insertAtomicBlock(
          editorState,
          entityKey,
          ' ',
        );

        onComplete(nextState);
    }

    render() {
        return null;
    }
  }

  class KaTeXBlock extends React.Component {
    render() {
      const { blockProps } = this.props;
      const { entity } = blockProps;
      const { text } = entity.getData();


      // This is the most basic block possible – just a single div, with inner HTML managed by KaTeX
      // See https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/tex/js/components/TeXBlock.js
      // for a more advanced example.
      return React.createElement(
        'div',
        {
          dangerouslySetInnerHTML: {
            __html: katex.renderToString(text),
          }
        },
      );
    }
  }

  window.draftail.registerPlugin({
    type: 'KATEX',
    source: KaTeXSource,
    block: KaTeXBlock,
  });

})();
