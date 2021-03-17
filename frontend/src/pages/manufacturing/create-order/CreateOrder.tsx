import React, { useEffect, useState } from 'react';
import { ReturnButton, Card, Progress } from '../../../components';
import { Item } from '../../../interfaces/Items';
import { Button, TextField, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import './CreateOrder.scss';
import { useBackend, useSnackbar } from '../../../contexts';
import { useHistory } from 'react-router';

interface Order {
  good?: Item;
  compositeId?: number;
  quantity: number;
}

export function CreateOrder() {
  const [goods, setGoods] = useState<Item[]>();
  const [order, setOrder] = useState<Order>({
    good: undefined,
    compositeId: undefined,
    quantity: 1
  });
  const { manufacturing, inventory } = useBackend();
  const snackbar = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    const getGoods = async () => {
      const goods = (await inventory.getAllGoods()).sort((a: Item, b: Item) =>
        (a.type === 'raw' && b.type === 'semi-finished') ||
        (a.type === 'raw' && b.type === 'finished') ||
        (a.type === 'semi-finished' && b.type === 'finished')
          ? -1
          : 1
      );
      setGoods(goods);
    };

    getGoods();
  }, [inventory]);

  const selectGood = (_: unknown, value: Item) => {
    setOrder({
      good: value,
      compositeId: value.id,
      quantity: order.quantity
    });
  };

  const selectQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const quantity = Number(input.value);
    setOrder({ ...order, quantity });
  };

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await manufacturing.createOrder([
      {
        compositeId: order.good!.id,
        quantity: order.quantity
      }
    ]);

    snackbar.push(response.message);
    if (response.message) {
      history.push('/manufacturing');
    }
  };

  return goods === undefined ? (
    <Progress />
  ) : (
    <form className="CreateOrder" onSubmit={createOrder}>
      <div className="top">
        <div className="top__left">
          <ReturnButton to="/manufacturing" />
          <h1 className="title">Create Order</h1>
        </div>
        <div className="top__right">
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </div>
      </div>

      <Card>
        <p className="label">Order Details</p>
        <div className="input-field">
          <Autocomplete
            onChange={selectGood}
            disableClearable={true}
            options={goods}
            getOptionLabel={good => `${good.name} - ${good.type}`}
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Search items"
                variant="outlined"
                required
                id="recipe"
                type="text"
              />
            )}
          />
          <TextField
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
        </div>

        {order.good ? (
          <div className="summary">
            {order.good.components.map(component => (
              <div className="summary__line-item" key={component.id}>
                <span>{component.name}</span>
                <span>{component.quantity * order.quantity}x</span>
              </div>
            ))}
            <div className="summary__total">
              <span>{order.good.name}</span>
              <span>{order.quantity}x</span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Card>
    </form>
  );
}
