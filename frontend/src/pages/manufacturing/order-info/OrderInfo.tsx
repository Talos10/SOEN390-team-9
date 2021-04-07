import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
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
        <p className="label">General Information</p>

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
      {info.orderedGoods.map(good => (
        <Card className="info">
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
            <Button
              disabled
              variant="contained"
              color="primary"
              onClick={() => changeStatus('processing')}>
              Start Production
            </Button>
          </>
        ) : (
          <></>
        )}

        {info.status === 'processing' ? (
          <Button
            disabled
            variant="contained"
            color="primary"
            onClick={() => changeStatus('completed')}>
            Mark as completed
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
