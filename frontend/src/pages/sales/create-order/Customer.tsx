import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../../../components';
import { FormControl, RadioGroup, FormControlLabel, Radio, TextField } from '@material-ui/core';

import { useBackend } from '../../../contexts';
import { Autocomplete } from '@material-ui/lab';

interface Customers {
  customerId: number;
  name: string;
  email: string;
}

export default function Customer() {
  const [existingCustomer, setExistingCustomer] = useState<string>('yes');
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customers>();

  const { customer } = useBackend();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExistingCustomer(event.target.value);
  };

  const selectCustomer = (_: unknown, value: Customers) => {
    setSelectedCustomer(value);
  };

  const getCustomers = useCallback(async () => {
    const c = await customer.getAllCustomers();
    setCustomers(c);
  }, [customer]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <Card>
      <p className="label">Customer</p>
      <div className="input-field">
        <FormControl component="fieldset">
          <RadioGroup row value={existingCustomer} onChange={handleChange}>
            <FormControlLabel
              value={'no'}
              control={<Radio color="primary" />}
              label="Create new customer"
            />
            <FormControlLabel
              value={'yes'}
              control={<Radio color="primary" />}
              label="Use existing customer"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <input
        key={existingCustomer}
        name="existing-customer"
        type="hidden"
        value={existingCustomer}
      />

      {existingCustomer === 'no' ? (
        <div className="customer">
          <div>
            <label htmlFor="customer-name">Customer's Name</label>
            <TextField
              id="customer-name"
              name="customer-name"
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div>
            <label htmlFor="customer-email">Customer's Email</label>
            <TextField
              id="customer-email"
              name="customer-email"
              type="email"
              variant="outlined"
              fullWidth
              required
            />
          </div>
        </div>
      ) : (
        <>
          <Autocomplete
            onChange={selectCustomer}
            disableClearable={true}
            options={customers}
            getOptionLabel={customer => `${customer.name} (${customer.email})`}
            getOptionSelected={(option, value) => option.customerId === value.customerId}
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Select an existing customer"
                variant="outlined"
                required
                id="existingCustomer"
                type="text"
              />
            )}
          />
          <input
            key={selectedCustomer?.customerId}
            name="existing-customer-id"
            type="hidden"
            value={selectedCustomer?.customerId}
          />
        </>
      )}
    </Card>
  );
}
