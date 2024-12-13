import { LoadBufferEntry } from "../types";

export function LoadBuffersView({
  loadBuffers,
}: {
  loadBuffers: LoadBufferEntry[];
}) {
  return (
    <div className="card">
      <div className="card-header">Load Buffers</div>
      <div className="card-body">
      <table className="table">
        <thead>
        <tr>
          <th>Time Remaining</th>
          <th>Name</th>
          <th>Busy</th>
          <th>Address</th>
        </tr>
        </thead>
        <tbody>
        {loadBuffers.map((loadBuffer, index) => (
          <tr key={index}>
          <td>{loadBuffer.timeRemaining}</td>
          <td>{"L" + (index + 1)}</td>
          <td>{loadBuffer.busy ? "Yes" : "No"}</td>
          <td>{loadBuffer.address}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
