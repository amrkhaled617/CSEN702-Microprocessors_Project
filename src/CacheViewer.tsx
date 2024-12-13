import { CacheBlock } from "./Classes";

export function CacheViewer({
  cache,
}: {
  cache: {
    [key: number]: CacheBlock;
  };
}) {
  return (
    <div className="card">
      <div className="card-header">Cache</div>
      <div className="card-body">
      <table className="table">
        <thead>
        <tr>
          <th>Block Index</th>
          <th>Valid</th>
          <th>Address</th>
          <th>Data</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(cache)
          .sort(([index1], [index2]) =>
          Number(index1) > Number(index2) ? 1 : -1
          )
          .map(([index, block]) => (
          <tr key={index}>
            <td>{index}</td>
            <td>{block.valid ? "Yes" : "No"}</td>
            <td>{block.address}</td>
            <td>
            {block.data.map((value, offset) => (
              <div key={offset}>
              Offset {offset}: {value}
              </div>
            ))}
            </td>
          </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}