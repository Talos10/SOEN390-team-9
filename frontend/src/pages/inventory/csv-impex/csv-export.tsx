import React from 'react';
import { Button } from '@material-ui/core';
import { saveAs } from 'file-saver';
import { jsonToCSV } from 'react-papaparse';
import { API_GOOD } from '../../../utils/api';

export default function ExportButton() {
  const toCSV = async () => {
    const request = await fetch(API_GOOD, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    for (var key in response.message) {
      // Get object
      let obj = response.message[key];
      obj['components'] = JSON.stringify(obj['components']);
      obj['properties'] = JSON.stringify(obj['properties']);
    }
    const csv = jsonToCSV(response.message);
    const file = new File([csv], 'ModelData.csv', { type: '.csv' });
    saveAs(file);
  };

  return (
    <Button component="button" onClick={toCSV}>
      Export
    </Button>
  );
}
