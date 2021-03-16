import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Chip } from '@material-ui/core';
import { useAuth, useSnackbar } from '../../contexts';
import { API_ARCHIVE_GOOD, API_GOOD } from '../../utils/api';
import { Card, Progress, ReturnButton } from '../../components';
import { Item } from '../../interfaces/Items';

import './ItemInfo.scss';

interface Response {
  status: true;
  message: string;
}

interface Info {
  schema: Item;
  goods: {
    id: number;
    schema: number;
    quality: null;
  }[];
}

export default function ItemInfo() {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<Info>();
  const snackbar = useSnackbar();
  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    const getItems = async () => {
      const request = await fetch(`${API_GOOD}/id/${id}`, {
        headers: { Authorization: auth.getAuthorization() }
      });
      const response = await request.json();
      setInfo(response.message);
    };

    getItems();
  }, [id, auth]);

  const archiveItem = async () => {
    const data = [{ id: id, archive: true }];
    const request = await fetch(API_ARCHIVE_GOOD, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responses = (await request.json()) as Response[];

    // Will only run at max 1 time because we archive 1 item at a time
    for (var i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (!response.status) {
        snackbar.push(response.message);
        return;
      }
    }
    snackbar.push('Archive successful.');
    history.push('/inventory');
  };

  return info === undefined ? (
    <Progress />
  ) : (
    <div className="ItemInfo">
      <div className="top">
        <div className="top__left">
          <ReturnButton to="/inventory" />
          <h1 className="title">{info.schema.name}</h1>
        </div>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/manufacturing/create-order/${id}`}>
          Order item
        </Button>
      </div>

      <Card className="info">
        <p className="label">General Information</p>
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{info.schema.name}</td>
            </tr>
            <tr>
              <td>Id</td>
              <td>#{info.schema.id}</td>
            </tr>
            {info.schema.cost && (
              <tr>
                <td>Cost</td>
                <td>$ {info.schema.cost.toFixed(2)}</td>
              </tr>
            )}
            {info.schema.price ? (
              <tr>
                <td>Price</td>
                <td>$ {info.schema.price.toFixed(2)}</td>
              </tr>
            ) : (
              <></>
            )}
            {info.schema.vendor && (
              <tr>
                <td>Vendor</td>
                <td>{info.schema.vendor}</td>
              </tr>
            )}
            {info.schema.processTime && (
              <tr>
                <td>EDT</td>
                <td>{info.schema.processTime} days</td>
              </tr>
            )}
            {info.schema.components.length > 0 && (
              <tr>
                <td>Recipe</td>
                <td>
                  <div className="recipe">
                    {info.schema.components.map(ingredient => (
                      <Chip
                        key={ingredient.id}
                        size="small"
                        label={`${ingredient.quantity}× ${ingredient.name}`}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {info.schema.properties.length > 0 && (
              <tr>
                <td>Properties</td>
                <td>
                  <div className="properties">
                    {info.schema.properties.map(prop => (
                      <Chip key={prop.name} size="small" label={`${prop.name}: ${prop.value}`} />
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Card className="goods">
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Quality</td>
            </tr>
          </thead>
          <tbody>
            {info.goods.map(good => (
              <tr key={good.id}>
                <td>#{good.id}</td>
                <td>None</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="bottom">
        <Button variant="outlined" color="secondary" onClick={archiveItem}>
          Archieve
        </Button>
      </div>
    </div>
  );
}
