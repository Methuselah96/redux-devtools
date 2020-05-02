import React from 'react';
import PropTypes from 'prop-types';
import objType from './objType';
import JSONObjectNode, {
  JSONNestedNodeSpreadProps, JSONObjectNodeItemRangeProps,
  JSONObjectNodeJSONNestedNodeProps,
  JSONObjectNodeOwnProps, JSONObjectNodeRenderChildNodesProps
} from './JSONObjectNode';
import JSONArrayNode from './JSONArrayNode';
import JSONIterableNode from './JSONIterableNode';
import JSONValueNode, { JSONValueNodeProps } from './JSONValueNode';
import { Styling } from './index';

// type JSONValueSpreadProps = Pick<JSONValueNodeProps, 'nodeType' | 'styling' | 'labelRenderer' | 'keyPath' | 'valueRenderer' | 'value'>;
// export interface JSONNodeProps extends JSONValueSpreadProps {
//   getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
//   isCustomNode: (value: any) => boolean;
// }

export interface JSONNodeOwnProps {
  getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
  keyPath: (string | number)[];
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
  styling: Styling;
  value: any;
  valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
  isCustomNode: (value: any) => boolean;
}
type SimpleNodePropsKeys = 'getItemString' | 'keyPath' | 'labelRenderer' | 'nodeType' | 'styling' | 'value' | 'valueRenderer';
type NestedNodePropsKeys = 'data' | 'isCustomNode';
export type JSONNodeJSONValueNodeProps = Omit<JSONValueNodeProps, SimpleNodePropsKeys>;
export type JSONNodeJSONObjectNodeProps = Omit<JSONObjectNodeOwnProps, SimpleNodePropsKeys | NestedNodePropsKeys>;
export type JSONNodeJSONNestedNodeProps = Omit<JSONObjectNodeJSONNestedNodeProps, SimpleNodePropsKeys | NestedNodePropsKeys>;
export type JSONNodeRenderChildNodesProps = Omit<JSONObjectNodeRenderChildNodesProps, SimpleNodePropsKeys | NestedNodePropsKeys>;
export type JSONNodeItemRangeProps = Omit<JSONObjectNodeItemRangeProps, SimpleNodePropsKeys | NestedNodePropsKeys>;
type JSONNodeProps = JSONNodeOwnProps & JSONNodeJSONValueNodeProps & JSONNodeJSONObjectNodeProps & JSONNodeJSONNestedNodeProps & JSONNodeRenderChildNodesProps & JSONNodeItemRangeProps;

// interface Props {
//   // Self
//   getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
//   keyPath: (string | number)[];
//   labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
//   styling: Styling;
//   value: any;
//   valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
//   isCustomNode: (value: any) => boolean;
//
//   // JSONNestedNode pass-through props
//   shouldExpandNode: (keyPath: (string | number)[], data: any, level: number) => boolean;
//   isCircular: boolean;
//   hideRoot: boolean;
//   collectionLimit: number;
//   postprocessValue: (value: any) => any;
//   sortObjectKeys: boolean;
//
//   // JSONNestedNode optional pass-through props
//   data?: any;
//   circularCache?: any[];
//   level?: number;
//   expandable: boolean;
// }

const JSONNode: React.FunctionComponent<JSONNodeProps> = ({
  getItemString,
  keyPath,
  labelRenderer,
  styling,
  value,
  valueRenderer,
  isCustomNode,
  ...rest
}) => {
  const nodeType = isCustomNode(value) ? 'Custom' : objType(value);

  const simpleNodeProps = {
    getItemString,
    key: keyPath[0],
    keyPath,
    labelRenderer,
    nodeType,
    styling,
    value,
    valueRenderer,
  };

  const nestedNodeProps = {
    ...rest,
    ...simpleNodeProps,
    data: value,
    isCustomNode
  };

  switch (nodeType) {
    case 'Object':
    case 'Error':
    case 'WeakMap':
    case 'WeakSet':
      return <JSONObjectNode {...nestedNodeProps} />;
    case 'Array':
      return <JSONArrayNode {...nestedNodeProps} />;
    case 'Iterable':
    case 'Map':
    case 'Set':
      return <JSONIterableNode {...nestedNodeProps} />;
    case 'String':
      return (
        <JSONValueNode {...simpleNodeProps} valueGetter={raw => `"${raw}"`} />
      );
    case 'Number':
      return <JSONValueNode {...simpleNodeProps} />;
    case 'Boolean':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => (raw ? 'true' : 'false')}
        />
      );
    case 'Date':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => raw.toISOString()}
        />
      );
    case 'Null':
      return <JSONValueNode {...simpleNodeProps} valueGetter={() => 'null'} />;
    case 'Undefined':
      return (
        <JSONValueNode {...simpleNodeProps} valueGetter={() => 'undefined'} />
      );
    case 'Function':
    case 'Symbol':
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => raw.toString()}
        />
      );
    case 'Custom':
      return <JSONValueNode {...simpleNodeProps} />;
    default:
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={() => `<${nodeType}>`}
        />
      );
  }
};

JSONNode.propTypes = {
  getItemString: PropTypes.func.isRequired,
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  ).isRequired,
  labelRenderer: PropTypes.func.isRequired,
  styling: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueRenderer: PropTypes.func.isRequired,
  isCustomNode: PropTypes.func.isRequired
};

export default JSONNode;
