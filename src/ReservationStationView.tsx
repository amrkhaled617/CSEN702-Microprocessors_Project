import { ReservationStationSlot } from "./Classes";

export function ReservationStationView({
  entries, title, namePrefix
}: {
  entries: ReservationStationSlot[];
  title: string;
  namePrefix: string;
}) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-body">
      <table className="table">
        <thead>
        <tr>
          <th>Time Remaining</th>
          <th>Name</th>
          <th>Busy</th>
          <th>Op</th>
          <th>Vj</th>
          <th>Vk</th>
          <th>Qj</th>
          <th>Qk</th>
        </tr>
        </thead>
        <tbody>
        {entries.map((station, index) => (
          <tr key={index}>
          <td>{station.timeRemaining}</td>
          <td>{namePrefix + (index + 1)}</td>
          <td>{station.busy ? "Yes" : "No"}</td>
          <td>{station.op}</td>
          <td>{station.vj}</td>
          <td>{station.vk}</td>
          <td>{station.qj}</td>
          <td>{station.qk}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
