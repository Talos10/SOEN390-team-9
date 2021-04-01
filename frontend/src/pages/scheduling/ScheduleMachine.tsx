import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, TextField } from '@material-ui/core';
import { Card, Progress, ReturnButton } from '../../components';
import { useBackend } from '../../contexts';
import { Schedule } from '../../contexts/backend/Schedules';
import './ScheduleMachine.scss';

export default function ScheduleMachine() {


  return (
    <div className="ScheduleMachine">
      <div className="schedule_machine__top">
        <div className="top">
          <ReturnButton to="/scheduling" />
          <h1 className="title">Schedule Machines</h1>
        </div>
        <div className="top__right">
          <Button
            color="primary"
            variant="contained"
            component={Link}
            to="/home">
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
            <TextField
              id="machine-name"
              name="machine-name"
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div>
            <label htmlFor="order-number">Order Number</label>
            <TextField
              id=""
              name=""
              type=""
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div>
            <label htmlFor="order-number">Date</label>
            <TextField
              id=""
              name=""
              type=""
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div>
            <label htmlFor="order-number">Time</label>
            <TextField
              id=""
              name=""
              type=""
              variant="outlined"
              fullWidth
              required
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
