import { useEffect, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button } from '@material-ui/core';
import { useBackend, useSnackbar } from '../../../contexts';
import { Card, Progress, ReturnButton } from '../../../components';

import './OrderInfo.scss';
import { Order } from '../../../interfaces/Order';

export default function OrderInfo() {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<Order>();
  const { manufacturing } = useBackend();
  const snackbar = useSnackbar();
  const history = useHistory();

  const getInfo = useCallback(async () => {
    const order = await manufacturing.getOrder(id);
    setInfo(order);
  }, [id, manufacturing]);

  const formatDate = (dateStr: string) => {
    if (dateStr === null || dateStr === '') {
      return 'N/A';
    } else {
      const date = new Date(dateStr);
      return (
        (date.getMonth() + 1).toString() +
        '/' +
        date.getDate().toString() +
        '/' +
        date.getFullYear().toString()
      );
    }
  };

  const toScheduling = () => {
    history.push('/scheduling');
  };

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  const changeStatus = async (status: 'confirmed' | 'cancelled' | 'processing' | 'completed') => {
    const response = (await manufacturing.updateStatus(status, [Number(id)]))[0];
    snackbar.push(response.message);

    if (response.status) getInfo();
  };

  return info === undefined ? (
    <Progress />
  ) : (
    <div className="OrderInfo">
      <div className="top">
        <div className="top__left">
          <ReturnButton to="/manufacturing" />
          <h1 className="title">Order #{id}</h1>
        </div>
      </div>

      <Card>
        <p className="info-label">General Information</p>

        <table className="general-info">
          <tbody>
            <tr>
              <td>Status</td>
              <td className="status">
                {info.status.charAt(0).toUpperCase() + info.status.slice(1)}
              </td>
            </tr>
            <tr>
              <td>Creation Date (M/D/Y)</td>
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
        <p className="info-label">Order Information</p>

        <table className="order-info">
          <thead>
            <tr>
              <td style={{ width: '35%' }}>Item</td>
              <td style={{ width: '15%' }}>Unit Cost</td>
              <td style={{ width: '15%' }}>Quantity</td>
              <td style={{ width: '10%' }}>Cost</td>
            </tr>
          </thead>
          <tbody>
            {info.orderedGoods.map(good => (
              <tr key={good.compositeId}>
                <td>{good.item.name}</td>
                <td>$ {good.item.cost}</td>
                <td>{good.quantity}</td>
                <td>$ {good.totalCost}</td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={3}>Total</td>
              <td>$ {info.totalCost}</td>
            </tr>
          </tbody>
        </table>
      </Card>

      {info.orderedGoods.map(good => (
        <Card key={good.compositeId} className="info">
          <p className={`label ${info.status}`}>
            {good.item.name} {good.quantity}× ({info.status})
          </p>
          <div className="summary">
            {good.item.components.map(component => (
              <div className="summary__line-item" key={component.id}>
                <span>{component.name}</span>
                <span>{component.quantity * good.quantity}×</span>
              </div>
            ))}
            <div className="summary__total">
              <span>{good.item.name}</span>
              <span>{good.quantity}×</span>
            </div>
          </div>
        </Card>
      ))}
      <div className="confirmation">
        {info.status === 'confirmed' ? (
          <>
            <Button variant="outlined" onClick={() => changeStatus('cancelled')}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={toScheduling}>
              Schedule Order
            </Button>
          </>
        ) : (
          <></>
        )}

        {info.status === 'processing' ? (
          <Button variant="contained" color="primary" onClick={toScheduling}>
            See in Scheduling tab
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
