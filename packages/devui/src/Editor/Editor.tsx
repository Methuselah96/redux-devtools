import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CodeMirror from 'codemirror';
import { defaultStyle, themedStyle } from './styles';

const EditorContainer = styled.div('', ({ theme }) =>
  theme.scheme === 'default' && theme.light ? defaultStyle : themedStyle(theme)
);

interface Props {
  value: string;
  mode: string;
  lineNumbers: boolean;
  lineWrapping: boolean;
  readOnly: boolean;
  theme: unknown;
  foldGutter: boolean;
  autofocus: boolean;
  onChange?: (value: string, change: CodeMirror.EditorChangeLinkedList) => void;
}

export default class Editor extends Component<Props> {
  cm?: CodeMirror.Editor | null;
  node?: HTMLDivElement | null;

  componentDidMount() {
    this.cm = CodeMirror(this.node!, {
      value: this.props.value,
      mode: this.props.mode,
      lineNumbers: this.props.lineNumbers,
      lineWrapping: this.props.lineWrapping,
      readOnly: this.props.readOnly,
      autofocus: this.props.autofocus,
      foldGutter: this.props.foldGutter,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    });

    if (this.props.onChange) {
      this.cm.on('change', (doc, change) => {
        this.props.onChange(doc.getValue(), change);
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value !== this.cm!.getValue()) {
      this.cm!.setValue(nextProps.value);
    }
    if (nextProps.readOnly !== this.props.readOnly) {
      this.cm!.setOption('readOnly', nextProps.readOnly);
    }
    if (nextProps.lineNumbers !== this.props.lineNumbers) {
      this.cm!.setOption('lineNumbers', nextProps.lineNumbers);
    }
    if (nextProps.lineWrapping !== this.props.lineWrapping) {
      this.cm!.setOption('lineWrapping', nextProps.lineWrapping);
    }
    if (nextProps.foldGutter !== this.props.foldGutter) {
      this.cm!.setOption('foldGutter', nextProps.foldGutter);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    const node = this.node!;
    node.removeChild(node.children[0]);
    this.cm = null;
  }

  getRef: React.RefCallback<HTMLDivElement> = node => {
    this.node = node;
  };

  render() {
    return <EditorContainer innerRef={this.getRef} theme={this.props.theme} />;
  }

  static propTypes = {
    value: PropTypes.string,
    mode: PropTypes.string,
    lineNumbers: PropTypes.bool,
    lineWrapping: PropTypes.bool,
    readOnly: PropTypes.bool,
    theme: PropTypes.object,
    foldGutter: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: '',
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: false,
    readOnly: false,
    foldGutter: true,
    autofocus: false
  };
}
