const { EditorState } = window.DraftJS;

/**
 * Forces a reset of the whole editor state, so text decorations are re-calculated on all blocks.
 * By default, Draft.js only updates decorations for the blocks that are under focus.
 */
const forceResetEditorState = (editorState) => {
  return EditorState.set(
    EditorState.createWithContent(
      editorState.getCurrentContent(),
      editorState.getDecorator()
    ),
    {
      selection: editorState.getSelection(),
      undoStack: editorState.getUndoStack(),
      redoStack: editorState.getRedoStack(),
    }
  );
};

/**
 * Execute time-consuming logic out of order with performance-sensitive JS on the main thread.
 */
const delayAndIdle = (callback, timeoutHandle) => {
  if (timeoutHandle) {
    window.clearTimeout(timeoutHandle);
  }

  return window.setTimeout(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(callback, { timeout: 500 });
    } else {
      callback();
    }
  }, 500);
};

const { Component } = window.React;

class WordChecks extends Component {
  constructor(props) {
    super(props);

    this.forceRenderDecorators = this.forceRenderDecorators.bind(this);
  }

  forceRenderDecorators() {
    const { getEditorState, onChange } = this.props;
    const editorState = getEditorState();

    this.timeoutHandle = delayAndIdle(() => {
      console.log("delayed");
      onChange(forceResetEditorState(editorState));
    }, this.timeoutHandle);
  }

  componentDidUpdate() {
    const { getEditorState } = this.props;
    const editorState = getEditorState();
    const lastChange = editorState.getLastChangeType();

    if (lastChange) {
      this.forceRenderDecorators();
    }
  }

  render() {
    return null;
  }
}

const wordiness = {
  disincentivise: "",
  liaise: "",
  streamline: "",
  dialogue: "",
  "touch base": "",
  "blue sky thinking": "",
};

const unusalWords = {
  "means-tested benefits": "",
  "carers allowance": "",
  "non-means tested benefits": "",
  "contributory benefits": "",
};

const flagKeys = [...Object.keys(wordiness), ...Object.keys(unusalWords)];

const flagsRegexPattern = `(${flagKeys.join("|")})`;

const squigglyStyles = {
  textDecorationLine: "underline",
  textDecorationStyle: "wavy",
  textDecorationColor: "orange",
};

const Flag = ({ children }) => {
  console.log(children);
  return React.createElement(
    "span",
    {
      style: squigglyStyles,
      "data-draftail-balloon": true,
      "aria-label": "This may be too wordy",
    },
    children
  );
};

class WordFlags {
  constructor() {
    this.component = Flag;
    this.strategy = this.getDecorations.bind(this);
  }

  getDecorations(block, callback) {
    if (block.getType() === "atomic") {
      return;
    }

    const blockText = block.getText();

    for (const flag of blockText.matchAll(new RegExp(flagsRegexPattern, "g"))) {
      callback(flag.index, flag.index + flag[0].length);
    }
  }
}

// window.draftail.registerControl(WordChecks);
window.draftail.registerDecorator(new WordFlags());
