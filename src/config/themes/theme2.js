import clone from 'clone';
import defaultTheme from './themedefault';

const theme = clone(defaultTheme);
theme.palette.primary = ['#f00'];
theme.palette.secondary = ['#0f0'];
export default theme;
