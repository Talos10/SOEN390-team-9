import { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { Card } from '../../../components';
import { v4 as uuid } from 'uuid';

import './Properties.scss';

export default function Properties() {
  const [hasProperties, setHasProperties] = useState<boolean>(false);

  /**
   * React uses keys to keep track of what needs to be added, deleted, and
   * changed in the DOM.
   *
   * The following list of keys help React keep track of the properties as they.
   */
  const [propertyKeys, setPropertyKeys] = useState<string[]>([uuid()]);

  const addProperty = () => {
    let key: string;
    do {
      key = uuid();
    } while (propertyKeys.includes(key));
    setPropertyKeys([...propertyKeys, key]);
  };

  const removeProperty = (keyToRemove: string) => {
    const filteredKeys = propertyKeys.filter(key => key !== keyToRemove);
    setPropertyKeys(filteredKeys);
  };

  return (
    <Card className="Properties">
      <div className="properties-top">
        <p>Properties</p>
        <FormControlLabel
          control={
            <Checkbox
              value={hasProperties}
              onClick={() => setHasProperties(!hasProperties)}
              name="has-properties"
              color="primary"
            />
          }
          label="There exists similar items with different options, like different size or color."
        />
      </div>
      {hasProperties && (
        <div className="properties-list">
          <p>Options</p>
          {propertyKeys.map((key, index) => (
            <div key={key} className="property">
              <div className="property-top">
                <label>Option {index + 1}</label>
                {propertyKeys.length > 1 && (
                  <Button onClick={() => removeProperty(key)}>Remove</Button>
                )}
              </div>
              <div className="property-form-group">
                <TextField
                  name={`property-name`}
                  variant="outlined"
                  required
                  placeholder="Option Name"
                  fullWidth
                />
                <TextField
                  name={`property-value`}
                  variant="outlined"
                  placeholder="Option Value"
                  required
                  fullWidth
                />
              </div>
            </div>
          ))}
          <Button variant="outlined" onClick={addProperty}>
            Add Property
          </Button>
        </div>
      )}
    </Card>
  );
}
