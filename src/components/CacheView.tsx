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

import { CacheBlock } from "../types";

export function CacheView({
  cache,
}: {
  cache: {
    [key: number]: CacheBlock;
  };
}) {
  return (
    <Card>
      <CardHeader title="Cache" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Block Index</TableCell>
              <TableCell>Valid</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(cache)
              .sort(([index1], [index2]) =>
                Number(index1) > Number(index2) ? 1 : -1
              )
              .map(([index, block]) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{block.valid ? "Yes" : "No"}</TableCell>
                  <TableCell>{block.address}</TableCell>
                  <TableCell>
                    {block.data.map((value, offset) => (
                      <div key={offset}>
                        Offset {offset}: {value} 
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}