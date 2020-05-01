import React from 'react';
import PropTypes from 'prop-types';
import JSONNestedNode from './JSONNestedNode';
import { Styling } from './index';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: any) {
  return `${data.length} ${data.length !== 1 ? 'items' : 'item'}`;
}

interface Props {
  data: any;

  getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
  hideRoot: boolean;
  styling: Styling;
  collectionLimit: number;
  keyPath: (string | number)[];
  level: number;
  isCircular: boolean;
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;

  shouldExpandNode: (keyPath: (string | number)[], data: any, level: number) => boolean;
  postprocessValue: (value: any) => any;
}

// Configures <JSONNestedNode> to render an Array
const JSONArrayNode: React.FunctionComponent<Props> = ({ data, ...props }) => (
  <JSONNestedNode
    {...props}
    data={data}
    nodeType="Array"
    nodeTypeIndicator="[]"
    createItemString={createItemString}
    expandable={data.length > 0}
  />
);

JSONArrayNode.propTypes = {
  data: PropTypes.array
};

export default JSONArrayNode;
