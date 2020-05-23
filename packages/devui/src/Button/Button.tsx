import React, { Component, MouseEventHandler } from 'react';
import PropTypes from 'prop-types';
import createStyledComponent from '../utils/createStyledComponent';
import * as styles from './styles';
import { commonStyle, tooltipStyle } from './styles/common';

const ButtonWrapper = createStyledComponent(styles, 'button');
const TooltipWrapper = createStyledComponent(tooltipStyle);
const CommonWrapper = createStyledComponent(commonStyle);

interface Props {
  children: unknown;
  title?: string;
  tooltipPosition:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-left'
    | 'top-right';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: string;
  disabled?: boolean;
  primary?: boolean;
  size?: 'big' | 'normal' | 'small';
  mark?:
    | false
    | 'base08'
    | 'base09'
    | 'base0A'
    | 'base0B'
    | 'base0C'
    | 'base0D'
    | 'base0E'
    | 'base0F';
  theme?: unknown;
}

export default class Button extends Component<Props> {
  static propTypes = {
    children: PropTypes.any.isRequired,
    title: PropTypes.string,
    tooltipPosition: PropTypes.oneOf([
      'top',
      'bottom',
      'left',
      'right',
      'bottom-left',
      'bottom-right',
      'top-left',
      'top-right'
    ]),
    onClick: PropTypes.func,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    primary: PropTypes.bool,
    size: PropTypes.oneOf(['big', 'normal', 'small']),
    mark: PropTypes.oneOf([
      false,
      'base08',
      'base09',
      'base0A',
      'base0B',
      'base0C',
      'base0D',
      'base0E',
      'base0F'
    ]),
    theme: PropTypes.object
  };

  static defaultProps = {
    tooltipPosition: 'top'
  };

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.mark !== this.props.mark ||
      nextProps.size !== this.props.size ||
      nextProps.primary !== this.props.primary ||
      nextProps.tooltipPosition !== this.props.tooltipPosition ||
      nextProps.title !== this.props.title
    );
  }

  onMouseUp: MouseEventHandler<HTMLButtonElement> = e => {
    e.target.blur();
  };

  render() {
    const button = (
      <ButtonWrapper
        theme={this.props.theme}
        aria-label={this.props.title}
        primary={this.props.primary}
        disabled={this.props.disabled}
        onMouseUp={this.onMouseUp}
        onClick={this.props.onClick}
        type={this.props.type}
      >
        {this.props.children}
      </ButtonWrapper>
    );

    const Wrapper = this.props.title ? TooltipWrapper : CommonWrapper;
    return (
      <Wrapper
        theme={this.props.theme}
        tooltipTitle={this.props.title}
        tooltipPosition={this.props.tooltipPosition}
        size={this.props.size}
        mark={this.props.mark}
      >
        {button}
      </Wrapper>
    );
  }
}

Button.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string,
  tooltipPosition: PropTypes.oneOf([
    'top',
    'bottom',
    'left',
    'right',
    'bottom-left',
    'bottom-right',
    'top-left',
    'top-right'
  ]),
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  primary: PropTypes.bool,
  size: PropTypes.oneOf(['big', 'normal', 'small']),
  mark: PropTypes.oneOf([
    false,
    'base08',
    'base09',
    'base0A',
    'base0B',
    'base0C',
    'base0D',
    'base0E',
    'base0F'
  ]),
  theme: PropTypes.object
};
