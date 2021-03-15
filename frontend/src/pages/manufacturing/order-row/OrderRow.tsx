import {
    TableCell,
    TableHead,
    TableRow,
    Checkbox
} from '@material-ui/core';
import { Orders } from '../../../interfaces/Orders';
import './OrderRow.scss';

interface Props{
    props: Orders;
}

export default function OrderRow({props}:Props){
    // Formatting date objects
    const formatdate = (props: string) => {
        if (props === null || props === ""){
            return "N/A";
        }
        else{
            const date = new Date(props);
            return date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString();
        }
    }

    // Formatting Status objects
    const formatstatus = (props: string) => {
        return props.charAt(0).toUpperCase() + props.slice(1);
    }

    return (
        <TableRow className="table-row">
            <TableCell><Checkbox color="primary"/></TableCell>
            <TableCell>#{props.orderId}</TableCell>
            <TableCell>{formatdate(props.creationDate)}</TableCell>
            <TableCell>Bike</TableCell>
            <TableCell>{formatdate(props.estimatedEndDate)}</TableCell>
            <TableCell>{props.orderedGoods.length}</TableCell>
            <TableCell>{formatstatus(props.status)}</TableCell>
        </TableRow>
    )
}