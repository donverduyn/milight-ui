import * as React from 'react';
import { css } from '@mui/material/styles';
import type { Okhsv } from 'culori';
import { Effect, Layer, Queue, pipe } from 'effect';
import { observer } from 'mobx-react-lite';
import { State } from '__generated/api';
import { Select } from 'common/components/Select';
import { Slider } from 'common/components/Slider';
import { Stack } from 'common/components/Stack';
import { TextField } from 'common/components/TextField';
import { createRuntimeProvider, runtime } from 'common/hoc/runtime';
import { useAutorun, useMobx, useDeepObserve } from 'common/hooks/useMobx';
import { OnOffSwitch } from './components/OnOffSwitch';
import {
  LightMode,
  MODE_ITEMS,
  Throttler,
  DeviceRepo,
  type LightbulbDto,
} from './constants';
import { deviceRepoLayer } from './repos/DeviceRepo';

interface LightBulbState {
  bulb_mode: LightMode;
  hue: number;
  level: number;
  saturation: number;
  status: State;
  temperature: number;
}

const defaultState: LightBulbState = {
  bulb_mode: LightMode.COLOR,
  hue: 270,
  level: 87,
  saturation: 70,
  status: State.OFF,
  temperature: 100,
};

interface Props extends DefaultProps {
  readonly getStyle: () => React.CSSProperties;
  readonly onChange: (value: Okhsv) => void;
}

const whiteInputs = [
  { key: 'temperature', label: 'temp', props: { max: 100, track: false } },
  { key: 'level', label: 'level' },
] as const;

const colorInputs = [
  { key: 'level', label: 'level', props: { max: 100 } },
  { key: 'saturation', label: 'saturation', props: { max: 100 } },
  { key: 'hue', label: 'hue', props: { max: 360 } },
] as const;

const take = pipe(
  Effect.gen(function* () {
    const queue = yield* Throttler<LightbulbDto>();
    const item = yield* queue.take;
    console.log(item);
    const repo = yield* DeviceRepo;
    yield* repo.update(item);
    yield* Effect.logDebug('Queue take', item);
  })
);

const queue = Effect.gen(function* () {
  const queue = yield* Queue.sliding<LightbulbDto>(1);
  yield* Effect.addFinalizer(() =>
    Effect.gen(function* () {
      yield* Queue.shutdown(queue);
      yield* Effect.logDebug('Queue shutdown');
    })
  );
  return queue;
});

const LightBulbRuntime = createRuntimeProvider(
  pipe(
    Layer.scopedDiscard(pipe(take, Effect.forever, Effect.forkScoped)),
    Layer.provideMerge(Layer.scoped(Throttler<LightbulbDto>(), queue)),
    Layer.provideMerge(deviceRepoLayer)
  )
);

export const LightBulb: React.FC<Props> = runtime(LightBulbRuntime)(
  observer(({ className, getStyle, onChange }) => {
    //
    const runtimeRef = React.useContext(LightBulbRuntime);
    const bulb = useMobx(() => defaultState);
    const inputs =
      bulb.bulb_mode === LightMode.WHITE ? whiteInputs : colorInputs;

    useAutorun(() => {
      const hue = 360 + bulb.hue + 30;
      const hueShift = (20 * Math.sin((bulb.hue / 360) * 2 * Math.PI)) % 360;
      const saturation = 0.4 + (bulb.saturation / 100) * (1 - 0.4);
      const value = 0.6 + (bulb.level / 100) * (1 - 0.6);
      onChange({
        h: hue + hueShift,
        mode: 'okhsv',
        s: saturation,
        v: value,
      });
    });

    useDeepObserve(bulb, (change) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body = { [change.name]: change.newValue } as Partial<LightbulbDto>;
      runtimeRef.current?.runSync(
        Effect.gen(function* () {
          const queue = yield* Throttler<LightbulbDto>();
          yield* queue.offer(body);
        })
      );
    });

    return (
      <Stack
        className={className}
        css={styles.root}
        getStyle={getStyle}
      >
        <form css={styles.form}>
          <OnOffSwitch
            getValue={bulb.lazyGet('status', (value) =>
              value === State.ON ? true : false
            )}
            onChange={bulb.set('status', (value) =>
              value ? State.ON : State.OFF
            )}
          />
          <Select
            getValue={bulb.lazyGet('bulb_mode')}
            items={MODE_ITEMS}
            label='Mode'
            onChange={bulb.set('bulb_mode')}
          />
          {inputs.map((input) => (
            <Stack
              key={input.label}
              css={styles.input}
            >
              <Slider
                aria-label={input.label}
                getValue={bulb.lazyGet(input.key)}
                max={255}
                onChange={bulb.set(input.key)}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error props does not exist
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...(input.props ?? {})}
              />
              <TextField
                getValue={bulb.lazyGet(input.key)}
                onChange={bulb.set(input.key)}
              />
            </Stack>
          ))}
        </form>
      </Stack>
    );
  })
);

const styles = {
  form: css`
    --label: Form;
    display: flex;
    flex-direction: column;
    gap: 1em;
  `,
  input: css`
    --label: SliderInput;
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 1em;
  `,
  root: css`
    --label: LightBulb;
    align-items: center;
    background: var(--background, #fff);
    border-radius: 12px;
    display: block;
    padding: 24px;
  `,
};
