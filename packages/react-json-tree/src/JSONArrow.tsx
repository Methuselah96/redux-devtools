import React, { MouseEventHandler } from 'react';
import PropTypes from 'prop-types';
import { Styling } from './index';

interface Props {
  styling: Styling;
  arrowStyle?: 'single' | 'double';
  expanded: boolean;
  nodeType: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const JSONArrow: React.FunctionComponent<Props> = ({ styling, arrowStyle = 'single', expanded, nodeType, onClick }) => (
  <div {...styling('arrowContainer', arrowStyle)} onClick={onClick}>
    <div {...styling(['arrow', 'arrowSign'], nodeType, expanded, arrowStyle)}>
      {'\u25B6'}
      {arrowStyle === 'double' && (
        <div {...styling(['arrowSign', 'arrowSignInner'])}>{'\u25B6'}</div>
      )}
    </div>
  </div>
);

JSONArrow.propTypes = {
  styling: PropTypes.func.isRequired,
  arrowStyle: PropTypes.oneOf(['single', 'double']),
  expanded: PropTypes.bool.isRequired,
  nodeType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default JSONArrow;
