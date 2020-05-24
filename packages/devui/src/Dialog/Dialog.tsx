import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import createStyledComponent from '../utils/createStyledComponent';
import * as styles from './styles';
import Button from '../Button';
import Form from '../Form';

const DialogWrapper = createStyledComponent(styles);

interface Props {
  open?: boolean;
  title?: string;
  children?: React.ReactNode[];
  actions?: React.ReactNode[];
  submitText?: string;
  fullWidth?: boolean;
  noHeader?: boolean;
  noFooter?: boolean;
  modal?: boolean;
  onDismiss: (e: React.MouseEvent<HTMLButtonElement> | false) => void;
  onSubmit: () => void;
  theme: unknown;
}

export default class Dialog extends (PureComponent || Component)<Props> {
  submitButton?: HTMLInputElement | null;

  onSubmit = () => {
    if (this.submitButton) this.submitButton.click();
    else this.props.onSubmit();
  };

  getFormButtonRef: React.RefCallback<HTMLInputElement> = node => {
    this.submitButton = node;
  };

  onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.keyCode === 27 /* esc */) {
      e.preventDefault();
      this.props.onDismiss(false);
    }
  };

  render() {
    const {
      modal,
      open,
      fullWidth,
      title,
      children,
      actions,
      noHeader,
      noFooter,
      submitText,
      onDismiss,
      ...rest
    } = this.props;
    const schema = rest.schema;

    return (
      <DialogWrapper
        open={open}
        fullWidth={fullWidth}
        onKeyDown={this.onKeyDown}
        theme={rest.theme}
      >
        <div onClick={!modal && onDismiss} />
        <div>
          {!noHeader && (
            <div className="mc-dialog--header">
              <div>{schema ? schema.title || title : title}</div>
              {!modal && <button onClick={onDismiss}>×</button>}
            </div>
          )}
          <div className="mc-dialog--body">
            {children}
            {schema && (
              <Form {...rest}>
                {!noFooter && (
                  <input
                    type="submit"
                    ref={this.getFormButtonRef}
                    className="mc-dialog--hidden"
                  />
                )}
              </Form>
            )}
          </div>
          {!noFooter &&
            (actions ? (
              <div className="mc-dialog--footer">
                {submitText
                  ? [
                      ...actions,
                      <Button
                        key="default-submit"
                        primary
                        onClick={this.onSubmit}
                      >
                        {submitText}
                      </Button>
                    ]
                  : actions}
              </div>
            ) : (
              <div className="mc-dialog--footer">
                <Button onClick={onDismiss}>Cancel</Button>
                <Button primary onClick={this.onSubmit}>
                  {submitText || 'Submit'}
                </Button>
              </div>
            ))}
        </div>
      </DialogWrapper>
    );
  }

  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.any,
    actions: PropTypes.node,
    submitText: PropTypes.string,
    fullWidth: PropTypes.bool,
    noHeader: PropTypes.bool,
    noFooter: PropTypes.bool,
    modal: PropTypes.bool,
    onDismiss: PropTypes.func,
    onSubmit: PropTypes.func,
    theme: PropTypes.object
  };
}