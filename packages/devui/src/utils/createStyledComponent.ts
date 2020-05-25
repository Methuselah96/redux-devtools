import styled, { InterpolationValue } from 'styled-components';
import getDefaultTheme from '../themes/default';
import { Base16Theme } from 'base16';
import { Theme } from './theme';
import * as React from 'react';

type StylingFunction<Props> = (props: Props) => InterpolationValue[];

const getStyle = <P>(
  styles:
    | {
        [type: string]: StylingFunction<P>;
        default: StylingFunction<P>;
      }
    | StylingFunction<P>,
  type: string
) => (typeof styles === 'object' ? styles[type] || styles.default : styles);

function isTheme(theme: Theme | Base16Theme): theme is Theme {
  return (theme as Theme).type !== undefined;
}

// function createStyledComponent<P extends { theme: Theme | Base16Theme }>(
//   styles:
//     | { [type: string]: StylingFunction<P>; default: StylingFunction<P> }
//     | StylingFunction<P>
// ): StyledComponentClass<P, T, O>;
// function createStyledComponent<
//   P extends { theme: Theme | Base16Theme },
//   TTag extends keyof JSX.IntrinsicElements
// >(
//   styles:
//     | { [type: string]: StylingFunction<P>; default: StylingFunction<P> }
//     | StylingFunction<P>,
//   component: TTag
// );
// function createStyledComponent<P extends { theme: Theme | Base16Theme }>(
//   styles:
//     | { [type: string]: StylingFunction<P>; default: StylingFunction<P> }
//     | StylingFunction<P>,
//   component: React.ComponentClass<P>
// );
function createStyledComponent<
  P extends { theme: Theme | Base16Theme },
  TTag extends keyof JSX.IntrinsicElements
>(
  styles:
    | { [type: string]: StylingFunction<P>; default: StylingFunction<P> }
    | StylingFunction<P>,
  component?: TTag | React.ComponentClass<P>
) {
  return styled((component as TTag) || 'div')`
    ${(props: P) =>
      (isTheme(props.theme)
        ? getStyle(styles, props.theme.type)
        : // used outside of container (theme provider)
          getStyle(styles, 'default'))({
        ...props,
        theme: getDefaultTheme(props.theme)
      })}
  `;
}

export default createStyledComponent;

// TODO: memoize it?
