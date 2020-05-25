import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabsHeader from './TabsHeader';
import { TabsContainer } from './styles/common';

export interface Tab {
  name: string;
  value?: string;
  component?: React.ComponentType;
  selector?: (tab: this) => unknown;
}

interface Props {
  tabs: Tab[];
  selected?: string;
  main?: boolean;
  onClick: (value: string) => void;
  collapsible?: boolean;
  position: 'left' | 'right' | 'center';
}

export default class Tabs extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateTabs(props);
  }

  tabsHeader?: JSX.Element[];
  SelectedComponent?: React.ComponentType;
  selector?: () => unknown;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selected !== this.props.selected) {
      this.updateTabs(nextProps);
    }
  }

  onMouseUp: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.currentTarget.blur();
  };

  onClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    this.props.onClick(e.currentTarget.value);
  };

  updateTabs(props: Props) {
    const tabs = props.tabs;
    const selected = props.selected;

    this.tabsHeader = tabs.map((tab, i) => {
      let isSelected;
      const value = typeof tab.value !== 'undefined' ? tab.value : tab.name;
      if (value === selected) {
        isSelected = true;
        if (tab.component) {
          this.SelectedComponent = tab.component;
          if (tab.selector) this.selector = () => tab.selector(tab);
        }
      }
      return (
        <button
          key={i}
          value={value}
          data-selected={isSelected}
          onMouseUp={this.onMouseUp}
          onClick={this.onClick}
        >
          {tab.name}
        </button>
      );
    });
  }

  render() {
    const tabsHeader = (
      <TabsHeader
        tabs={this.tabsHeader!}
        items={this.props.tabs}
        main={this.props.main}
        collapsible={this.props.collapsible}
        onClick={this.props.onClick}
        selected={this.props.selected}
        position={this.props.position}
      />
    );

    if (!this.SelectedComponent) {
      return (
        <TabsContainer position={this.props.position}>
          {tabsHeader}
        </TabsContainer>
      );
    }

    return (
      <TabsContainer position={this.props.position}>
        {tabsHeader}
        <div>
          <this.SelectedComponent {...(this.selector && this.selector())} />
        </div>
      </TabsContainer>
    );
  }

  static propTypes = {
    tabs: PropTypes.array.isRequired,
    selected: PropTypes.string,
    main: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    collapsible: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right', 'center'])
  };

  static defaultProps = { position: 'left' };
}
