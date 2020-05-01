import React from 'react';
import PropTypes from 'prop-types';
import JSONArrow from './JSONArrow';
import { Styling } from './index';

interface Props {
  styling: Styling;
  from: number;
  to: number;
  renderChildNodes: (props: Props, from: number, to: number) => React.ReactNode;
  nodeType: string;

  data: any;
  collectionLimit: number;
  circularCache: any[];
  keyPath: (string | number)[];
  postprocessValue: (value: any) => any;
  sortObjectKeys: boolean;

  level: number;
}

interface State {
  expanded: boolean;
}

export default class ItemRange extends React.Component<Props, State> {
  static propTypes = {
    styling: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    renderChildNodes: PropTypes.func.isRequired,
    nodeType: PropTypes.string.isRequired
  };

  constructor(props: Props) {
    super(props);
    this.state = { expanded: false };

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { styling, from, to, renderChildNodes, nodeType } = this.props;

    return this.state.expanded ? (
      <div {...styling('itemRange', this.state.expanded)}>
        {renderChildNodes(this.props, from, to)}
      </div>
    ) : (
      <div
        {...styling('itemRange', this.state.expanded)}
        onClick={this.handleClick}
      >
        <JSONArrow
          nodeType={nodeType}
          styling={styling}
          expanded={false}
          onClick={this.handleClick}
          arrowStyle="double"
        />
        {`${from} ... ${to}`}
      </div>
    );
  }

  handleClick() {
    this.setState({ expanded: !this.state.expanded });
  }
}
