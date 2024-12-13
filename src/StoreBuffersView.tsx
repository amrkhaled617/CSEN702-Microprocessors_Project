import { StoreBufferSlot } from "./Classes";

export function StoreBuffersView({
  storeBuffers,
}: {
  storeBuffers: StoreBufferSlot[];
}) {
  return (
    <div className="card">
      
      <div className="card-header">Store Buffers</div>
      <div className="card-body">
      <table className="table">
        <thead>
        <tr>
          <th>Time Remaining</th>
          <th>Busy</th>
          <th>Address</th>
          <th>V</th>
          <th>Q</th>
        </tr>
        </thead>
        <tbody>
        {storeBuffers.map((station, index) => (
          <tr key={index}>
          <td>{station.timeRemaining}</td>
          <td>{station.busy ? "Yes" : "No"}</td>
          <td>{station.address}</td>
          <td>{station.v}</td>
          <td>{station.q}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
    </div>
    
  );
}
