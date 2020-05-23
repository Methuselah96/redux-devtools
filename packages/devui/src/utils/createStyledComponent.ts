import styled, { InterpolationValue } from 'styled-components';
import getDefaultTheme from '../themes/default';

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

function createStyledComponent<
  P extends { theme: { type?: string } },
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
