import { TableCell, TableRow, Chip, Button } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useBackend } from '../../../contexts';
import { Schedule } from '../../../contexts/backend/Schedules';
import './ScheduleRow.scss';

interface Props {
    props: Schedule;
}

export default function ScheduleRow({ props }: Props) {


    const { schedule } = useBackend();
    const history = useHistory();
  
    const freeMachine = (async () => {

        const machineId: number = props.machineId;
        const orderId: number = props.orderId;

        const schedules = await schedule.freeMachine({machineId, orderId});
      });

    // Formatting date objects
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
            return "N/A";
        } else {
            return "#" + props;
        }
    };

    // Formatting Status objects
    const formatstatus = (props: string) => {
        return props.charAt(0).toUpperCase() + props.slice(1);
    };

    const toOrderInfo = () => {
        history.push('/manufacturing/order-info/' + props.orderId);
    };

    return (
        <TableRow
            className="table-row">
            <TableCell>#{props.machineId}</TableCell>
            <TableCell>{displayOrders(props.orderId)}</TableCell>
            <TableCell>{formatDate(props.finishTime)}</TableCell>
            <TableCell>{formatTime(props.finishTime)}</TableCell>
            <TableCell>
                <span className={props.status}>
                    <Chip size="small" label={formatstatus(props.status)} />
                </span>
            </TableCell>
            {props.status == 'busy' && (
                <TableCell>
                    <Button onClick={freeMachine}>Mark as Complete</Button>
                </TableCell>)}
        </TableRow>
    );
}
