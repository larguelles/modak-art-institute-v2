type ColorType = {
  h: number;
  l: number;
  s: number;
  percentage: number;
  population: number;
};

const getAccentColor = ({color}: {color: ColorType}) =>
  'hsl(' + color?.h + ', ' + color?.s + '%, ' + color?.l + '%)';

export default getAccentColor;
