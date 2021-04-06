import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton } from '@material-ui/core';
import { Card, Progress, ReturnButton } from '../../components';
import { useBackend } from '../../contexts';
import { Schedule } from '../../contexts/backend/Schedules';
import { Machine } from '../../contexts/backend/Machines';
import './Scheduling.scss';
import CanvasJSReact from '../../assets/graphs/canvasjs.react.js';
import { RefreshOutlined } from '@material-ui/icons';
import ScheduleRow from './schedule-row/ScheduleRow';
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

  if (machines !== undefined)
    buildDataPoints(machineDataPoints);

  const options = {
    title: {
      text: "Orders Completed per Machine"
    },
    data: [{
      type: "column",
      dataPoints: machineDataPoints
    }]
  }

  const toOrderInfo = (schedule: Schedule) => {
    history.push('/manufacturing/order-info/' + schedule.orderId);
  };

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
        <IconButton
          color="primary"
          onClick={() => window.location.reload(false)}>
          <RefreshOutlined/>
        </IconButton>
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
              <ScheduleRow key={schedule.machineId} props={schedule} />
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
