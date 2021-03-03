import { useState, Fragment } from 'react';
import {
  Button,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Grid
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons/';
import { Item } from '../../../interfaces/Items';
import './ItemRow.scss';

interface Props {
  props: Item;
  archiveFunc: Function;
  open: boolean;
}

interface InfoTableProps {
  props: Item;
  archiveFunc: Function;
}

interface ItemProps {
  item: Item;
}

export default function ItemRow({ props, archiveFunc, open }: Props) {
  const [tableOpen, setTableOpen] = useState<boolean>(open);

  return (
    <Fragment>
      <TableRow onClick={() => setTableOpen(!tableOpen)} className="table_row">
        <TableCell>
          <IconButton size="small">
            {tableOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell scope="row">{props.name}</TableCell>
        <TableCell align="left">{props.quantity} in stock</TableCell>
        <TableCell align="left">
          {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
        </TableCell>
        <TableCell align="left">{props.vendor}</TableCell>
      </TableRow>
      <TableRow className="info">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={tableOpen} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <InfoTable {...{ props, archiveFunc }} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

function InfoTable({ props, archiveFunc }: InfoTableProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={9} className="Info">
        {props.type === 'finished' && <FinishedGood {...{ item: props }} />}
        {props.type === 'semi-finished' && <SemiFinishedGood {...{ item: props }} />}
        {props.type === 'raw' && <RawMaterial {...{ item: props }} />}
      </Grid>
      <Grid item xs={3} className="Archive">
        <Button
          variant="outlined"
          color="primary"
          className="button"
          onClick={() => archiveFunc(props.id)}>
          Archive
        </Button>{' '}
      </Grid>
      <Grid item xs={6}>
        {props.components.length !== 0 && <ComponentsTable {...props} />}
      </Grid>
      <Grid item xs={6}>
        {props.properties.length !== 0 && <PropertiesTable {...props} />}
      </Grid>
    </Grid>
  );
}

function RawMaterial({ item }: ItemProps) {
  return (
    <Fragment>
      <p>Item Id: {item.id}</p>
      <p>Item cost: ${item.cost}</p>
      <p>Estimated delivery time: {item.processTime} days</p>
    </Fragment>
  );
}

function SemiFinishedGood({ item }: ItemProps) {
  return (
    <Fragment>
      <p>Item Id: {item.id}</p>
      <p>Item cost: ${item.cost}</p>
      <p>Manufacturing time: {item.processTime} minutes</p>
    </Fragment>
  );
}

function FinishedGood({ item }: ItemProps) {
  return (
    <Fragment>
      <p>Item Id: {item.id}</p>
      <p>Selling price: ${item.price}</p>
      <p>Manufacturing time: {item.processTime} minutes</p>
    </Fragment>
  );
}

function PropertiesTable(item: Item) {
  return (
    <Table size="small" className="small_table">
      <TableHead>
        <TableRow>
          <TableCell>Properties</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {item.properties.map(property => (
          <TableRow key={property.name}>
            <TableCell align="left">{property.name}</TableCell>
            <TableCell align="left">{property.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ComponentsTable(item: Item) {
  return (
    <Table size="small" className="small_table">
      <TableHead>
        <TableRow>
          <TableCell>Made from</TableCell>
          <TableCell>Quantity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {item.components.map(component => (
          <TableRow key={component.name}>
            <TableCell align="left">{component.name}</TableCell>
            <TableCell align="left">{component.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
