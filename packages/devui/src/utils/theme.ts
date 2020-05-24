import * as themes from '../themes';
import { nicinabox as defaultDarkScheme } from 'redux-devtools-themes';
import * as baseSchemes from 'base16';
import * as additionalSchemes from '../colorSchemes';
import invertColors from '../utils/invertColors';
import { Base16Theme } from 'base16';

export const schemes = { ...baseSchemes, ...additionalSchemes };
export const listSchemes = () =>
  Object.keys(schemes)
    .slice(1)
    .sort(); // remove `__esModule`
export const listThemes = () => Object.keys(themes);

export interface ThemeData {
  theme: keyof typeof themes;
  scheme: keyof typeof schemes;
  light: boolean;
}

export const getTheme = ({ theme: type, scheme, light }: ThemeData) => {
  let colors: Base16Theme;
  if (scheme === 'default') {
    colors = light ? schemes.default : defaultDarkScheme;
  } else {
    colors = schemes[scheme];
    if (light) colors = invertColors(colors);
  }

  let theme = {
    type,
    light,
    ...themes.default(colors)
  };
  if (type !== 'default') {
    theme = { ...theme, ...themes[type](colors) };
  }

  return theme;
};