import React from 'react';
import PropTypes from 'prop-types';
import JSONNestedNode, { JSONNestedNodeProps } from './JSONNestedNode';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: any) {
  const len = Object.getOwnPropertyNames(data).length;
  return `${len} ${len !== 1 ? 'keys' : 'key'}`;
}

type JSONNestedNodeSpreadProps = Omit<JSONNestedNodeProps, 'data' | 'nodeType' | 'nodeTypeIndicator' | 'createItemString' | 'expandable'>;
export interface JSONObjectNodeProps extends JSONNestedNodeSpreadProps {
  data: any;
  nodeType: string;
}

// interface Props {
//   // Self
//   data: any;
//   nodeType: string;
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
//   // valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
//
//   // JSONNestedNode optional pass-through props
//   level?: number;
//   circularCache?: any[];
//   value: any;
//   valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
//   isCustomNode: (value: any) => boolean;
// }

// Configures <JSONNestedNode> to render an Object
const JSONObjectNode: React.FunctionComponent<JSONObjectNodeProps> = ({ data, ...props }) => (
  <JSONNestedNode
    {...props}
    data={data}
    nodeType="Object"
    nodeTypeIndicator={props.nodeType === 'Error' ? 'Error()' : '{}'}
    createItemString={createItemString}
    expandable={Object.getOwnPropertyNames(data).length > 0}
  />
);

JSONObjectNode.propTypes = {
  data: PropTypes.object,
  nodeType: PropTypes.string.isRequired
};

export default JSONObjectNode;
