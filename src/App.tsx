import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, css } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatRgb, type Okhsv } from 'culori';
import { observable } from 'mobx';
import { Stack } from 'common/components/Stack';
import { runtime } from 'common/hoc/runtime';
import { useMobx } from 'common/hooks/useMobx';
import { GlobalRuntime } from 'context';
import { EndpointPanel } from 'modules/EndpointPanel/EndpointPanel';
import { LightBulb } from 'modules/LightBulb/LightBulb';
import { PaletteViewer } from 'modules/PaletteViewer/PaletteViewer';
// import { TestButton } from 'modules/TestButton/TestButton';
import { darkTheme } from './theme';

const baseColor: Okhsv = {
  h: 0,
  mode: 'okhsv',
  s: 0,
  v: 0,
};

export const App: React.FC = runtime(GlobalRuntime)(() => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const state = useMobx(() => ({ color: baseColor }), {
    color: observable.ref,
  });

  // useRuntime(
  //   GlobalRuntime,
  //   Effect.gen(function* () {
  //     const hello = yield* Hello;
  //     yield* Ref.update(hello, (value) => value + 1);
  //     const hello2 = yield* Ref.get(hello);
  //     yield* Console.log(hello2);
  //   })
  // );

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : darkTheme}>
      <CssBaseline />
      <Stack css={appStyles.root}>
        {/* <TestButton foo='bar' /> */}
        <EndpointPanel onChange={() => {}} />
        <LightBulb
          onChange={state.set('color')}
          getStyle={state.lazyGet('color', (value) => ({
            background: formatRgb(value),
          }))}
        />
        <PaletteViewer getColor={state.lazyGet('color')} />
        {/* <ThemeVisualizer theme={prefersDarkMode ? darkTheme : lightTheme} /> */}
      </Stack>
    </ThemeProvider>
  );
});

const appStyles = {
  root: css`
    background: inherit;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1em;
    margin: 0 auto;
    padding: 1em;
    width: 30em;
  `,
};
