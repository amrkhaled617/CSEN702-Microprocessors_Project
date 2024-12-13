export type ReservationStationSlot = {
  busy: boolean;
  op: string;
  vj: number;
  vk: number;
  qj: string;
  qk: string;
  timeRemaining: number | null;
  result: number | null;
  historyIndex: number | null;
};

export type InstructionHistorySlot = {
  instruction: string;
  issuedAt: number | null;
  startExecutionAt: number | null;
  endExecutionAt: number | null;
  writeResultAt: number | null;
  stationName: string;
};

export type LoadBufferSlot = {
  busy: boolean;
  address: number;
  timeRemaining: number | null;
  result: number | null;
  historyIndex: number | null;
};

export type StoreBufferSlot = {
  busy: boolean;
  address: number;
  v: number;
  q: string;
  timeRemaining: number | null;
  historyIndex: number | null;
};

export type RegisterFileSlot = {
  value: number;
  q: string;
};

export type initSettings = {
  numOfAdderReservationStations: number;
  numOfMulReservationStations: number;
  numOfLoadBuffers: number;
  numOfStoreBuffers: number;
  numOfFPRegisters: number;
  numOfIntRegisters: number;
  latencies: {
    [key in InstructionType]: number;
  };
  code: string;
  cacheInitialValues: Array<{
    address: number;
    value: number;
  }>;
  fpRegisterFileInitialValues: Array<{
    registerName: number;
    value: number;
  }>;
  intRegisterFileInitialValues: Array<{
    registerName: number;
    value: number;
  }>;
};

export enum InstructionType {
  ADD_D = "ADD.D",
  SUB_D = "SUB.D",
  MUL_D = "MUL.D",
  MUL_S = "MUL.S",
  DIV_D = "DIV.D",
  DIV_S = "DIV.S",

  ADD_S = "ADD.S",
  SUB_S = "SUB.S",
  
  ADD_DI = "ADD.DI",
  SUB_DI = "SUB.DI",
  MUL_DI = "MUL.DI",
  DIV_DI = "DIV.DI",
  
  L_D = "L.D",
  LD = "LD",
  LW = "LW",
  L_S = "L.S",
  S_D = "S.D",
  SD = "SD",
  SW = "SW",
  S_S = "S.S",

  ADDI = "ADDI",
  SUBI = "SUBI",
  BNE = "BNE",
  BEQ="BEQ",
  BNEZ = "BNEZ",
}

export type State = {
  adderReservationStations: ReservationStationSlot[];
  mulReservationStations: ReservationStationSlot[];
  loadBuffers: LoadBufferSlot[];
  storeBuffers: StoreBufferSlot[];
  nextIssue: number;
  currentClock: number;
  instructionHistory: InstructionHistorySlot[];
  instructions: string[];
  memory: number[];
  cache: {
    [blockIndex: number]: CacheBlock;
  };
  fpRegisters: {
    [key: number]: RegisterFileSlot;
  };
  intRegisters: {
    [key: number]: RegisterFileSlot;
  };
  latencies: {
    [key in InstructionType]: number;
  };
  notes: string[];
};
export type CacheBlock = {
  valid: boolean;
  data: number[];
  address: number; // Memory address of the first byte of the word
};