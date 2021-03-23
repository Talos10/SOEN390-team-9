import React, { useCallback, useEffect, useState } from 'react';
import { ReturnButton, Card, Progress } from '../../../components';
import { Item } from '../../../interfaces/Items';
import { Button, TextField, InputAdornment, InputBase, IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';

import './CreateOrder.scss';
import { useBackend, useSnackbar } from '../../../contexts';
import { useHistory } from 'react-router';
import Customer from './Customer';

interface Good {
  compositeId: number;
  quantity: number;
  name: string;
  price: number;
}

export default function CreateOrder() {
  const [goods, setGoods] = useState<Item[]>([]);
  const [order, setOrder] = useState<Good[]>([]);
  const [selectedGood, setSelectedGood] = useState<Good>();

  const { sales, inventory, customer } = useBackend();
  const snackbar = useSnackbar();
  const history = useHistory();

  const getFinishedGoods = useCallback(async () => {
    const goods = await inventory.getFinishedGoods();
    setGoods(goods);
  }, [inventory]);

  useEffect(() => {
    getFinishedGoods();
  }, [getFinishedGoods]);

  const addGoodToOrder = () => {
    if (selectedGood !== undefined && selectedGood.compositeId !== 0)
      setOrder([...order, selectedGood]);
    setSelectedGood(undefined);
  };

  const removeGoodFromOrder = (id: number) => {
    setOrder([...order.filter(good => good.compositeId !== id)]);
  };

  const selectGood = (_: unknown, value: Item) => {
    setSelectedGood({
      compositeId: value.id,
      quantity: selectedGood?.quantity || 1,
      name: value.name,
      price: value.price
    });
  };

  const selectQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const quantity = Number(input.value);
    setSelectedGood({
      compositeId: selectedGood?.compositeId || 0,
      quantity: quantity,
      name: selectedGood?.name || 'error item',
      price: selectedGood?.price || 0
    });
  };

  const changeQuantity = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const input = e.target;
    const quantity = Number(input.value);

    setOrder(
      order.map(good => {
        if (good.compositeId === id) good.quantity = quantity;
        return good;
      })
    );
  };

  const format = (num: number) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const existingCustomer = formData.get('existing-customer');
    let response = { status: false, message: 'Error, try again' };

    if (existingCustomer === 'yes') {
      const customerId = Number(formData.get('existing-customer-id') as string);
      response = await sales.createOrder(customerId, order);
    } else {
      const newCustomer = {
        name: formData.get('customer-name') as string,
        email: formData.get('customer-email') as string
      };
      response = await createOrderWithNewCustomer(newCustomer, order);
    }

    snackbar.push(response.message);
    if (response.status) {
      history.push('/sales');
    }
  };

  const createOrderWithNewCustomer = async (
    newCustomer: { name: string; email: string },
    order: Good[]
  ) => {
    const response = await customer.addCustomer(newCustomer);
    return await sales.createOrder(response.customerId, order);
  };

  return goods === undefined ? (
    <Progress />
  ) : (
    <form className="CreateOrder" onSubmit={createOrder}>
      <div className="top">
        <div className="top__left">
          <ReturnButton to="/sales" />
          <h1 className="title">Create Order</h1>
        </div>
        <div className="top__right">
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </div>
      </div>

      <Customer />

      <Card>
        <p className="label">Order Details</p>
        <div className="input-field">
          <Autocomplete
            key={order.length}
            onChange={selectGood}
            disableClearable={true}
            options={goods.filter(good => order.find(g => g.compositeId === good.id) === undefined)}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={good => good.name}
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Search items"
                variant="outlined"
                id="recipe"
                type="text"
              />
            )}
          />
          <TextField
            key={order.length - 1}
            onChange={selectQuantity}
            type="number"
            inputProps={{ min: '1', step: '1' }}
            variant="outlined"
            defaultValue="1"
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">×</InputAdornment>
            }}
          />
          <Button color="primary" variant="outlined" onClick={addGoodToOrder}>
            Add Item
          </Button>
        </div>

        <table className="order-info">
          <thead>
            <tr>
              <td style={{ width: '35%' }}>Item</td>
              <td style={{ width: '15%' }}>Unit Price</td>
              <td style={{ width: '15%' }}>Quantity</td>
              <td style={{ width: '10%' }}>Price</td>
              <td style={{ width: '5%' }}></td>
            </tr>
          </thead>
          <tbody>
            {order.map(good => (
              <tr key={good.compositeId}>
                <td>
                  <span>{good.name}</span>
                </td>
                <td>$ {format(good.price)}</td>
                <td>
                  <InputBase
                    className="quantity"
                    key={good.compositeId}
                    onChange={event =>
                      changeQuantity(event as React.ChangeEvent<HTMLInputElement>, good.compositeId)
                    }
                    type="number"
                    inputProps={{ 'aria-label': 'naked', min: '1', step: '1' }}
                    defaultValue={good.quantity}
                  />
                </td>
                <td>$ {format(good.price * good.quantity)}</td>
                <td>
                  <IconButton
                    aria-label="delete"
                    onClick={() => removeGoodFromOrder(good.compositeId)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={3}>Total</td>
              <td>
                $
                {order.length > 0
                  ? format(order.map(g => g.price * g.quantity).reduce((a, b) => a + b))
                  : 0}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </form>
  );
}
