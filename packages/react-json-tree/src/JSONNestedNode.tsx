import React from 'react';
import PropTypes from 'prop-types';
import JSONArrow from './JSONArrow';
import getCollectionEntries from './getCollectionEntries';
import JSONNode from './JSONNode';
import ItemRange from './ItemRange';
import { Styling } from './index';

/**
 * Renders nested values (eg. objects, arrays, lists, etc.)
 */

interface RenderChildNodesProps {
  // Self
  nodeType: string;
  data: any;
  collectionLimit: number;
  circularCache: any[];
  keyPath: (string | number)[];
  postprocessValue: (value: any) => any;
  sortObjectKeys: boolean;

  // ItemRange pass-through props
  styling: Styling;

  // JSONNode pass-through props
  getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
  value: any;
  valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
  isCustomNode: (value: any) => boolean;
  shouldExpandNode: (keyPath: (string | number)[], data: any, level: number) => boolean;
  isCircular: boolean;
  hideRoot: boolean;
  level?: number;
  expandable: boolean;
}

interface Range {
  from: number;
  to: number;
}

interface Entry {
  key: string | number;
  value: any;
}

function isRange(rangeOrEntry: Range | Entry): rangeOrEntry is Range {
  return (rangeOrEntry as Range).to !== undefined;
}

function renderChildNodes(props: RenderChildNodesProps, from?: number, to?: number) {
  const {
    nodeType,
    data,
    collectionLimit,
    circularCache,
    keyPath,
    postprocessValue,
    sortObjectKeys
  } = props;
  const childNodes: React.ReactNode[] = [];

  getCollectionEntries(
    nodeType,
    data,
    sortObjectKeys,
    collectionLimit,
    from,
    to
  ).forEach(entry => {
    if (isRange(entry)) {
      childNodes.push(
        <ItemRange
          {...props}
          key={`ItemRange--${entry.from}-${entry.to}`}
          from={entry.from}
          to={entry.to}
          renderChildNodes={renderChildNodes}
        />
      );
    } else {
      const { key, value } = entry;
      const isCircular = circularCache.indexOf(value) !== -1;

      const node = (
        <JSONNode
          {...props}
          {...{ postprocessValue, collectionLimit }}
          key={`Node--${key}`}
          keyPath={[key, ...keyPath]}
          value={postprocessValue(value)}
          circularCache={[...circularCache, value]}
          isCircular={isCircular}
          hideRoot={false}
        />
      );

      childNodes.push(node);
    }
  });

  return childNodes;
}

interface Props {
  // Self
  shouldExpandNode: (keyPath: (string | number)[], data: any, level: number) => boolean;
  isCircular: boolean;
  keyPath: (string | number)[];
  getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
  nodeTypeIndicator: string;
  nodeType: string;
  hideRoot: boolean;
  createItemString: (data: any, collectionLimit: number) => string;
  styling: Styling;
  collectionLimit: number;
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;

  // Self optional
  data: any;
  circularCache: any[];
  level: number;
  expandable: boolean;

  // renderChildNode pass-through props
  postprocessValue: (value: any) => any;
  sortObjectKeys: boolean;
  value: any;
  valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
  isCustomNode: (value: any) => boolean;
}

interface State {
  expanded: boolean;
}

function getStateFromProps(props: Props): State {
  // calculate individual node expansion if necessary
  const expanded =
    props.shouldExpandNode && !props.isCircular
      ? props.shouldExpandNode(props.keyPath, props.data, props.level)
      : false;
  return {
    expanded
  };
}

export default class JSONNestedNode extends React.Component<Props, State> {
  static propTypes = {
    getItemString: PropTypes.func.isRequired,
    nodeTypeIndicator: PropTypes.any,
    nodeType: PropTypes.string.isRequired,
    data: PropTypes.any,
    hideRoot: PropTypes.bool.isRequired,
    createItemString: PropTypes.func.isRequired,
    styling: PropTypes.func.isRequired,
    collectionLimit: PropTypes.number,
    keyPath: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    labelRenderer: PropTypes.func.isRequired,
    shouldExpandNode: PropTypes.func,
    level: PropTypes.number.isRequired,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    isCircular: PropTypes.bool,
    expandable: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    circularCache: [],
    level: 0,
    expandable: true
  };

  constructor(props: Props) {
    super(props);
    this.state = getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextState = getStateFromProps(nextProps);
    if (getStateFromProps(this.props).expanded !== nextState.expanded) {
      this.setState(nextState);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      !!Object.keys(nextProps).find(
        key =>
          key !== 'circularCache' &&
          (key === 'keyPath'
            ? nextProps[key].join('/') !== this.props[key].join('/')
            : nextProps[key] !== this.props[key])
      ) || nextState.expanded !== this.state.expanded
    );
  }

  render() {
    const {
      getItemString,
      nodeTypeIndicator,
      nodeType,
      data,
      hideRoot,
      createItemString,
      styling,
      collectionLimit,
      keyPath,
      labelRenderer,
      expandable
    } = this.props;
    const { expanded } = this.state;
    const renderedChildren =
      expanded || (hideRoot && this.props.level === 0)
        ? renderChildNodes({ ...this.props, level: this.props.level + 1 })
        : null;

    const itemType = (
      <span {...styling('nestedNodeItemType', expanded)}>
        {nodeTypeIndicator}
      </span>
    );
    const renderedItemString = getItemString(
      nodeType,
      data,
      itemType,
      createItemString(data, collectionLimit)
    );
    const stylingArgs = [keyPath, nodeType, expanded, expandable] as const;

    return hideRoot ? (
      <li {...styling('rootNode', ...stylingArgs)}>
        <ul {...styling('rootNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </ul>
      </li>
    ) : (
      <li {...styling('nestedNode', ...stylingArgs)}>
        {expandable && (
          <JSONArrow
            styling={styling}
            nodeType={nodeType}
            expanded={expanded}
            onClick={this.handleClick}
          />
        )}
        <label
          {...styling(['label', 'nestedNodeLabel'], ...stylingArgs)}
          onClick={this.handleClick}
        >
          {labelRenderer(...stylingArgs)}
        </label>
        <span
          {...styling('nestedNodeItemString', ...stylingArgs)}
          onClick={this.handleClick}
        >
          {renderedItemString}
        </span>
        <ul {...styling('nestedNodeChildren', ...stylingArgs)}>
          {renderedChildren}
        </ul>
      </li>
    );
  }

  handleClick = () => {
    if (this.props.expandable) {
      this.setState({ expanded: !this.state.expanded });
    }
  };
}
