import {
  InstructionType,
  LoadBufferSlot,
  ReservationStationSlot,
  StoreBufferSlot,
  initSettings,
  State,
  CacheBlock
} from "./Classes";
function storeValueInMemory(memory: number[], address: number, value: number) {
  memory[address] = value & 0xFF; // Least significant byte
  memory[address + 1] = (value >> 8) & 0xFF;
  memory[address + 2] = (value >> 16) & 0xFF;
  memory[address + 3] = (value >> 24) & 0xFF; // Most significant byte
}
function storeValueInCache(cache: { [blockIndex: number]: CacheBlock }, memory: number[], address: number, blockSize: number) {
  const blockIndex = Math.floor(address / blockSize);
  const blockOffset = address % blockSize;

  // Find the first empty block in the cache
  let emptyBlockIndex = -1;
  for (let i = 0; i < 32; i++) { // Assuming cache size is 32
    if (!cache[i] || !cache[i].valid) {
      emptyBlockIndex = i;
      break;
    }
  }

  if (emptyBlockIndex === -1) {
    throw new Error("Cache is full");
  }

  if (!cache[emptyBlockIndex]) {
    cache[emptyBlockIndex] = {
      valid: false,
      data: new Array(blockSize).fill(0),
      address: address, // Store the memory address of the first byte of the word
    };
  }

  // Load four bytes from memory starting from the given address
  for (let i = 0; i < blockSize; i++) {
    cache[emptyBlockIndex].data[i] = memory[address + i];
  }
  cache[emptyBlockIndex].valid = true;
}
function loadValueFromMemory(memory: number[], address: number): number {
  const blockIndex = Math.floor(address / 4) * 4; // Align to the start of a 4-byte block

  return (
    (memory[blockIndex] & 0xFF) |
    ((memory[blockIndex + 1] & 0xFF) << 8) |
    ((memory[blockIndex + 2] & 0xFF) << 16) |
    ((memory[blockIndex + 3] & 0xFF) << 24)
  );
}

function loadValueFromCache(cache: { [blockIndex: number]: CacheBlock }, address: number, blockSize: number): number | null {
  const blockIndex = Math.floor(address / blockSize);
  const blockOffset = address % blockSize;

  if (cache[blockIndex] && cache[blockIndex].valid && cache[blockIndex].address === address) {
    return (
      (cache[blockIndex].data[blockOffset] & 0xFF) |
      ((cache[blockIndex].data[blockOffset + 1] & 0xFF) << 8) |
      ((cache[blockIndex].data[blockOffset + 2] & 0xFF) << 16) |
      ((cache[blockIndex].data[blockOffset + 3] & 0xFF) << 24)
    );
  }

  return null;
}
export function init(
  initSettings: initSettings
): State {
  const State: State = {
    loadBuffers: [],
    storeBuffers: [],
    nextIssue: 0,
    currentClock: 0,
    adderReservationStations: [],
    mulReservationStations: [],
    instructionHistory: [],
    instructions: initSettings.code.split("\n"),
    latencies: initSettings.latencies,
    memory: new Array(1024).fill(0),
    cache: {},
    fpRegisters: {},
    intRegisters: {},
    notes: [],
  };
  const testBlockIndex = 0; // Example block index
  const testBlockValue = 4;
  
    State.memory[testBlockIndex * 4] = 7;
    State.memory[testBlockIndex * 4+1] = 5;
    State.memory[testBlockIndex * 4+2] = 33;
    State.memory[testBlockIndex * 4+3] = 4;
    State.memory[testBlockIndex * 4+4] = 77;
    State.memory[testBlockIndex * 4+5] = 61;


  for (let i = 0; i < initSettings.numOfAdderReservationStations; i++) {
    State.adderReservationStations.push({
      busy: false,
      op: "",
      vj: 0,
      vk: 0,
      qj: "",
      qk: "",
      timeRemaining: null,
      result: null,
      historyIndex: null,
    });
  }

  for (let i = 0; i < initSettings.numOfMulReservationStations; i++) {
    State.mulReservationStations.push({
      busy: false,
      op: "",
      vj: 0,
      vk: 0,
      qj: "",
      qk: "",
      timeRemaining: null,
      result: null,
      historyIndex: null,
    });
  }

  for (let i = 0; i < initSettings.numOfLoadBuffers; i++) {
    State.loadBuffers.push({
      busy: false,
      address: 0,
      timeRemaining: null,
      result: null,
      historyIndex: null,
    });
  }

  for (let i = 0; i < initSettings.numOfStoreBuffers; i++) {
    State.storeBuffers.push({
      busy: false,
      address: 0,
      v: 0,
      q: "",
      timeRemaining: null,
      historyIndex: null,
    });
  }

  for (let i = 0; i < initSettings.numOfFPRegisters; i++) {
    State.fpRegisters[i] = {
      value: 0,
      q: "",
    };
  }

  for (let i = 0; i < initSettings.numOfIntRegisters; i++) {
    State.intRegisters[i] = {
      value: 0,
      q: "",
    };
  }

  for (const { address, value } of initSettings.cacheInitialValues) {
    const blockIndex = Math.floor(address / 4);
    const blockOffset = address % 4; 
  
    if (!State.cache[blockIndex]) {
      State.cache[blockIndex] = {
        valid: false,
        data: new Array(4).fill(0),
        address:0,
      };
    }
  
    State.cache[blockIndex].data[blockOffset] = value;
    State.cache[blockIndex].valid = true;
  }

  for (const {
    registerName,
    value,
  } of initSettings.fpRegisterFileInitialValues) {
    State.fpRegisters[registerName].value = value;
  }

  for (const {
    registerName,
    value,
  } of initSettings.intRegisterFileInitialValues) {
    State.intRegisters[registerName].value = value;
  }

  return State;
}

export function nextState(State: State): State {
  const newState = structuredClone(State);

  newState.notes = [];
  newState.currentClock++;

  issue(newState);

  execute(newState);

  writeResult(newState);

  console.log(newState);

  return newState;
}

function issue(newState: State) {
  if (newState.nextIssue >= newState.instructions.length) return;
  if (includeBR(newState)) return;

  const instruction = newState.instructions[newState.nextIssue];
  const { instructionType, destination, source1, source2 } =
    parseInstruction(instruction);

  const { reservationStations, prefix } = getReservationStations(
    instructionType,
    newState
  );

  if (reservationStations.every((rs) => rs.busy)) return;

  newState.nextIssue++;

  const index = reservationStations!.findIndex((rs) => !rs.busy);
  const reservationStationName = prefix + (index + 1);
  const rs = reservationStations![index];

  newState.instructionHistory.push({
    instruction,
    issuedAt: newState.currentClock,
    startExecutionAt: null,
    endExecutionAt: null,
    writeResultAt: null,
    stationName: reservationStationName,
  });

  rs.busy = true;
  rs.historyIndex = newState.instructionHistory.length - 1;

  if (instructionType === InstructionType.L_D || instructionType === InstructionType.L_S || instructionType === InstructionType.LD || instructionType === InstructionType.LW) {
    const typedRS = reservationStations![index] as LoadBufferSlot;
    typedRS.address = Number(source1);
  } else if (instructionType == InstructionType.S_D ||instructionType == InstructionType.S_S || instructionType == InstructionType.SD || instructionType == InstructionType.SW) {
    const typedRS = reservationStations![index] as StoreBufferSlot;
    typedRS.address = Number(source1);

    const sourceRegister = getRegister(destination, newState); 
    typedRS.v = sourceRegister.value;
    typedRS.q = sourceRegister.q;
  } else {
    const typedRS = reservationStations![index] as ReservationStationSlot;
    typedRS.op = instructionType;

    if (instructionType === InstructionType.BNEZ || instructionType === InstructionType.BEQ || instructionType === InstructionType.BNE) {
      const source1Register = getRegister(destination, newState);
      typedRS.vj = source1Register.value;
      typedRS.qj = source1Register.q;
    }

    if (source1.startsWith("F") || source1.startsWith("R")) {
      const source1Register = getRegister(source1, newState);
      typedRS.vj = source1Register.value;
      typedRS.qj = source1Register.q;
    } else {
      typedRS.vk = findInstructionhelper(newState, source1);
      typedRS.qk = "";
    }

    if (source2) {
      if (source2.startsWith("F") || source2.startsWith("R")) {
        const source2Register = getRegister(source2, newState);
        typedRS.vk = source2Register.value;
        typedRS.qk = source2Register.q;
      } else {
        typedRS.vk = Number(source2);
        typedRS.qk = "";
      }
    }
  }

  if (
    instructionType != InstructionType.S_D &&
    instructionType != InstructionType.SW &&
    instructionType != InstructionType.SD &&
    instructionType != InstructionType.S_S &&
    instructionType != InstructionType.BNEZ  &&
    instructionType != InstructionType.BEQ &&
    instructionType != InstructionType.BNE
  ) {
    const destinationRegIndex = Number(destination.substring(1));

    if (destination.startsWith("F")) {
      newState.fpRegisters[destinationRegIndex].q = reservationStationName;
    } else if (destination.startsWith("R")) {
      newState.intRegisters[destinationRegIndex].q = reservationStationName;
    } else {
      alert("Bt3ml eh ya 7mar");
    }
  }
}

function getReservationStations(
  instructionType: InstructionType,
  newState: State
) {
  if (
    [
      InstructionType.ADD_D,
      InstructionType.SUB_D,
      InstructionType.ADD_S,
      InstructionType.SUB_S,
      InstructionType.ADD_DI,
      InstructionType.SUB_DI,
      InstructionType.ADDI,
      InstructionType.SUBI,
      InstructionType.BNEZ,
      InstructionType.BEQ,
      InstructionType.BNE,
    ].includes(instructionType)
  ) {
    return {
      reservationStations: newState.adderReservationStations,
      prefix: "A",
    };
  } else if (
    [
      InstructionType.MUL_D,
      InstructionType.MUL_S,
      InstructionType.DIV_D,
      InstructionType.DIV_S,
      InstructionType.MUL_DI,
      InstructionType.DIV_DI,
    ].includes(instructionType)
  ) {
    return {
      reservationStations: newState.mulReservationStations,
      prefix: "M",
    };
  } else if (instructionType === InstructionType.L_D || instructionType === InstructionType.L_S || instructionType === InstructionType.LD || instructionType === InstructionType.LW) {
    return {
      reservationStations: newState.loadBuffers,
      prefix: "L",
    };
  } else if (instructionType === InstructionType.S_D || instructionType === InstructionType.S_S || instructionType === InstructionType.SD || instructionType === InstructionType.SW) {
    return {
      reservationStations: newState.storeBuffers,
      prefix: "S",
    };
  } else {
    throw new Error("Erro ,Unknown instruction type");
  }
}

function execute(newState: State) {
  for (const rs of newState.adderReservationStations.concat(
    newState.mulReservationStations
  )) {
    if (!rs.busy || rs.qj != "" || rs.qk != "") continue;

    const issuedAt = newState.instructionHistory[rs.historyIndex!].issuedAt;
    if (newState.currentClock == issuedAt) continue;

    const latency = newState.latencies[rs.op as InstructionType];

    if (rs.timeRemaining == null) {
      rs.timeRemaining = latency;
      newState.instructionHistory[rs.historyIndex!].startExecutionAt =
        newState.currentClock;
      newState.instructionHistory[rs.historyIndex!].endExecutionAt =
        newState.currentClock + latency - 1;
    } else {
      rs.timeRemaining--;
    }

    if (rs.op === InstructionType.BNEZ || rs.op === InstructionType.BEQ || rs.op === InstructionType.BNE) {
      if (rs.timeRemaining === 1) {
        if (
          (rs.op === InstructionType.BNEZ && rs.vj != 0) ||
          (rs.op === InstructionType.BEQ && rs.vj == rs.vk) ||
          (rs.op === InstructionType.BNE && rs.vj != rs.vk)
        ) {
          newState.nextIssue = rs.vk;
        }
        continue;
      }
    }

    if (rs.timeRemaining === 0) {
      switch (rs.op) {
        case InstructionType.ADD_D:
        case InstructionType.ADD_DI:
        case InstructionType.ADD_S:
          rs.result = rs.vj + rs.vk;
          break;
        case InstructionType.SUB_D:
        case InstructionType.SUB_DI:
        case InstructionType.SUB_S:
          rs.result = rs.vj - rs.vk;
          break;
        case InstructionType.ADDI:
          rs.result = rs.vj + rs.vk;
          break;
        case InstructionType.SUBI:
          rs.result = rs.vj - rs.vk;
          break;
          case InstructionType.BNEZ:
            case InstructionType.BNE:
            case InstructionType.BEQ:
            break;
        case InstructionType.MUL_D:
        case InstructionType.MUL_S:
        case InstructionType.MUL_DI:
          rs.result = rs.vj * rs.vk;
          break;
        case InstructionType.DIV_D:
        case InstructionType.DIV_S:
        case InstructionType.DIV_DI:
          if (rs.vk === 0) {
            alert("rs.vk is 0");
          }
          rs.result = rs.vj / rs.vk;
          break;
        default:
          throw new Error("Error , faulty operation");
      }
    }
  }

  for (const rs of newState.storeBuffers) {
    if (!rs.busy || rs.q != "") continue;
  
    const issuedAt = newState.instructionHistory[rs.historyIndex!].issuedAt;
    if (newState.currentClock == issuedAt) continue;
  
    const instruction = newState.instructionHistory[rs.historyIndex!].instruction;
    const { instructionType } = parseInstruction(instruction);
    let latency: number | null = null;
  
    switch (instructionType) {
      case InstructionType.S_D:
        latency = newState.latencies[InstructionType.S_D];
        break;
      case InstructionType.SD:
        latency = newState.latencies[InstructionType.SD];
        break;
      case InstructionType.S_S:
        latency = newState.latencies[InstructionType.S_S];
        break;
      case InstructionType.SW:
        latency = newState.latencies[InstructionType.SW];
        break;
      default:
        throw new Error("Unknown store instruction type");
    }
  
    if (latency === null) continue; 
  
    if (rs.timeRemaining == null) {
      rs.timeRemaining = latency;
      newState.instructionHistory[rs.historyIndex!].startExecutionAt =
        newState.currentClock;
      newState.instructionHistory[rs.historyIndex!].endExecutionAt =
        newState.currentClock + latency - 1;
    } else {
      rs.timeRemaining--;
    }
  
    if (rs.timeRemaining === 0) {
      const blockIndex = Math.floor(rs.address / 4);
      const blockOffset = rs.address % 4;
      if (!newState.cache[blockIndex]) {
        newState.cache[blockIndex] = {
          valid: false,
          data: new Array(4).fill(0),
          address: rs.address, 
        };
      }
      if (newState.cache[blockIndex].valid) {
        storeValueInCache(newState.cache, newState.memory, rs.address, 4);
      } else {
      
        newState.currentClock+=1;
        for (let i = 0; i < 4; i++) {
          newState.cache[blockIndex].data[i] = newState.memory[blockIndex * 4 + i];
        }
        newState.cache[blockIndex].valid = true;
        newState.cache[blockIndex].address = rs.address; 
        storeValueInCache(newState.cache, newState.memory, rs.address, 4);
      }
      storeValueInMemory(newState.memory, rs.address, rs.v);
    }
  }

  for (const rs of newState.loadBuffers) {
    if (!rs.busy) continue;
  
    const issuedAt = newState.instructionHistory[rs.historyIndex!].issuedAt;
    if (newState.currentClock == issuedAt) continue;
  
    const instruction = newState.instructionHistory[rs.historyIndex!].instruction;
    const { instructionType } = parseInstruction(instruction);
    let latency: number | null = null;
  
    switch (instructionType) {
      case InstructionType.L_D:
        latency = newState.latencies[InstructionType.L_D];
        break;
      case InstructionType.LD:
        latency = newState.latencies[InstructionType.LD];
        break;
      case InstructionType.L_S:
        latency = newState.latencies[InstructionType.L_S];
        break;
      case InstructionType.LW:
        latency = newState.latencies[InstructionType.LW];
        break;
      default:
        throw new Error("Unknown load instruction type");
    }
  
    if (latency === null) continue; 
  
    if (rs.timeRemaining == null) {
      rs.timeRemaining = latency;
      newState.instructionHistory[rs.historyIndex!].startExecutionAt =
        newState.currentClock;
      newState.instructionHistory[rs.historyIndex!].endExecutionAt =
        newState.currentClock + latency - 1;
    } else {
      rs.timeRemaining--;
    }
  
    if (rs.timeRemaining === 0) {
      const blockIndex = Math.floor(rs.address / 4);
      const blockOffset = rs.address % 4;

      // Ensure the cache block is initialized
      if (!newState.cache[blockIndex]) {
        newState.cache[blockIndex] = {
          valid: false,
          data: new Array(4).fill(0),
          address: rs.address, 
        };
      }

     
      const cachedValue = loadValueFromCache(newState.cache, rs.address, 4);
      if (cachedValue !== null) {
        rs.result = cachedValue;
      } else {
        newState.currentClock+=1;
        
        storeValueInCache(newState.cache, newState.memory, rs.address, 4);
        newState.cache[blockIndex].valid = true;
        newState.cache[blockIndex].address = rs.address; 
        rs.result = loadValueFromMemory(newState.memory, rs.address);
        newState.notes.push(`Compulsory miss at address ${rs.address}`);
      }
    }
  }
}

function writeResult(newState: State) {
  for (const rs of newState.storeBuffers) {
    if (rs.busy && rs.timeRemaining === 0) {
      rs.busy = false;
      rs.timeRemaining = null;
      rs.historyIndex = null;
      rs.address = 0;
      rs.v = 0;
      rs.q = "";
    }
  }

  for (const rs of newState.adderReservationStations) {
    if (rs.busy && rs.timeRemaining === 0 && (rs.op === InstructionType.BNEZ || rs.op === InstructionType.BEQ || rs.op === InstructionType.BNE)) {
      rs.busy = false;
      rs.timeRemaining = null;
      rs.historyIndex = null;
      rs.op = "";
      rs.vj = 0;
      rs.vk = 0;
      rs.qj = "";
      rs.qk = "";
      rs.result = null;
      rs.historyIndex = null;
    }
  }

  const maxRS = getMaxStationhelper(
    newState
  ) as ReservationStationSlot & LoadBufferSlot;

  if (!maxRS) return;

  const reservationStationName =
    newState.instructionHistory[maxRS.historyIndex!].stationName;

  for (const rs of newState.adderReservationStations.concat(
    newState.mulReservationStations
  )) {
    if (rs.qj === reservationStationName) {
      rs.qj = "";
      rs.vj = maxRS.result!;
    }

    if (rs.qk === reservationStationName) {
      rs.qk = "";
      rs.vk = maxRS.result!;
    }
  }

  for (const rs of newState.storeBuffers) {
    if (rs.q === reservationStationName) {
      rs.q = "";
      rs.v = maxRS.result!;
    }
  }

  for (const [regName, reg] of Object.entries(newState.fpRegisters)) {
    if (reg.q === reservationStationName) {
      reg.q = "";
      reg.value = maxRS.result!;
    }
  }

  for (const [regName, reg] of Object.entries(newState.intRegisters)) {
    if (reg.q === reservationStationName) {
      reg.q = "";
      reg.value = maxRS.result!;
    }
  }

  newState.instructionHistory[maxRS.historyIndex!].writeResultAt =
    newState.currentClock;

  maxRS.busy = false;
  maxRS.result = null;
  maxRS.historyIndex = null;
  maxRS.timeRemaining = null;

  if (maxRS.op) maxRS.op = "";
  if (maxRS.vj) maxRS.vj = 0;
  if (maxRS.vk) maxRS.vk = 0;
  if (maxRS.qj) maxRS.qj = "";
  if (maxRS.qk) maxRS.qk = "";
  if (maxRS.address) maxRS.address = 0;
  if (maxRS.timeRemaining) maxRS.timeRemaining = null;
  if (maxRS.result) maxRS.result = null;
  if (maxRS.historyIndex) maxRS.historyIndex = null;
}

function parseInstruction(instructionStr: string) {
  const instructionParts = instructionStr.split(" ");

  const offset = instructionParts[0].endsWith(":") ? 1 : 0;

  const instructionType = instructionParts[offset] as InstructionType;

  const destination = instructionParts[offset + 1];
  const source1 = instructionParts[offset + 2];
  const source2 = instructionParts[offset + 3];

  return {
    instructionType,
    destination,
    source1,
    source2,
  };
}

function getRegister(regName: string, newState: State) {
  const regIndex = Number(regName.substring(1));
  let regFile = regName.startsWith("F")
    ? newState.fpRegisters
    : newState.intRegisters;

  return regFile[regIndex];
}

function countdeps(state: State, stationName: string) {
  let count = 0;

  for (const rs of state.adderReservationStations.concat(
    state.mulReservationStations
  )) {
    if (rs.qj === stationName || rs.qk === stationName) count++;
  }

  for (const rs of state.storeBuffers) {
    if (rs.q === stationName) count++;
  }

  for (const [regName, reg] of Object.entries(state.fpRegisters)) {
    if (reg.q === stationName) count++;
  }

  for (const [regName, reg] of Object.entries(state.intRegisters)) {
    if (reg.q === stationName) count++;
  }

  return count;
}

function getMaxStationhelper(state: State) {
  let maxRS;
  let maxCount = 0;

  for (const rs of state.adderReservationStations.concat(
    state.mulReservationStations
  )) {
    if (rs.result == null) continue;

    const reservationStationName =
      state.instructionHistory[rs.historyIndex!].stationName;
    const count = countdeps(state, reservationStationName);

    if (count > maxCount) {
      maxCount = count;
      maxRS = rs;
    }

    if (count == maxCount && maxRS && rs.historyIndex! < maxRS.historyIndex!) {
      maxRS = rs;
    }
  }

  for (const rs of state.loadBuffers) {
    if (rs.result == null) continue;

    const reservationStationName =
      state.instructionHistory[rs.historyIndex!].stationName;
    const count = countdeps(state, reservationStationName);
    if (count > maxCount) {
      maxCount = count;
      maxRS = rs;
    }

    if (count == maxCount && maxRS && rs.historyIndex! < maxRS.historyIndex!) {
      maxRS = rs;
    }
  }

  return maxRS;
}

function includeBR(state: State) {
  for (const rs of state.adderReservationStations) {
    if (
      (rs.op === InstructionType.BNEZ || rs.op === InstructionType.BEQ || rs.op === InstructionType.BNE) &&
      rs.timeRemaining == null
    ) return true;
  }

  return false;
}

function findInstructionhelper(state: State, label: string) {
  for (let i = 0; i < state.instructions.length; i++) {
    if (state.instructions[i].startsWith(label)) return i;
  }

  return -1;
}
