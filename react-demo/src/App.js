import React, { useReducer } from 'react';
import cs from 'classnames';
import { getMachine } from './machine';

import './styles.scss';

const AppLevelMachineStates = Object.freeze({
  initial: 'initial',
  running: 'running',
  halted: 'halted',
});
const ReducerActions = Object.freeze({
  init: 'init',
  next: 'next',
});
const reducer = (state, { action }) => {
  switch (action) {
    case ReducerActions.init: {
      const { machineSession, tape } = getMachine();

      return {
        appLevelMachineState: AppLevelMachineStates.running,
        machineSession,
        machineTapeViewport: tape.viewport,
        tape,
      };
    }
    case ReducerActions.next: {
      const { machineSession, tape } = state;
      const { done: isMachineHalted } = machineSession.next();

      return {
        ...state,
        appLevelMachineState: isMachineHalted
          ? AppLevelMachineStates.halted
          : AppLevelMachineStates.running,
        machineTapeViewport: tape.viewport,
      };
    }
    default:
      throw new Error('Unknown action');
  }
};

const appClassname = 'app';

export default function App() {
  const [
    { appLevelMachineState, machineTapeViewport },
    dispatchAction,
  ] = useReducer(reducer, {
    appLevelMachineState: AppLevelMachineStates.initial,
    machineTapeViewport: null,
  });

  return (
    <div
      className={cs(appClassname, `${appClassname}_${appLevelMachineState}`)}
    >
      {appLevelMachineState !== AppLevelMachineStates.initial ? (
        <div className={`${appClassname}__tape-wrapper`}>
          <div className={`${appClassname}__tape`}>
            {machineTapeViewport.map((symbol, ix) => (
              <span
                key={`${symbol}:${ix}`}
                className={`${appClassname}__tape-cell`}
              >
                {symbol}
              </span>
            ))}
          </div>
          <div className={`${appClassname}__tape-head`}>^</div>
        </div>
      ) : null}
      <div className={`${appClassname}__controls`}>
        {appLevelMachineState === AppLevelMachineStates.initial ? (
          <button
            className={`${appClassname}__control`}
            onClick={() => dispatchAction({ action: ReducerActions.init })}
            type={'button'}
          >
            <span role="img" aria-label="Run">
              ▶️
            </span>
          </button>
        ) : null}
        {appLevelMachineState !== AppLevelMachineStates.initial ? (
          <>
            <button
              className={`${appClassname}__control`}
              disabled={appLevelMachineState !== AppLevelMachineStates.running}
              onClick={() => dispatchAction({ action: ReducerActions.next })}
              type={'button'}
            >
              <span role="img" aria-label="Next step">
                ⏯
              </span>
            </button>
            <button
              className={`${appClassname}__control`}
              onClick={() => dispatchAction({ action: ReducerActions.init })}
              type={'button'}
            >
              <span role="img" aria-label="Reset">
                🔄
              </span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
