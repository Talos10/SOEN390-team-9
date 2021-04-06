import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Card, Progress, ReturnButton } from '../../components';
import { useBackend, useSnackbar } from '../../contexts';
import { Schedule } from '../../contexts/backend/Schedules';
import './ScheduleMachine.scss';
import { Autocomplete } from '@material-ui/lab';
import { Machine } from '../../contexts/backend/Machines';
import { Orders } from '../../interfaces/Orders';

export default function ScheduleMachine() {

  const history = useHistory();
  const snackbar = useSnackbar();

  const [schedules, setSchedules] = useState<Schedule[]>();
  const { schedule } = useBackend();

  const [selectedMachine, setSelectedMachine] = useState<Machine>();
  const [selectedOrder, setSelectedOrder] = useState<Orders>();

  const [schedulingType, setSchedulingType] = useState<string>('now');

  const [machines, setMachines] = useState<Machine[]>();
  const { machine } = useBackend();

  const [orders, setOrders] = useState<Orders[]>();
  const { manufacturing } = useBackend();


  const getMachines = useCallback(async () => {
    const machines = await machine.getAllMachines();
    setMachines(machines);
  }, [machine]);

  const getOrders = async () => {
    const orders = await manufacturing.getAllOrders();
    setOrders(orders);
  };

  const selectMachine = (_: unknown, value: Machine) => {
    setSelectedMachine(value);
  };

  const selectOrder = (_: unknown, value: Orders) => {
    setSelectedOrder(value);
  };

  const filterMachines = (machines: Machine[]) => {
    var filteredArray: Machine[] = [];

    machines.forEach(machine => {
      if (machine.status == 'free') {
        filteredArray.push(machine);
      }
    });

    return filteredArray;

  };

  const filterOrders = (orders: Orders[]) => {
    var filteredArray: Orders[] = [];

    orders.forEach(order => {
      if (order.status == 'confirmed' && order.orderedGoods) {
        filteredArray.push(order);
      }
    });

    return filteredArray;

  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSchedulingType(event.target.value);
  };

  useEffect(() => {
    getMachines();
  }, [getMachines]);

  useEffect(() => {
    getOrders();
  }, []);

  const addSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const { machineId, orderId, time, date } = parseSchedule(form);

    console.log({ machineId, orderId, time, date });

    const response = await schedule.scheduleMachine({machineId, orderId});

    if (response.status) {
    history.push('/scheduling/schedule-machine');
    snackbar.push(`Machine #${machineId} has been scheduled`);
    }
  };

  const parseSchedule = (form: HTMLFormElement) => {
    const data = new FormData(form);

    var unfilteredMachineID = data.get('machine-name') as string;
    var unfilteredOrderID = data.get('order-number') as string;

    return {
      machineId: (unfilteredMachineID.split("#")[1]) as unknown as number,
      orderId: unfilteredOrderID.split("#")[1] as unknown as number,
      date: data.get('schedule-date') as string,
      time: data.get('schedule-time') as string
    };
  };

  return machines === undefined || orders == undefined ? (
    <Progress />
  ) : (
    <div className="ScheduleMachine">
      <form onSubmit={addSchedule}>
        <div className="schedule_machine__top">
          <div className="top">
            <ReturnButton to="/scheduling" />
            <h1 className="title">Schedule Machines</h1>
          </div>
          <div className="top__right">
            <Button
              color="primary"
              variant="contained"
              type="submit">
              Execute
          </Button>
          </div>
        </div>

        <Card>
          <div className="input-field">
          </div>
          <input
            key=""
            name="existing-customer"
            type="hidden"
            value=""
          />
          <div className="schedule_machine">
            <div>
              <label htmlFor="machine-name">Machine's Name</label>
              <Autocomplete
                onChange={selectMachine}
                disableClearable={true}
                options={filterMachines(machines)}
                getOptionLabel={machine => `Machine #${machine.machineId}`}
                getOptionSelected={(option, value) => option.machineId === value.machineId}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder="Select a machine"
                    variant="outlined"
                    required
                    id="machine-name"
                    name="machine-name"
                    type="text"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="order-number">Order Number</label>
              <Autocomplete
                onChange={selectOrder}
                disableClearable={true}
                options={filterOrders(orders)}
                getOptionLabel={order => (`Order #${order.orderId}`)}
                getOptionSelected={(option, value) => option.orderId === value.orderId}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder="Select an order"
                    variant="outlined"
                    required
                    id="order-number"
                    name="order-number"
                    type="text"
                  />
                )}
              />
            </div>

            <div className="input-field">
              <label htmlFor="order-number">Schedule order for:</label>
              <FormControl component="fieldset">
                <RadioGroup row value={schedulingType} onChange={handleChange}>
                  <FormControlLabel
                    value={'now'}
                    control={<Radio color="primary" />}
                    label="Now"
                  />
                  <FormControlLabel
                    disabled
                    value={'later'}
                    control={<Radio color="primary" />}
                    label="Later"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {schedulingType == "now" ? (
              <div>

              </div>
            ) : (
              <div>
                <div>
                  <label htmlFor="schedule-date">Date</label>
                  <TextField
                    type="date"
                    id="schedule-date"
                    name="schedule-date"
                    variant="outlined"
                    required
                    fullWidth
                  />
                </div>
                <div>
                  <label htmlFor="schedule-time">Time</label>
                  <TextField
                    type="time"
                    id="schedule-time"
                    name="schedule-time"
                    variant="outlined"
                    required
                    fullWidth
                  />
                </div>
              </div>
            )}


          </div>
        </Card>
      </form>
    </div>
  );
}
