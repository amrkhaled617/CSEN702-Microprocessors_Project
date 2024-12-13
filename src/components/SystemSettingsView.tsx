// import {
//   button,
//   div ,
//   div,
//   div,
//   input,
//   div,
// } from "@mui/material";
import { useState } from "react";
import { SystemSettings } from "../types";

export function SystemSettingsView({
  onRunClicked,
  systemSettings,
}: {
  onRunClicked: (systemSettings: SystemSettings) => void;
  systemSettings: SystemSettings;
}) {
  const [code, setCode] = useState(systemSettings.code);

  const [numOfAdderReservationStations, setNumOfAdderReservationStations] =
    useState(systemSettings.numOfAdderReservationStations);
  const [numOfMulReservationStations, setNumOfMulReservationStations] =
    useState(systemSettings.numOfLoadBuffers);
  const [numOfLoadBuffers, setNumOfLoadBuffers] = useState(
    systemSettings.numOfLoadBuffers
  );
  const [numOfStoreBuffers, setNumOfStoreBuffers] = useState(
    systemSettings.numOfStoreBuffers
  );

  const [numOfFPRegisters, setNumOfFPRegisters] = useState(
    systemSettings.numOfFPRegisters
  );

  const [numOfIntRegisters, setNumOfIntRegisters] = useState(
    systemSettings.numOfIntRegisters
  );

  const [latencies, setLatencies] = useState(systemSettings.latencies);

  const [fpRegisterFileInitialValues, setFPRegisterFileInitialValues] =
    useState(systemSettings.fpRegisterFileInitialValues);
  const [intRegisterFileInitialValues, setIntRegisterFileInitialValues] =
    useState(systemSettings.intRegisterFileInitialValues);
  const [cacheInitialValues, setCacheInitialValues] = useState(
    systemSettings.cacheInitialValues
  );

  return (
    <div className="container w-100">
      <div>
        <div>
            <label>
            The Assembly Code
            <textarea
            className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="The Assembly Code"
              rows={5}
              cols={10}
            />
            </label>

          <label>
            Number of Adder Reservation Stations
            <input
              type="number"
              value={numOfAdderReservationStations}
              onChange={(e) => setNumOfAdderReservationStations(+e.target.value)}
            />
          </label>

          <label>
            Number of Multipler Reservation Stations
            <input
              type="number"
              value={numOfMulReservationStations}
              onChange={(e) => setNumOfMulReservationStations(+e.target.value)}
            />
          </label>

          <label>
            Number of Load Reservation Stations
            <input
              type="number"
              value={numOfLoadBuffers}
              onChange={(e) => setNumOfLoadBuffers(+e.target.value)}
            />
          </label>

          <label>
            Number of Store Reservation Stations
            <input
              type="number"
              value={numOfStoreBuffers}
              onChange={(e) => setNumOfStoreBuffers(+e.target.value)}
            />
          </label>

          <label>
            Number of FP Registers
            <input
              type="number"
              value={numOfFPRegisters}
              onChange={(e) => setNumOfFPRegisters(+e.target.value)}
            />
          </label>

          <label>
            Number of Int Registers
            <input
              type="number"
              value={numOfIntRegisters}
              onChange={(e) => setNumOfIntRegisters(+e.target.value)}
            />
          </label>

          <h6>Latencies</h6>
          {Object.entries(latencies).map(([instructionType, latency]) => (
            <label key={instructionType}>
              Latency of {instructionType}
              <input
          type="number"
          value={latency}
          onChange={(e) =>
            setLatencies((latencies) => ({
              ...latencies,
              [instructionType]: +e.target.value,
            }))
          }
          disabled={instructionType === "BNEZ" || instructionType === "ADDI"}
              />
            </label>
          ))}

          <div className="d-flex flex-row">
            <h6>FP Register File Initial Values</h6>
            <button
              className="btn btn-primary"
              onClick={() =>
          setFPRegisterFileInitialValues((values) => [
            ...values,
            { registerName: 0, value: 0 },
          ])
              }
            >
              Add
            </button>
          </div>
          {fpRegisterFileInitialValues.map(({ registerName, value }, index) => (
            <div className="d-flex flex-row" key={index}>
              <label>
          Register Name
          <input
            type="number"
            value={registerName}
            onChange={(e) =>
              setFPRegisterFileInitialValues((values) => [
                ...values.slice(0, index),
                {
            registerName: +e.target.value,
            value,
                },
                ...values.slice(index + 1),
              ])
            }
          />
              </label>
              <label>
          Register Value
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setFPRegisterFileInitialValues((values) => [
                ...values.slice(0, index),
                {
            registerName,
            value: +e.target.value,
                },
                ...values.slice(index + 1),
              ])
            }
          />
              </label>
              <button
          className="btn btn-danger"
          onClick={() =>
            setFPRegisterFileInitialValues((values) => [
              ...values.slice(0, index),
              ...values.slice(index + 1),
            ])
          }
          color="error"
              >
          Delete
              </button>
            </div>
          ))}

          <div className="d-flex flex-row ">
            <h6>Int Register File Initial Values</h6>
            <button
              className="btn btn-primary"
              onClick={() =>
          setIntRegisterFileInitialValues((values) => [
            ...values,
            { registerName: 0, value: 0 },
          ])
              }
            >
              Add
            </button>
          </div>
          {intRegisterFileInitialValues.map(({ registerName, value }, index) => (
            <div className="d-flex flex-row" key={index}>
              <label>
          Register Name
          <input
            type="number"
            value={registerName}
            onChange={(e) =>
              setIntRegisterFileInitialValues((values) => [
                ...values.slice(0, index),
                {
            registerName: +e.target.value,
            value,
                },
                ...values.slice(index + 1),
              ])
            }
          />
              </label>
              <label>
          Register Value
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setIntRegisterFileInitialValues((values) => [
                ...values.slice(0, index),
                {
            registerName,
            value: +e.target.value,
                },
                ...values.slice(index + 1),
              ])
            }
          />
              </label>
              <button
          className="btn btn-danger"
          onClick={() =>
            setIntRegisterFileInitialValues((values) => [
              ...values.slice(0, index),
              ...values.slice(index + 1),
            ])
          }
          color="error"
              >
          Delete
              </button>
            </div>
          ))}

          <div className="d-flex flex-row ">
            <h6>Cache Initial Values</h6>
            <button
              className="btn btn-primary"
              onClick={() =>
          setCacheInitialValues((values) => [
            ...values,
            { address: 0, value: 0 },
          ])
              }
            >
              Add
            </button>
          </div>
          {cacheInitialValues.map(({ address, value }, index) => (
            <div className="d-flex flex-row" key={index}>
              <label>
          Address
          <input
            type="number"
            value={address}
            onChange={(e) =>
              setCacheInitialValues((values) => [
                ...values.slice(0, index),
                {
            address: +e.target.value,
            value,
                },
                ...values.slice(index + 1),
              ])
            }
          />
              </label>
              <label>
          Value
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setCacheInitialValues((values) => [
                ...values.slice(0, index),
                {
            address,
            value: +e.target.value,
                },
                ...values.slice(index + 1),
              ])
            }
          />
              </label>
              <button
          className="btn btn-danger"
          onClick={() =>
            setCacheInitialValues((values) => [
              ...values.slice(0, index),
              ...values.slice(index + 1),
            ])
          }
          color="error"
              >
          Delete
              </button>
            </div>
          ))}

          <button
            className="btn btn-success"
            onClick={() =>
              onRunClicked({
          code,
          numOfAdderReservationStations,
          numOfMulReservationStations,
          numOfLoadBuffers,
          numOfStoreBuffers,
          numOfFPRegisters,
          numOfIntRegisters,
          latencies,
          fpRegisterFileInitialValues: fpRegisterFileInitialValues.map(
            ({ registerName, value }) => ({
              registerName: +registerName,
              value: +value,
            })
          ),
          intRegisterFileInitialValues: intRegisterFileInitialValues.map(
            ({ registerName, value }) => ({
              registerName: +registerName,
              value: +value,
            })
          ),
          cacheInitialValues: cacheInitialValues.map(
            ({ address, value }) => ({
              address: +address,
              value: +value,
            })
          ),
              })
            }
          >
            Run
          </button>
        </div>
      </div>
    </div >
  );
}
