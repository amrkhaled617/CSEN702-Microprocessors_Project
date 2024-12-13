import { InstructionHistorySlot } from "./Classes";

export function InstructionHistoryView({
  instructionHistory,
}: {
  instructionHistory: InstructionHistorySlot[];
}) {
  return (
<div className="card">
  <div className="card-body">
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">Instruction</th>
          <th scope="col">Issue</th>
          <th scope="col">Start Execution</th>
          <th scope="col">End Execution</th>
          <th scope="col">Write Result</th>
        </tr>
      </thead>
      <tbody>
        {instructionHistory.map((instructionStatus, index) => (
          <tr key={index}>
            <td>{instructionStatus.instruction}</td>
            <td>{instructionStatus.issuedAt}</td>
            <td>{instructionStatus.startExecutionAt}</td>
            <td>{instructionStatus.endExecutionAt}</td>
            <td>{instructionStatus.writeResultAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}
