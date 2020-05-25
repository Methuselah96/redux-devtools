import Color from 'color';
import convert from 'color-convert';

/*
  Apply color effects like
    effect('#ffffff', 'darken', 0.5);
    effect('#000000', 'lighten', 0.5);
    effect('#000000', 'alpha', 0.5);
*/

export default (color: string, effect: 'fade', val: number) =>
  Color(color)
    [effect](val)
    .hsl()
    .string();

// TODO: memoize it
