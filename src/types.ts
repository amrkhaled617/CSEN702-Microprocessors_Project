export type ReservationStationEntry = {
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

export type InstructionHistoryEntry = {
  instruction: string;
  issuedAt: number | null;
  startExecutionAt: number | null;
  endExecutionAt: number | null;
  writeResultAt: number | null;
  stationName: string;
};

export type LoadBufferEntry = {
  busy: boolean;
  address: number;
  timeRemaining: number | null;
  result: number | null;
  historyIndex: number | null;
};

export type StoreBufferEntry = {
  busy: boolean;
  address: number;
  v: number;
  q: string;
  timeRemaining: number | null;
  historyIndex: number | null;
};

export type RegisterFileEntry = {
  value: number;
  q: string;
};

export type SystemSettings = {
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
  
  L_D = "LD",
  S_D = "SD",

   // Integer loads/stores
   LW = "LW", // Load Word (integer)
   SW = "SW", // Store Word (integer)
   
   // Floating-point loads/stores
   LWF = "L.W", // Load Word (float)
   SWF = "S.W", // Store Word (float)

  L_DF = "L.D",
  S_DF = "S.D",

  
  L_DS = "L.S",
  S_DS = "S.S",

  ADDI = "ADDI",
  SUBI = "SUBI",
  BNE = "BNE",
  BEQ="BEQ",
  BNEZ = "BNEZ",
}

export type SystemState = {
  adderReservationStations: ReservationStationEntry[];
  mulReservationStations: ReservationStationEntry[];
  loadBuffers: LoadBufferEntry[];
  storeBuffers: StoreBufferEntry[];
  nextIssue: number;
  currentClock: number;
  instructionHistory: InstructionHistoryEntry[];
  instructions: string[];
  cache: {
    [key: number]: number;
  };
  fpRegisters: {
    [key: number]: RegisterFileEntry;
  };
  intRegisters: {
    [key: number]: RegisterFileEntry;
  };
  latencies: {
    [key in InstructionType]: number;
  };
  notes: string[];
};
