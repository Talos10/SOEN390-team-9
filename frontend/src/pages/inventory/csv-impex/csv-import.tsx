import React from 'react';
import { readString } from 'react-papaparse';
import { Button } from '@material-ui/core';
import { API_GOOD } from '../../../utils/api';

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
  properties?: Property[];
  components?: Component[];
}

interface RawGoodInterface extends GoodInterface {
  vendor: string;
}

interface SemiGoodInterface extends GoodInterface {}

interface FinishedGoodInterface extends GoodInterface {
  price: number;
}

interface ErrorResponse {
  status: false;
  error: string;
}

interface SuccessResponse {
  status: true;
  message: string;
}

export default function ImportButton() {
  // Process the csv to JSON object
  const toJSON = async (selectorFiles: FileList | null) => {
    if (selectorFiles === null) return;
    if (selectorFiles.length === 0) return;
    const csvfile = selectorFiles[selectorFiles.length - 1];
    // const blob = (await csvfile.text()).split("\n");
    const blob = await csvfile.text();
    const options = {
      header: true
    };
    const results: any[] = readString(blob, options).data;
    let goodsList: any[] = [];

    results.forEach(element => {
      if (element.name === '') return;

      if (element.type === 'raw') {
        element = element as RawGoodInterface;
      } else if (element.type === 'semi-finished') {
        element = element as SemiGoodInterface;
      } else if (element.type === 'finished') {
        element = element as FinishedGoodInterface;
        element.price = Number(element.price);
      }
      element.cost = Number(element.cost);
      element.processTime = Number(element.processTime);
      element.components = JSON.parse(element.components) as Component[];
      element.properties = JSON.parse(element.properties) as Property[];
      goodsList.push(element);
    });

            if(element.type === "raw"){
                element = element as RawGoodInterface;
            }
            else if(element.type === "semi-finished"){
                element = element as SemiGoodInterface;
            }
            else if(element.type === "finished"){
                element = element as FinishedGoodInterface;
                element.price = Number(element.price);
            }
            element.cost = Number(element.cost);
            element.processTime = Number(element.processTime);
            element.components = (JSON.parse(element.components) as Component[]);
            element.properties = (JSON.parse(element.properties) as Property[]);
            goodsList.push(element);
        });
        
        // Sending data to backend
        const request = await fetch(API_GOOD ,{
            method: 'POST',
            headers: {Authorization: `bearer ${localStorage.token}`, 'Content-type': 'application/json' },
            body: JSON.stringify(goodsList),
        });

    const response = (await request.json()) as ErrorResponse | SuccessResponse;
  };

  return (
    <Button color="primary" variant="contained" component="label" htmlFor="csv_import">
      Import CSV
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
