import { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@material-ui/core';
import { Card, Progress } from '../../components';
import { useBackend, useSnackbar } from '../../contexts';
import { Schedule } from '../../contexts/backend/Schedules';
import { Machine } from '../../contexts/backend/Machines';
import './Scheduling.scss';
import CanvasJSReact from '../../assets/graphs/canvasjs.react.js';
import { RefreshOutlined } from '@material-ui/icons';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export interface MachineDataPoints {
  label: string;
  y: number;
}

export default function Scheduling() {
  const [schedules, setSchedules] = useState<Schedule[]>();
  const [machines, setMachines] = useState<Machine[]>();
  const { schedule, machine } = useBackend();
  const snackbar = useSnackbar();
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

  const freeMachine = async (machineId: number, orderId: number) => {
    const response = await schedule.freeMachine({ machineId, orderId });
    if (response.status) snackbar.push(`Successfully finished order ${orderId}`);
    else snackbar.push(response.message);
    getMachines();
    getSchedules();
  };

  // Formatting date objects
  const formatDate = (dateStr: string) => {
    if (dateStr === null || dateStr === '') {
      return 'N/A';
    } else {
      const date = new Date(dateStr);
      return (
        (date.getMonth() + 1).toString() +
        '/' +
        date.getDate().toString() +
        '/' +
        date.getFullYear().toString()
      );
    }
  };

  // Formatting time objects
  const formatTime = (dateStr: string) => {
    if (dateStr === null || dateStr === '') {
      return 'N/A';
    } else {
      const date = new Date(dateStr);
      return (
        date.getHours().toString() +
        ':' +
        date.getMinutes().toString() +
        ':' +
        date.getSeconds().toString()
      );
    }
  };

  // Formatting order objects
  const displayOrders = (props: number) => {
    if (props === null || props === undefined) {
      return 'N/A';
    } else {
      return '#' + props;
    }
  };

  // Formatting Status objects
  const formatstatus = (props: string) => {
    return props.charAt(0).toUpperCase() + props.slice(1);
  };

  var machineDataPoints: Array<MachineDataPoints> = [];

  const buildDataPoints = async (machineDataPoints: Array<MachineDataPoints>) => {
    for (var i = 0; i < machines!.length; i++) {
      machineDataPoints[i] = {
        label: 'Machine #' + machines![i].machineId,
        y: machines![i].numberOrderCompleted
      };
    }
  };

  if (machines !== undefined) buildDataPoints(machineDataPoints);

  const options = {
    title: {
      text: 'Orders Completed per Machine'
    },
    data: [
      {
        type: 'column',
        dataPoints: machineDataPoints
      }
    ]
  };

  const toManufacturingOrderInfo = (orderId: number) => {
    if (orderId) history.push('/manufacturing/order-info/' + orderId);
  };

  return schedules === undefined || machines === undefined ? (
    <Progress />
  ) : (
    <div className="Scheduling">
      <div className="scheduling__top">
        <h1 className="title">Scheduling</h1>

        <div className="scheduling__top__buttons">
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
          onClick={() => {
            getMachines();
            getSchedules();
          }}>
          <RefreshOutlined />
        </IconButton>
        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__tr">
              <TableCell width="10%">Machine</TableCell>
              <TableCell width="20%">Order Number</TableCell>
              <TableCell width="20%">Finishing Date</TableCell>
              <TableCell width="20%">Finishing Time</TableCell>
              <TableCell width="5%">Status</TableCell>
              <TableCell width="5%"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map(schedule => (
              <TableRow key={schedule.machineId} className="table-row">
                <TableCell onClick={() => toManufacturingOrderInfo(schedule.orderId)}>
                  #{schedule.machineId}{' '}
                </TableCell>
                <TableCell onClick={() => toManufacturingOrderInfo(schedule.orderId)}>
                  {displayOrders(schedule.orderId)}
                </TableCell>
                <TableCell onClick={() => toManufacturingOrderInfo(schedule.orderId)}>
                  {formatDate(schedule.finishTime)}
                </TableCell>
                <TableCell onClick={() => toManufacturingOrderInfo(schedule.orderId)}>
                  {formatTime(schedule.finishTime)}
                </TableCell>
                <TableCell onClick={() => toManufacturingOrderInfo(schedule.orderId)}>
                  <span className={schedule.status}>
                    <Chip size="small" label={formatstatus(schedule.status)} />
                  </span>
                </TableCell>
                <TableCell>
                  {schedule.status === 'busy' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => freeMachine(schedule.machineId, schedule.orderId)}>
                      Mark as Complete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div>
        <CanvasJSChart options={options} />
      </div>
    </div>
  );
}
