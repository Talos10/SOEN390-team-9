import React from 'react';
import { readString } from 'react-papaparse';
import { Button } from '@material-ui/core';
import { API_GOOD } from '../../../utils/api';
import { useSnackbar } from '../../../contexts';

interface Property {
  name: string;
  value: string;
}

interface Component {
  id: number;
  quantity: number;
}

interface GoodInterface {
  name: string;
  type: string;
  quantity: number;
  processTime: number;
  cost: number;
  properties?: Property[] | string;
  components?: Component[] | string;
}

interface RawGood extends GoodInterface {
  type: 'raw';
  vendor: string;
}

interface SemiGood extends GoodInterface {
  type: 'semi-finished';
}

interface FinishedGood extends GoodInterface {
  type: 'finished';
  price: number;
}

type Good = FinishedGood | SemiGood | RawGood;

interface ErrorResponse {
  status: false;
  message: string;
}

interface SuccessResponse {
  status: true;
  message: string;
  good: Good;
}

type Response = ErrorResponse | SuccessResponse;

export default function ImportButton() {
  const snackbar = useSnackbar();

  /** Process the csv to JSON object and submits it*/
  const toJSON = async (selectorFiles: FileList | null) => {
    if (selectorFiles === null) return;
    if (selectorFiles.length === 0) return;
    const csvfile = selectorFiles[selectorFiles.length - 1];
    const blob = await csvfile.text();
    const options = { header: true };
    const results = readString(blob, options).data as Good[];
    const goodsList: Good[] = [];

    results.forEach(good => {
      if (good.name === '') return;

      if (good.type === 'finished') {
        good.price = Number(good.price);
      }

      good.cost = Number(good.cost);
      good.processTime = Number(good.processTime);
      good.components = JSON.parse(good.components as string) as Component[];
      good.properties = JSON.parse(good.properties as string) as Property[];
      goodsList.push(good);
    });

    // Sending data to backend
    const request = await fetch(API_GOOD, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(goodsList)
    });

    const responses = (await request.json()) as Response[];
    for (var i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (!response.status) {
        snackbar.push(response.message);
        return;
      }
    }
    snackbar.push('Import successful.');
  };

  return (
    <Button component="label" htmlFor="csv_import">
      Import
      <input
        id="csv_import"
        onChange={e => toJSON(e.target.files)}
        hidden
        type="file"
        accept=".csv"
      />
    </Button>
  );
}
