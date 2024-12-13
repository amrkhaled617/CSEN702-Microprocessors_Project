import React from "react";

type MemoryViewProps = {
  memory: number[];
};

export const MemoryView: React.FC<MemoryViewProps> = ({ memory }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">Memory</h6>
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {memory.map((value, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};