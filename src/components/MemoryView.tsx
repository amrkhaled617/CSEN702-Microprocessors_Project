import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

type MemoryViewProps = {
  memory: number[];
};

export const MemoryView: React.FC<MemoryViewProps> = ({ memory }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Memory</Typography>
        <pre>{JSON.stringify(memory, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};