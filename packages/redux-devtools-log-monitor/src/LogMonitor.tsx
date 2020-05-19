import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as themes from 'redux-devtools-themes';
import { ActionCreators, LiftedAction, PerformAction } from 'redux-devtools';
import { Base16Theme } from 'base16';
import { Action, Dispatch } from 'redux';
import {
  updateScrollTop,
  startConsecutiveToggle,
  LogMonitorAction
} from './actions';
import reducer, { LogMonitorState } from './reducers';
import LogMonitorButtonBar from './LogMonitorButtonBar';
import LogMonitorEntryList from './LogMonitorEntryList';
import debounce from 'lodash.debounce';

const { toggleAction, setActionsActive } = ActionCreators;

const styles: {
  container: React.CSSProperties;
  elements: React.CSSProperties;
} = {
  container: {
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
    direction: 'ltr'
  },
  elements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflowX: 'hidden',
    overflowY: 'auto'
  }
};

export interface Props<S, A extends Action> {
  dispatch: Dispatch<
    LogMonitorAction | LiftedAction<S, A, LogMonitorState, LogMonitorAction>
  >;
  computedStates: { state: S; error?: string }[];
  actionsById: { [actionId: number]: PerformAction<A> };
  stagedActionIds: number[];
  skippedActionIds: number[];
  currentStateIndex: number;
  monitorState: LogMonitorState;

  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof themes | Base16Theme;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  hideMainButtons?: boolean;
}

export default class LogMonitor<S, A extends Action> extends Component<
  Props<S, A>
> {
  static update = reducer;

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    actionsById: PropTypes.object,
    stagedActionIds: PropTypes.array,
    skippedActionIds: PropTypes.array,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number,
      consecutiveToggleStartId: PropTypes.number
    }),

    preserveScrollTop: PropTypes.bool,
    select: PropTypes.func,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    expandActionRoot: PropTypes.bool,
    expandStateRoot: PropTypes.bool,
    markStateDiff: PropTypes.bool,
    hideMainButtons: PropTypes.bool
  };

  static defaultProps = {
    select: (state: unknown) => state,
    theme: 'nicinabox',
    preserveScrollTop: true,
    expandActionRoot: true,
    expandStateRoot: true,
    markStateDiff: false
  };

  scrollDown?: boolean;
  node?: HTMLDivElement | null;

  shouldComponentUpdate = shouldPureComponentUpdate;

  updateScrollTop = debounce(() => {
    const node = this.node;
    this.props.dispatch(updateScrollTop(node ? node.scrollTop : 0));
  }, 500);

  scroll() {
    const node = this.node;
    if (!node) {
      return;
    }
    if (this.scrollDown) {
      const { offsetHeight, scrollHeight } = node;
      node.scrollTop = scrollHeight - offsetHeight;
      this.scrollDown = false;
    }
  }

  componentDidMount() {
    const node = this.node;
    if (!node || !this.props.monitorState) {
      return;
    }

    if (this.props.preserveScrollTop) {
      node.scrollTop = this.props.monitorState.initialScrollTop;
      node.addEventListener('scroll', this.updateScrollTop);
    } else {
      this.scrollDown = true;
      this.scroll();
    }
  }

  componentWillUnmount() {
    const node = this.node;
    if (node && this.props.preserveScrollTop) {
      node.removeEventListener('scroll', this.updateScrollTop);
    }
  }

  componentWillReceiveProps(nextProps: Props<S, A>) {
    const node = this.node;
    if (!node) {
      this.scrollDown = true;
    } else if (
      this.props.stagedActionIds.length < nextProps.stagedActionIds.length
    ) {
      const { scrollTop, offsetHeight, scrollHeight } = node;

      this.scrollDown =
        Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate() {
    this.scroll();
  }

  handleToggleAction = (id: number) => {
    this.props.dispatch(toggleAction(id));
  };

  handleToggleConsecutiveAction = (id: number) => {
    const { monitorState, actionsById } = this.props;
    const { consecutiveToggleStartId } = monitorState;
    if (consecutiveToggleStartId && actionsById[consecutiveToggleStartId]) {
      const { skippedActionIds } = this.props;
      const start = Math.min(consecutiveToggleStartId, id);
      const end = Math.max(consecutiveToggleStartId, id);
      const active = skippedActionIds.includes(consecutiveToggleStartId);
      this.props.dispatch(setActionsActive(start, end + 1, active));
      this.props.dispatch(startConsecutiveToggle(null));
    } else if (id > 0) {
      this.props.dispatch(startConsecutiveToggle(id));
    }
  };

  getTheme() {
    const { theme } = this.props;
    if (typeof theme !== 'string') {
      return theme;
    }

    if (typeof themes[theme] !== 'undefined') {
      return themes[theme];
    }

    // eslint-disable-next-line no-console
    console.warn(
      'DevTools theme ' + theme + ' not found, defaulting to nicinabox'
    );
    return themes.nicinabox;
  }

  getRef: React.RefCallback<HTMLDivElement> = node => {
    this.node = node;
  };

  render() {
    const theme = this.getTheme();
    const { consecutiveToggleStartId } = this.props.monitorState;

    const {
      dispatch,
      actionsById,
      skippedActionIds,
      stagedActionIds,
      computedStates,
      currentStateIndex,
      select,
      expandActionRoot,
      expandStateRoot,
      markStateDiff
    } = this.props;

    const entryListProps = {
      theme,
      actionsById,
      skippedActionIds,
      stagedActionIds,
      computedStates,
      currentStateIndex,
      consecutiveToggleStartId,
      select,
      expandActionRoot,
      expandStateRoot,
      markStateDiff,
      onActionClick: this.handleToggleAction,
      onActionShiftClick: this.handleToggleConsecutiveAction
    };

    return (
      <div style={{ ...styles.container, backgroundColor: theme.base00 }}>
        {!this.props.hideMainButtons && (
          <LogMonitorButtonBar
            theme={theme}
            dispatch={dispatch}
            hasStates={computedStates.length > 1}
            hasSkippedActions={skippedActionIds.length > 0}
          />
        )}
        <div
          style={
            this.props.hideMainButtons
              ? styles.elements
              : { ...styles.elements, top: 30 }
          }
          ref={this.getRef}
        >
          <LogMonitorEntryList {...entryListProps} />
        </div>
      </div>
    );
  }
}