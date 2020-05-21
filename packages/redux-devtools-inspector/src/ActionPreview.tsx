import React, { Component } from 'react';
import { DEFAULT_STATE, MonitorState } from './redux';
import ActionPreviewHeader from './ActionPreviewHeader';
import DiffTab from './tabs/DiffTab';
import StateTab from './tabs/StateTab';
import ActionTab from './tabs/ActionTab';
import { Base16Theme, StylingFunction } from 'react-base16-styling';
import { Delta } from 'jsondiffpatch';
import { Action } from 'redux';
import { PerformAction } from 'redux-devtools';

const DEFAULT_TABS = [
  {
    name: 'Action',
    component: ActionTab
  },
  {
    name: 'Diff',
    component: DiffTab
  },
  {
    name: 'State',
    component: StateTab
  }
];

interface Props<S, A extends Action<unknown>> {
  styling: StylingFunction;
  delta: false | Delta | null | undefined;
  error: string | undefined;
  nextState: S;
  onInspectPath: unknown;
  inspectedPath: unknown[];
  tabName: string;
  isWideLayout: boolean;
  onSelectTab: (tabName: string) => void;
  action: A;
  actions: { [actionId: number]: PerformAction<A> };
  selectedActionId: number | null;
  startActionId: number | null;
  computedStates: { state: S; error?: string }[];
  base16Theme: Base16Theme;
  invertTheme: boolean;
  tabs: unknown;
  dataTypeKey: unknown;
  monitorState: MonitorState;
  updateMonitorState: (monitorState: Partial<MonitorState>) => void;
}

class ActionPreview<S, A extends Action<unknown>> extends Component<
  Props<S, A>
> {
  static defaultProps = {
    tabName: DEFAULT_STATE.tabName
  };

  render() {
    const {
      styling,
      delta,
      error,
      nextState,
      onInspectPath,
      inspectedPath,
      tabName,
      isWideLayout,
      onSelectTab,
      action,
      actions,
      selectedActionId,
      startActionId,
      computedStates,
      base16Theme,
      invertTheme,
      tabs,
      dataTypeKey,
      monitorState,
      updateMonitorState
    } = this.props;

    const renderedTabs =
      typeof tabs === 'function'
        ? tabs(DEFAULT_TABS)
        : tabs
        ? tabs
        : DEFAULT_TABS;

    const { component: TabComponent } =
      renderedTabs.find(tab => tab.name === tabName) ||
      renderedTabs.find(tab => tab.name === DEFAULT_STATE.tabName);

    return (
      <div key="actionPreview" {...styling('actionPreview')}>
        <ActionPreviewHeader
          tabs={renderedTabs}
          {...{ styling, inspectedPath, onInspectPath, tabName, onSelectTab }}
        />
        {!error && (
          <div key="actionPreviewContent" {...styling('actionPreviewContent')}>
            <TabComponent
              labelRenderer={this.labelRenderer}
              {...{
                styling,
                computedStates,
                actions,
                selectedActionId,
                startActionId,
                base16Theme,
                invertTheme,
                isWideLayout,
                dataTypeKey,
                delta,
                action,
                nextState,
                monitorState,
                updateMonitorState
              }}
            />
          </div>
        )}
        {error && <div {...styling('stateError')}>{error}</div>}
      </div>
    );
  }

  labelRenderer = ([key, ...rest], nodeType, expanded) => {
    const { styling, onInspectPath, inspectedPath } = this.props;

    return (
      <span>
        <span {...styling('treeItemKey')}>{key}</span>
        <span
          {...styling('treeItemPin')}
          onClick={() =>
            onInspectPath([
              ...inspectedPath.slice(0, inspectedPath.length - 1),
              ...[key, ...rest].reverse()
            ])
          }
        >
          {'(pin)'}
        </span>
        {!expanded && ': '}
      </span>
    );
  };
}

export default ActionPreview;
