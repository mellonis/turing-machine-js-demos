import TuringMachine, {
  Alphabet,
  Tape,
  TapeBlock,
  State,
  movements,
  haltState,
  ifOtherSymbol,
} from '@turing-machine-js/machine';

const alphabet = new Alphabet({
  symbolList: [' ', 'a', 'b', 'c', '*'],
});

function getInitialTape() {
  return new Tape({
    alphabet,
    symbolList: ['a', 'b', 'c', 'b', 'a'],
    viewportWidth: 13,
  });
}

const tapeBlock = new TapeBlock({
  tapeList: [getInitialTape()],
});
const initialState = new State({
  [tapeBlock.symbol(['b'])]: {
    command: [
      {
        symbol: '*',
        movement: movements.right,
      },
    ],
  },
  [tapeBlock.symbol([alphabet.blankSymbol])]: {
    command: [
      {
        movement: movements.left,
      },
    ],
    nextState: haltState,
  },
  [ifOtherSymbol]: {
    command: [
      {
        movement: movements.right,
      },
    ],
  },
});
const machine = new TuringMachine({
  tapeBlock,
});

function resetTape() {
  tapeBlock.replaceTape(getInitialTape());
}

function getMachineSession() {
  return machine.runStepByStep({ initialState });
}

export function getMachine() {
  resetTape();

  return {
    machineSession: getMachineSession(),
    tape: machine.tapeBlock.tapeList[0],
  };
}
