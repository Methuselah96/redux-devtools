import React from 'react';
import { Styling } from './index';

export interface JSONTreeJSONValueNodeProps {
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
  keyPath: (string | number)[];
  valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
}

export interface JSONNodeJSONValueNodeProps extends JSONTreeJSONValueNodeProps {
  styling: Styling;
}

export interface JSONTreeJSONNestedNodeProps extends JSONTreeJSONValueNodeProps {
  // nodeType: string;
  // data: any;

  shouldExpandNode: (keyPath: (string | number)[], data: any, level: number) => boolean;
  getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
  hideRoot: boolean;
  collectionLimit: number;
  postprocessValue: (value: any) => any;
  sortObjectKeys?: boolean;
}

type JSONNodeJSONNestedNodePropsBase = JSONNodeJSONValueNodeProps & JSONTreeJSONNestedNodeProps;
export interface JSONNodeJSONNestedNodeProps extends JSONNodeJSONNestedNodePropsBase {
  isCircular?: boolean;
  level?: number;
  circularCache?: any[];
}

export interface JSONTreeJSONNodeProps extends JSONTreeJSONNestedNodeProps {
  isCustomNode: (value: any) => boolean;
}

export type JSONNodePropsBase = JSONNodeJSONNestedNodeProps & JSONTreeJSONNodeProps;
