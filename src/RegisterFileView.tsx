import { RegisterFileSlot } from "./Classes";

export function RegisterFileView({
  registerFile,
  title,
  prefix,
}: {
  registerFile: {
    [key: number]: RegisterFileSlot;
  };
  title: string;
  prefix: string;
}) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-body">
      <table className="table">
        <thead>
        <tr>
          <th>Reg</th>
          <th>Value</th>
          <th>Q</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(registerFile).map(
          ([registerName, { value, q }]) => (
          <tr key={registerName}>
            <td>
            {prefix}
            {registerName}
            </td>
            <td>{value}</td>
            <td>{q}</td>
          </tr>
          )
        )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
