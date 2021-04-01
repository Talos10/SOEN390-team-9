import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@material-ui/core';
import { Card, Progress, ReturnButton } from '../../components';
import { useBackend } from '../../contexts';
import { Schedule } from '../../contexts/backend/Schedules';
import { Machine } from '../../contexts/backend/Machines';
import './Scheduling.scss';
import CanvasJSReact from '../../assets/graphs/canvasjs.react.js';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export interface MachineDataPoints {
  label: string;
  y: number
}

export default function Scheduling() {



  const [schedules, setSchedules] = useState<Schedule[]>();
  const { schedule } = useBackend();

  const [machines, setMachines] = useState<Machine[]>();
  const { machine } = useBackend();

  const history = useHistory();


  const getSchedules = useCallback(async () => {
    const schedules = await schedule.getAllSchedules();
    setSchedules(schedules);
  }, [schedule]);

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

  const displayOrders = (schedule: Schedule) => {
    if (schedule.orderId === null || schedule.orderId === undefined) {
      return "N/A";
    } else {
      return "#" + schedule.orderId;
    }
  };

  const displayDate = (schedule: Schedule) => {
    if (schedule.finishTime === null || schedule.finishTime === undefined) {
      return "N/A";
    } else {
      return schedule.finishTime;
    }
  };

  useEffect(() => {
    getSchedules();
    getMachines();
  }, [getSchedules, getMachines]);

  console.log(machines)



  var machineDataPoints: Array<MachineDataPoints> = [];

  const buildDataPoints = async (machineDataPoints: Array<MachineDataPoints>) => {
    for (var i = 0; i < machines!.length; i++) {
      machineDataPoints[i] = { label: "Machine #" + machines![i].machineId, y: machines![i].numberOrderCompleted }
    }

  };

  if(machines !== undefined)
  buildDataPoints(machineDataPoints);

  const options = {
    title: {
      text: "Orders Completed Today"
    },
    data: [{
      type: "column",
      dataPoints: machineDataPoints
    }]
  }

  return schedules === undefined || machines === undefined ? (
    <Progress />
  ) : (
    <div className="Scheduling">
      <div className="scheduling__top">
        <div className="top">
          <h1 className="title">Scheduling</h1>
        </div>
        <div className="top__right">
          <Button
            color="primary"
            variant="contained"
            component={Link}
            to="/scheduling/schedule-machine">
            Schedule Machine
          </Button>
        </div>
      </div>

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
            {schedules.map(schedule => (
              <TableRow
                key={schedule.machineId}
                className="table-row">
                <TableCell>#{schedule.machineId}</TableCell>
                <TableCell>{displayOrders(schedule)}</TableCell>
                <TableCell>{displayDate(schedule)}</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>
                  <span className={schedule.status}>
                    <Chip size="small" label={schedule.status} />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div>
        <CanvasJSChart options={options}
        />
      </div>


    </div>
  );
}
