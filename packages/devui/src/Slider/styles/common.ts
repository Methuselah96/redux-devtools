import { css } from 'styled-components';
import { Theme } from '../../utils/theme';

interface CommonStyleProps {
  theme: Theme;
}

export const containerStyle = ({ theme }: CommonStyleProps) => css`
  display: flex;
  align-items: center;

  div {
    margin-left: 4px;
    padding: 0.3em 0.5em;
    border: ${theme.inputBorderWidth}px solid ${theme.inputBorderColor};
    border-radius: ${theme.inputBorderRadius}px;
    background-color: ${theme.base00};
    opacity: 0.7;
  }
`;
