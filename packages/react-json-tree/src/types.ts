import React from 'react';
import { Styling } from './index';

export interface JSONValueNodePropsBase {
  styling: Styling;
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
  keyPath: (string | number)[];
  valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
  value: any;
}

export interface JSONNodePropsBase extends JSONValueNodePropsBase {
  getItemString: (nodeType: string, data: any, itemType: React.ReactNode, itemString: string) => string;
  isCustomNode: (value: any) => boolean;
  shouldExpandNode: (keyPath: (string | number)[], data: any, level: number) => boolean;
  isCircular: boolean;
  level?: number;
  hideRoot: boolean;
  styling: Styling;
  collectionLimit: number;
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
  expandable?: boolean;
  circularCache?: any[];
  postprocessValue: (value: any) => any;
  sortObjectKeys: boolean;
}

export interface JSONNestedNodePropsBase extends JSONNodePropsBase {
  data: any;
}
