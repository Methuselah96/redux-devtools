import { Base16Theme, StylingConfig, StylingValue } from 'react-base16-styling';

export default function getJsonTreeTheme(
  base16Theme: Base16Theme
): StylingConfig {
  return {
    extend: base16Theme as StylingValue,
    nestedNode: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        ...style,
        whiteSpace: expanded ? 'inherit' : 'nowrap'
      }
    }),
    nestedNodeItemString: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        ...style,
        display: expanded ? 'none' : 'inline'
      }
    })
  };
}
