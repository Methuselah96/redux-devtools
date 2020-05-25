import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles/index';

const ContextMenuWrapper = createStyledComponent(styles);

type Item = { name: string; value?: string } | HTMLButtonElement;

interface Props {
  items: Item[];
  onClick: (value: string) => void;
  x: number;
  y: number;
  visible?: boolean;
}

export default class ContextMenu extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateItems(props.items);
  }

  menu?: HTMLDivElement | null;
  items?: React.ReactNode[];

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.items !== this.props.items ||
      nextProps.visible !== this.props.visible
    ) {
      this.updateItems(nextProps.items);
    }
  }

  componentDidMount() {
    this.amendPosition();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.x !== this.props.x || prevProps.y !== this.props.y) {
      this.amendPosition();
    }
  }

  onMouseUp: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.currentTarget.blur();
  };

  onClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    this.props.onClick(e.currentTarget.value);
  };

  amendPosition() {
    const { x, y } = this.props;
    const { scrollTop, scrollLeft } = document.documentElement;
    const { innerWidth, innerHeight } = window;
    const rect = this.menu!.getBoundingClientRect();
    let left = x + scrollLeft;
    let top = y + scrollTop;

    if (y + rect.height > innerHeight) {
      top = innerHeight - rect.height;
    }
    if (x + rect.width > innerWidth) {
      left = innerWidth - rect.width;
    }
    if (top < 0) {
      top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
    }
    if (left < 0) {
      left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
    }

    this.menu!.style.top = `${top}px`;
    this.menu!.style.left = `${left}px`;
  }

  updateItems(items: Item[]) {
    this.items = items.map(item => {
      const value = item.value || item.name;
      if ((item as HTMLButtonElement).type === 'button') return item;
      return (
        <button
          key={value}
          value={value}
          onMouseUp={this.onMouseUp}
          onClick={this.onClick}
        >
          {item.name}
        </button>
      );
    });
  }

  menuRef: React.RefCallback<HTMLDivElement> = c => {
    this.menu = c;
  };

  render() {
    return (
      <ContextMenuWrapper
        innerRef={this.menuRef}
        left={this.props.x}
        top={this.props.y}
        visible={this.props.visible}
      >
        {this.items}
      </ContextMenuWrapper>
    );
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    visible: PropTypes.bool
  };
}
