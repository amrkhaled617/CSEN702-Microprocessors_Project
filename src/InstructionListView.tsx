export function InstructionListView({
  instructions,
  currentInstructionIndex,
}: {
  instructions: string[];
  currentInstructionIndex: number;
}) {
  return (
    <div className="card">
      <div className="card-body">
      <ul className="list-group">
        {instructions.map((instruction, index) => (
        <li className="list-group-item p-0" key={index}>
          <button
          className={`list-group-item list-group-item-action ${
            currentInstructionIndex === index ? "active" : ""
          }`}
          >
          {instruction}
          </button>
        </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
