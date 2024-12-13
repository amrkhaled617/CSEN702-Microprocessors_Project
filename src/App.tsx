import { useState } from "react";

import { InstructionType, SystemSettings, SystemState } from "./types";
import { generateSystemState, nextSystemState } from "./simulator";

import { ReservationStationView } from "./components/ReservationStationView";
import { SystemSettingsView } from "./components/SystemSettingsView";
import { StoreBuffersView } from "./components/StoreBuffersView";
import { LoadBuffersView } from "./components/LoadBuffersView";
import { InstructionHistoryView } from "./components/InstructionHistoryView";
import { InstructionListView } from "./components/InstructionListView";
import { NotesView } from "./components/NotesView";
import { CacheView } from "./components/CacheView";
import { RegisterFileView } from "./components/RegisterFileView";
import { MemoryView } from "./components/MemoryView";
function App() {
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    code: "",
    numOfAdderReservationStations: 3,
    numOfMulReservationStations: 2,
    numOfLoadBuffers: 2,
    numOfStoreBuffers: 2,
    numOfFPRegisters: 32,
    numOfIntRegisters: 32,
    latencies: {
      [InstructionType.ADD_S]: 2,
      [InstructionType.SUB_S]: 2,

      [InstructionType.ADD_D]: 2,
      [InstructionType.SUB_D]: 2,
      [InstructionType.MUL_D]: 4,
      [InstructionType.MUL_S]: 4,
      [InstructionType.DIV_D]: 8,
      [InstructionType.DIV_S]: 8,
      [InstructionType.L_D]: 2,
      [InstructionType.L_S]: 2,
      [InstructionType.LD]: 2,
      [InstructionType.LW]: 2,
      [InstructionType.S_D]: 2,
      [InstructionType.SD]: 2,
      [InstructionType.SW]: 2,
      [InstructionType.S_S]: 2,
      [InstructionType.SUBI]: 1,

      [InstructionType.ADDI]: 1,
      [InstructionType.BNEZ]: 1,
      [InstructionType.BEQ]: 1,
      [InstructionType.BNE]: 1,
      [InstructionType.ADD_DI]: 2,
      [InstructionType.SUB_DI]: 2,
      [InstructionType.MUL_DI]: 4,
      [InstructionType.DIV_DI]: 8,
    },

    fpRegisterFileInitialValues: [],
    intRegisterFileInitialValues: [],
    cacheInitialValues: [],
  });
  const [systemState, setSystemState] = useState<SystemState | null>(null);

  const onRunClicked = (systemSettings: SystemSettings) => {
    setSystemSettings(systemSettings);
    setSystemState(generateSystemState(systemSettings));
  };

  const onNextClicked = () => {
    setSystemState((systemState) => nextSystemState(systemState!));
  };

  return (
    <div className="container pt-2">
      {systemState ? (
      <div className="row">
        <div className=" mb-3">
        <div className="card">
          <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">Clock:</h6>
          <h5 className="card-title">{systemState?.currentClock}</h5>
          </div>
          <div className="card-footer">
          <div className="btn-group" role="group">
            <button
            className="btn btn-primary"
            onClick={onNextClicked}
            >
            Next
            </button>
          </div>
          </div>
        </div>
        </div>

        <div className=" mb-3">
        <NotesView notes={systemState.notes} />
        </div>

        <div className=" mb-3">
        <InstructionListView
          instructions={systemState.instructions}
          currentInstructionIndex={systemState.nextIssue}
        />
        </div>

        <div className=" mb-3">
        <InstructionHistoryView
          instructionHistory={systemState.instructionHistory}
        />
        </div>

        <div className=" mb-3">
        <ReservationStationView
          entries={systemState.adderReservationStations}
          title="Adder Reservation Stations"
          namePrefix="A"
        />
        </div>

        <div className=" mb-3">
        <ReservationStationView
          entries={systemState.mulReservationStations}
          title="Multiplier Reservation Stations"
          namePrefix="M"
        />
        </div>
        <div className=" mb-3">
        <LoadBuffersView loadBuffers={systemState.loadBuffers} />
        </div>
        <div className=" mb-3">
        <StoreBuffersView storeBuffers={systemState.storeBuffers} />
        </div>
        <div className=" mb-3">
        <RegisterFileView
          registerFile={systemState.fpRegisters}
          title="FP Register File"
          prefix="F"
        />
        </div>
        <div className=" mb-3">
        <RegisterFileView
          registerFile={systemState.intRegisters}
          title="Int Register File"
          prefix="R"
        />
        </div>
        <div className=" mb-3">
        <CacheView cache={systemState.cache} />
        </div>
        <div className=" mb-3">
        <MemoryView memory={systemState.memory} />
        </div>
      </div>
      ) : (
      <SystemSettingsView
        onRunClicked={onRunClicked}
        systemSettings={systemSettings}
      />
      )}
    </div>
  );
}

export default App;
