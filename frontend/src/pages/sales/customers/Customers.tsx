import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, TextField, InputBase } from '@material-ui/core';
import { Card, Progress, ReturnButton } from '../../../components';
import { useBackend } from '../../../contexts';
import { Customer, CustomerResponse } from '../../../contexts/backend/Customers';
import './Customers.scss';
import { Search } from '@material-ui/icons';

export default function Customers() {

    interface TableState {
        allOpen: boolean;
        search: string;
      }

    const [customers, setCustomers] = useState<CustomerResponse[]>();
    const [table, setTable] = useState<TableState>({
        allOpen: false,
        search: ''
      });

    const { customer } = useBackend();
    const history = useHistory();

    const getCustomers = useCallback(async () => {
        const customers = await customer.getAllCustomers();
        setCustomers(customers);
    }, [customer]);

    const applySearch = (customer: CustomerResponse) => {
        if (customer.name.toLowerCase().includes(table.search.toLowerCase()))
          return true;
        return false;
      };

    useEffect(() => {
        getCustomers();
    }, [getCustomers]);

    return customers === undefined ? (
        <Progress />
    ) : (
        <div className="Customers">
            <div className="customers__top">
                <div className="top">
                    <ReturnButton to="/sales" />
                    <h1 className="title">Customers</h1>
                </div>
                <div className="top__right">
                    <Button color="primary" variant="contained" component={Link} to="/sales/customers">
                        New Customer
                        </Button>
                </div>
            </div>

            <Card className="summary">
                <div className="table__search">
                    <InputBase
                        className="search"
                        placeholder={'Search'}
                        startAdornment={<Search />}
                        onChange={e => setTable({ ...table, search: e.target.value })}
                    /></div>

                <Table size="small" className="table">
                    <TableHead>
                        <TableRow className="table__tr">
                            <TableCell width="50%">Name</TableCell>
                            <TableCell width="50%">Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map(customer => applySearch(customer) && (
                            <TableRow
                                key={customer.customerId}
                                className="table-row"
                            //onClick={() => toOrderInfo(order.orderId)}
                            >
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
