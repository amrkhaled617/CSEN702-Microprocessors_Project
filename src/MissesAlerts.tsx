export const MissesAlerts = ({ notes }: { notes: string[] }) => {
  return (
    <div className="card">
      <div className="card-header">Notes</div>
      <div className="card-body">
      <div className="d-flex flex-column gap-1">
        {notes.map((note, index) => (
        <div key={index} className="alert alert-info">
          {note}
        </div>
        ))}
      </div>
      </div>
    </div>
  );
};
