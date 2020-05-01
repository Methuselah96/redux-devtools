import React from 'react';
import PropTypes from 'prop-types';
import { Styling } from './index';

/**
 * Renders simple values (eg. strings, numbers, booleans, etc)
 */

interface Props {
  nodeType: string;
  styling: Styling;
  labelRenderer: (keyPath: (string | number)[], nodeType: string, expanded: boolean, expandable: boolean) => React.ReactNode;
  keyPath: (string | number)[];
  valueRenderer: (gottenValue: any, value: any, ...keyPath: (string | number)[]) => React.ReactNode;
  value: any;
  valueGetter?: (value: any) => any;
}

const JSONValueNode: React.FunctionComponent<Props> = ({
  nodeType,
  styling,
  labelRenderer,
  keyPath,
  valueRenderer,
  value,
  valueGetter = value => value,
}) => (
  <li {...styling('value', nodeType, keyPath)}>
    <label {...styling(['label', 'valueLabel'], nodeType, keyPath)}>
      {labelRenderer(keyPath, nodeType, false, false)}
    </label>
    <span {...styling('valueText', nodeType, keyPath)}>
      {valueRenderer(valueGetter(value), value, ...keyPath)}
    </span>
  </li>
);

JSONValueNode.propTypes = {
  nodeType: PropTypes.string.isRequired,
  styling: PropTypes.func.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  ).isRequired,
  valueRenderer: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueGetter: PropTypes.func.isRequired
};

export default JSONValueNode;
