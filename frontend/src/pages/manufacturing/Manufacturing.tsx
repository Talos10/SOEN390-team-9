import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Select,
    MenuItem,
    InputBase,
    InputLabel,
    Checkbox
  } from '@material-ui/core';
import { Container, Card } from '../../components';
import './Manufacturing.scss';


export default function Manufacturing(){
    return(
        <Container title="Manufacturing" className="Manufacturing">
            <div className="manufacturing_top">
                <h1 className="title">Manufacturing</h1>
                <div className='manufacturing_top_buttons'>
                    <Button>NEW PRODUCTION</Button>
                </div>
            </div>
            <Card>
                <Table size="small" className="table">
                    <TableHead>
                        <TableRow className="table__tr">
                            <TableCell width="10%"><Checkbox/></TableCell>
                            <TableCell width="15%">Order</TableCell>
                            <TableCell width="15%">Creation Date</TableCell>
                            <TableCell width="15%">Product</TableCell>
                            <TableCell width="15%">Due Date</TableCell>
                            <TableCell width="15%">Quantity</TableCell>
                            <TableCell width="15%">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {}
                    </TableBody>
                </Table>
            </Card>
        </Container>
    );
}