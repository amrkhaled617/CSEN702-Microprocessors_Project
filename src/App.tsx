import { useState } from "react";

import { InstructionType, initSettings, State } from "./Classes";
import { init, nextState } from "./codeRunner";

import { ReservationStationView } from "./ReservationStationView";
import { RunningSystemView } from "./RunningSystemView";
import { StoreBuffersView } from "./StoreBuffersView";
import { LoadBuffersView } from "./LoadBuffersView";
import { InstructionHistoryView } from "./InstructionHistoryView";
import { InstructionListView } from "./InstructionListView";
import { MissesAlerts } from "./MissesAlerts";
import { CacheViewer } from "./CacheViewer";
import { RegisterFileView } from "./RegisterFileView";
import { MemoryView } from "./MemoryView";
function App() {
  const [initSettings, setSystemSettings] = useState<initSettings>({
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
  const [State, setSystemState] = useState<State | null>(null);

  const onRunClicked = (initSettings: initSettings) => {
    setSystemSettings(initSettings);
    setSystemState(init(initSettings));
  };

  const onNextClicked = () => {
    setSystemState((State) => nextState(State!));
  };

  return (
    <div className="container pt-2">
      {State ? (
      <div className="row">
        <div className=" mb-3">
        <div className="card">
          <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">Clock:</h6>
          <h5 className="card-title">{State?.currentClock}</h5>
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
        <MissesAlerts notes={State.notes} />
        </div>

        <div className=" mb-3">
        <InstructionListView
          instructions={State.instructions}
          currentInstructionIndex={State.nextIssue}
        />
        </div>

        <div className=" mb-3">
        <InstructionHistoryView
          instructionHistory={State.instructionHistory}
        />
        </div>

        <div className=" mb-3">
        <ReservationStationView
          entries={State.adderReservationStations}
          title="Adder Reservation Stations"
          namePrefix="A"
        />
        </div>

        <div className=" mb-3">
        <ReservationStationView
          entries={State.mulReservationStations}
          title="Multiplier Reservation Stations"
          namePrefix="M"
        />
        </div>
        <div className=" mb-3">
        <LoadBuffersView loadBuffers={State.loadBuffers} />
        </div>
        <div className=" mb-3">
        <StoreBuffersView storeBuffers={State.storeBuffers} />
        </div>
        <div className=" mb-3">
        <RegisterFileView
          registerFile={State.fpRegisters}
          title="FP Register File"
          prefix="F"
        />
        </div>
        <div className=" mb-3">
        <RegisterFileView
          registerFile={State.intRegisters}
          title="Int Register File"
          prefix="R"
        />
        </div>
        <div className=" mb-3">
        <CacheViewer cache={State.cache} />
        </div>
        <div className=" mb-3">
        <MemoryView memory={State.memory} />
        </div>
      </div>
      ) : (
      <RunningSystemView
        onRunClicked={onRunClicked}
        initSettings={initSettings}
      />
      )}
    </div>
  );
}

export default App;
