import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import { Card, Progress, ReturnButton } from '../../components';
import { useBackend, useSnackbar } from '../../contexts';
import './ScheduleMachine.scss';
import { Autocomplete } from '@material-ui/lab';
import { Machine } from '../../contexts/backend/Machines';
import { Orders } from '../../interfaces/Orders';

export default function ScheduleMachine() {
  const history = useHistory();
  const snackbar = useSnackbar();

  const [schedulingType, setSchedulingType] = useState<string>('now');
  const [machines, setMachines] = useState<Machine[]>();
  const [orders, setOrders] = useState<Orders[]>();

  const { schedule, machine, manufacturing } = useBackend();

  const getMachines = useCallback(async () => {
    const machines = await machine.getAllMachines();
    setMachines(machines);
  }, [machine]);

  const getOrders = useCallback(async () => {
    const orders = await manufacturing.getAllOrders();
    setOrders(orders);
  }, [manufacturing]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSchedulingType(event.target.value);
  };

  useEffect(() => {
    getMachines();
    getOrders();
  }, [getMachines, getOrders]);

  const addSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const { machineId, orderId } = parseSchedule(form);

    const response = await schedule.scheduleMachine({ machineId, orderId });

    if (response.status) {
      history.push('/scheduling');
      snackbar.push(`Machine #${machineId} has been scheduled.`);
    } else {
      snackbar.push('Missing components before starting that order.');
    }
  };

  const parseSchedule = (form: HTMLFormElement) => {
    const data = new FormData(form);

    var unfilteredMachineID = data.get('machine-name') as string;
    var unfilteredOrderID = data.get('order-number') as string;

    return {
      machineId: (unfilteredMachineID.split('#')[1] as unknown) as number,
      orderId: (unfilteredOrderID.split('#')[1] as unknown) as number,
      date: data.get('schedule-date') as string,
      time: data.get('schedule-time') as string
    };
  };

  return machines === undefined || orders === undefined ? (
    <Progress />
  ) : (
    <div className="ScheduleMachine">
      <form onSubmit={addSchedule}>
        <div className="schedule__machine__top">
          <div className="top">
            <ReturnButton to="/scheduling" />
            <h1 className="title">Schedule Machine</h1>
          </div>
          <Button color="primary" variant="contained" type="submit">
            Execute
          </Button>
        </div>

        <Card>
          <div className="schedule_machine">
            <div className="machine">
              <label htmlFor="machine-name">Machine's Name</label>
              <Autocomplete
                disableClearable={true}
                options={machines.filter(machine => machine.status === 'free')}
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
            <div className="machine">
              <label htmlFor="order-number">Order Number</label>
              <Autocomplete
                disableClearable={true}
                options={orders.filter(order => order.status === 'confirmed' && order.orderedGoods)}
                getOptionLabel={order => `Order #${order.orderId}`}
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

            <div className="machine">
              <label htmlFor="order-number">Schedule order for:</label>
              <FormControl component="fieldset">
                <RadioGroup row value={schedulingType} onChange={handleChange}>
                  <FormControlLabel value={'now'} control={<Radio color="primary" />} label="Now" />
                  <FormControlLabel
                    disabled
                    value={'later'}
                    control={<Radio color="primary" />}
                    label="Later"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {schedulingType === 'now' ? (
              <div></div>
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
