import React from 'react';
import PropTypes from 'prop-types';
import JSONNestedNode from './JSONNestedNode';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: any) {
  return `${data.length} ${data.length !== 1 ? 'items' : 'item'}`;
}

interface Props {
  data: any;
}

// interface Props {
//   // Self
//   data: any;
//
//   // JSONNestedNode pass-through props
//   shouldExpandNode: (keyPath: (string | number)[], data: any, level: number) => boolean;
//   isCircular: boolean;
//   keyPath: (string | number)[];
//   getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
//   hideRoot: boolean;
//   styling: Styling;
//   collectionLimit: number;
//   labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
//   postprocessValue: (value: any) => any;
//   sortObjectKeys: boolean;
//
//   // JSONNestedNode optional pass-through props
//   circularCache?: any[];
//   level?: number;
//   value: any;
//   valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
//   isCustomNode: (value: any) => boolean;
// }

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
