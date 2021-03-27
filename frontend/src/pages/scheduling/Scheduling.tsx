import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@material-ui/core';
import { Card, Progress } from '../../components';
import { useBackend } from '../../contexts';
import { Machine } from '../../contexts/backend/Machines';

export default function Scheduling() {

  const [machines, setMachines] = useState<Machine[]>();

  const { machine } = useBackend();
  const history = useHistory();


  const getMachines = useCallback(async () => {
    const machines = await machine.getAllMachines();
    setMachines(machines);
  }, [machine]);

  const formatDate = (dateStr: string) => {
    if (dateStr === null || dateStr === '') {
      return 'N/A';
    } else {
      const date = new Date(dateStr);
      return (
        date.getDate().toString() +
        '/' +
        date.getMonth().toString() +
        '/' +
        date.getFullYear().toString()
      );
    }
  };

  useEffect(() => {
    getMachines();
  }, [getMachines]);

  return machines === undefined ? (
    <Progress />
  ) : (
    <div>
      <Card className="summary">
        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__tr">
              <TableCell width="10%">Machine</TableCell>
              <TableCell width="22%">Order Number</TableCell>
              <TableCell width="22%">Finishing Date</TableCell>
              <TableCell width="22%">Finishing Time</TableCell>
              <TableCell width="24%">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {machines.map(machine => (
              <TableRow
                key={machine.machineId}
                className="table-row">
                <TableCell>#{machine.machineId}</TableCell>
                <TableCell>{machine.numberOrderCompleted}</TableCell>
                <TableCell>{0}</TableCell>
                <TableCell>{0}</TableCell>
                <TableCell>
                  <span className={machine.status}>
                    <Chip size="small" label={machine.status} />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
