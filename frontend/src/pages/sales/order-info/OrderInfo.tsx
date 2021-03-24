import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Button, Chip } from '@material-ui/core';
import { useBackend, useSnackbar } from '../../../contexts';
import { Card, Progress, ReturnButton } from '../../../components';

import './OrderInfo.scss';
import { Order, OrderedGoods } from '../../../interfaces/CustomerOrder';

export default function OrderInfo() {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<Order>();
  const { sales } = useBackend();
  const snackbar = useSnackbar();

  const getInfo = useCallback(async () => {
    const order = await sales.getOrder(id);
    setInfo(order);
  }, [id, sales]);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  const changeStatus = async (status: 'confirmed' | 'cancelled' | 'completed') => {
    const response = (await sales.updateStatus(status, [Number(id)]))[0];
    snackbar.push(response.message);

    if (response.status) getInfo();
  };

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

  const getMissingQty = (item: OrderedGoods) => {
    return item.item.quantity - item.quantity;
  };

  return info === undefined ? (
    <Progress />
  ) : (
    <div className="SalesOrderInfo">
      <div className="top">
        <div className="top__left">
          <ReturnButton to="/sales" />
          <h1 className="title">Order #{id}</h1>
        </div>
      </div>

      <Card>
        <p className="label">General Information</p>

        <table className="general-info">
          <tbody>
            <tr>
              <td>Status</td>
              <td className="status">{info.status}</td>
            </tr>
            <tr>
              <td>Customer</td>
              <td>
                {info.customer.name} ({info.customer.email})
              </td>
            </tr>
            <tr>
              <td>Creation Date</td>
              <td>{formatDate(info.creationDate)}</td>
            </tr>
            <tr>
              <td>Completion Date</td>
              <td>{formatDate(info.completionDate)}</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <Card>
        <p className="label">Order Information</p>

        <table className="order-info">
          <thead>
            <tr>
              <td style={{ width: '35%' }}>Item</td>
              <td style={{ width: '15%' }}>Unit Price</td>
              <td style={{ width: '15%' }}>Quantity</td>
              <td style={{ width: '10%' }}>Price</td>
            </tr>
          </thead>
          <tbody>
            {info.orderedGoods.map(good => (
              <tr key={good.compositeId}>
                <td>
                  <span>{good.item.name}</span>
                  {getMissingQty(good) < 0 && info.status === 'confirmed' ? (
                    <>
                      <span className="missing">
                        <Chip label={`Missing ${Math.abs(getMissingQty(good))}`}></Chip>
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </td>
                <td>$ {good.item.price}</td>
                <td>{good.quantity}</td>
                <td>$ {good.totalPrice}</td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={3}>Total</td>
              <td>$ {info.totalPrice}</td>
            </tr>
          </tbody>
        </table>

        <div className="confirmation">
          {info.status === 'confirmed' ? (
            <>
              <Button variant="outlined" onClick={() => changeStatus('cancelled')}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={() => changeStatus('completed')}>
                Complete Order
              </Button>
            </>
          ) : (
            <></>
          )}

          {info.status === 'cancelled' ? (
            <Button variant="contained" color="primary" onClick={() => changeStatus('confirmed')}>
              Confirm Order
            </Button>
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  );
}
