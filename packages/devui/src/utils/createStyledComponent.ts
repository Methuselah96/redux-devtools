import styled, { InterpolationValue } from 'styled-components';
import getDefaultTheme from '../themes/default';
import { Base16Theme } from 'base16';

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

function hasType();

function createStyledComponent<
  P extends { theme: { type?: string } | Base16Theme },
  TTag extends keyof JSX.IntrinsicElements
>(
  styles:
    | { [type: string]: StylingFunction<P>; default: StylingFunction<P> }
    | StylingFunction<P>,
  component?: TTag
) {
  return styled(component || 'div')`
    ${(props: P) =>
      (props.theme.type
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
