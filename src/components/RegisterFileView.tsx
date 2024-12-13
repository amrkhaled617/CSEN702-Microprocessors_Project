import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { RegisterFileEntry } from "../types";

export function RegisterFileView({
  registerFile,
  title,
  prefix,
}: {
  registerFile: {
    [key: number]: RegisterFileEntry;
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
          <th>Register Name</th>
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
