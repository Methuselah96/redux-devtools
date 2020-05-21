import React from 'react';
import PropTypes from 'prop-types';
import { StylingFunction } from 'react-base16-styling';

interface Props {
  styling: StylingFunction;
  shown?: boolean;
  children: React.ReactNode;
  rotate?: boolean;
}

const RightSlider: React.FunctionComponent<Props> = ({
  styling,
  shown,
  children,
  rotate
}) => (
  <div
    {...styling([
      'rightSlider',
      shown && 'rightSliderShown',
      rotate && 'rightSliderRotate',
      rotate && shown && 'rightSliderRotateShown'
    ])}
  >
    {children}
  </div>
);

RightSlider.propTypes = {
  shown: PropTypes.bool
};

export default RightSlider;
