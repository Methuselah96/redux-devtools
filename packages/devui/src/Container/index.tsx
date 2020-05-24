import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { getTheme, ThemeData } from '../utils/theme';
import { MainContainerWrapper, ContainerWrapper } from './styles';

interface Props {
  children?: React.ReactNode;
  themeData?: ThemeData;
  theme?: unknown;
  className?: string;
}

const Container: React.FunctionComponent<Props> = ({
  themeData,
  className,
  theme,
  children
}) => {
  if (!themeData) {
    return (
      <ContainerWrapper className={className} theme={theme}>
        {children}
      </ContainerWrapper>
    );
  }

  return (
    <ThemeProvider theme={getTheme(themeData)}>
      <MainContainerWrapper className={className}>
        {children}
      </MainContainerWrapper>
    </ThemeProvider>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  themeData: PropTypes.object,
  theme: PropTypes.object,
  className: PropTypes.string
};

export default Container;