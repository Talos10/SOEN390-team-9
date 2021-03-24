import { Button } from '@material-ui/core';
import { saveAs } from 'file-saver';
import { jsonToCSV } from 'react-papaparse';
import { useBackend } from '../../../contexts';

export default function ExportButton() {
  const { inventory } = useBackend();

  const toCSV = async () => {
    const goods = await inventory.getAllGoods();
    for (var key in goods) {
      // Creates a shallow copy of the good to give it new properties without
      // being constained by the type of the good.
      const obj: any = goods[key];
      obj['components'] = JSON.stringify(obj['components']);
      obj['properties'] = JSON.stringify(obj['properties']);
    }
    const csv = jsonToCSV(goods);
    const file = new File([csv], 'ModelData.csv', { type: '.csv' });
    saveAs(file);
  };

  return (
    <Button component="button" onClick={toCSV}>
      Export
    </Button>
  );
}
