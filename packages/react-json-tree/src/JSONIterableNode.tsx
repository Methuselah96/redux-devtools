import React from 'react';
import JSONNestedNode from './JSONNestedNode';
import { CircularPropsPassedThroughJSONNode } from './types';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: any, limit: number) {
  let count = 0;
  let hasMore = false;
  if (Number.isSafeInteger(data.size)) {
    count = data.size;
  } else {
    // eslint-disable-next-line no-unused-vars
    for (const entry of data) {
      if (limit && count + 1 > limit) {
        hasMore = true;
        break;
      }
      count += 1;
    }
  }
  return `${hasMore ? '>' : ''}${count} ${count !== 1 ? 'entries' : 'entry'}`;
}

interface Props extends CircularPropsPassedThroughJSONNode {
  data: any;
  nodeType: string;
}

// interface Props {
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
//   data?: any;
//   circularCache?: any[];
//   level?: number;
//   expandable?: boolean;
//   value: any;
//   valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
//   isCustomNode: (value: any) => boolean;
// }

// Configures <JSONNestedNode> to render an iterable
const JSONIterableNode: React.FunctionComponent<Props> = ({ ...props }) => {
  return (
    <JSONNestedNode
      {...props}
      nodeType="Iterable"
      nodeTypeIndicator="()"
      createItemString={createItemString}
    />
  );
}

export default JSONIterableNode;
