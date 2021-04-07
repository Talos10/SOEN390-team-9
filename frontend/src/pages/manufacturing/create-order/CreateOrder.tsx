import React, { useEffect, useState } from 'react';
import { ReturnButton, Card, Progress } from '../../../components';
import { Item } from '../../../interfaces/Items';
import { Button, TextField, InputAdornment, InputBase, IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';

import './CreateOrder.scss';
import { useBackend, useSnackbar } from '../../../contexts';
import { useHistory } from 'react-router';

interface Order {
  compositeId: number;
  quantity: number;
  name: string;
  cost: number;
}

export default function CreateOrder() {
  const [goods, setGoods] = useState<Item[]>();
  const [order, setOrder] = useState<Order[]>([]);
  const [selectedGood, setSelectedGood] = useState<Order>();

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
      cost: value.cost
    });
  };

  const selectQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const quantity = Number(input.value);
    setSelectedGood({
      compositeId: selectedGood?.compositeId || 0,
      quantity: quantity,
      name: selectedGood?.name || 'error item',
      cost: selectedGood?.cost || 0
    });
    // setOrder({ ...order, quantity });
  };

  // Modifying the list of goods in the order
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

  // Formatting price value
  const format = (num: number) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await manufacturing.createOrder(order);

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
            key={order.length}
            onChange={selectGood}
            disableClearable={true}
            options={goods.filter(good => order.find(g => g.compositeId === good.id) === undefined)}
            getOptionLabel={good => `${good.name} - ${good.type}`}
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
              <td style={{ width: '15%' }}>Unit Cost</td>
              <td style={{ width: '15%' }}>Quantity</td>
              <td style={{ width: '10%' }}>Cost</td>
              <td style={{ width: '5%' }}></td>
            </tr>
          </thead>
          <tbody>
            {order.map(element => (
              <tr key={element.compositeId}>
                <td>{element.name}</td>
                <td>$ {format(element.cost)}</td>
                <td>
                  <InputBase
                    className="quantity"
                    key={element.compositeId}
                    onChange={event =>
                      changeQuantity(
                        event as React.ChangeEvent<HTMLInputElement>,
                        element.compositeId
                      )
                    }
                    type="number"
                    inputProps={{ 'aria-label': 'naked', min: '1', step: '1' }}
                    defaultValue={element.quantity}
                  />
                </td>
                <td>$ {format(element.cost * element.quantity)}</td>
                <td>
                  <IconButton
                    aria-label="delete"
                    onClick={() => removeGoodFromOrder(element.compositeId)}>
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
                  ? format(order.map(g => g.cost * g.quantity).reduce((a, b) => a + b))
                  : 0}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </form>
  );
}
