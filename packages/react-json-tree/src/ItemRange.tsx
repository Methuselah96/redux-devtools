import React from 'react';
import PropTypes from 'prop-types';
import JSONArrow from './JSONArrow';

export default class ItemRange extends React.Component {
  static propTypes = {
    styling: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    renderChildNodes: PropTypes.func.isRequired,
    nodeType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { expanded: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((prevState) => ({ expanded: !prevState.expanded }));
  }

  render() {
    const { styling, from, to, renderChildNodes, nodeType } = this.props;
    const { expanded } = this.state;

    return expanded ? (
      <div {...styling('itemRange', expanded)}>
        {renderChildNodes(this.props, from, to)}
      </div>
    ) : (
      <div
        {...styling('itemRange', expanded)}
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
}
