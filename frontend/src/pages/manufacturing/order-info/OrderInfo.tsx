import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Button } from '@material-ui/core';
import { useBackend, useSnackbar } from '../../../contexts';
import { Card, Progress, ReturnButton } from '../../../components';

import './OrderInfo.scss';
import { Orders } from '../../../interfaces/Orders';
import { Item } from '../../../interfaces/Items';

interface Info {
  order: Orders;
  schema: Item;
}

export default function OrderInfo() {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<Info>();
  const { manufacturing, inventory } = useBackend();
  const snackbar = useSnackbar();

  const getInfo = useCallback(async () => {
    const order = await manufacturing.getOrder(id);
    const good = await inventory.getGood((order.orderedGoods[0] as any).compositeId);
    setInfo({ order, schema: good.schema });
  }, [id, manufacturing, inventory]);

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

      <Card className="info">
        <p className={`label ${info.order.status}`}>
          {info.schema.name} {info.order.orderedGoods[0].quantity}× ({info.order.status})
        </p>
        <div className="summary">
          {info.schema.components.map(component => (
            <div className="summary__line-item" key={component.id}>
              <span>{component.name}</span>
              <span>{component.quantity * info.order.orderedGoods[0].quantity}×</span>
            </div>
          ))}
          <div className="summary__total">
            <span>{info.schema.name}</span>
            <span>{info.order.orderedGoods[0].quantity}×</span>
          </div>
        </div>

        <div className="confirmation">
          {info.order.status === 'confirmed' ? (
            <>
              <Button variant="outlined" onClick={() => changeStatus('cancelled')}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => changeStatus('processing')}>
                Start Production
              </Button>
            </>
          ) : (
            <></>
          )}

          {info.order.status === 'processing' ? (
            <Button variant="contained" color="primary" onClick={() => changeStatus('completed')}>
              Mark as completed
            </Button>
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  );
}
