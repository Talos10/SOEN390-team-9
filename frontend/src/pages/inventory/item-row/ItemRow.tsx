import React from 'react';
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

interface Props{
  props:Item;
  archiveFunc: Function;
}

export default function ItemRow({props, archiveFunc}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton size="small">{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</IconButton>
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
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {props.type === 'finished' && <FinishedGood key={props.id} {...{props:props, archiveFunc:archiveFunc}} />}
              {props.type === 'semi-finished' && <SemiFinishedGood key={props.id} {...{props:props, archiveFunc:archiveFunc}} />}
              {props.type === 'raw' && <RawMaterial key={props.id} {...{props:props, archiveFunc:archiveFunc}} />}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function ArchiveButton({props, archiveFunc}: Props) {
  return (
    <Button
      variant="outlined"
      color="primary"
      className="button"
      onClick={() => archiveFunc(props.id)}>
      Archive
    </Button>
  );
}

function RawMaterial({props, archiveFunc}: Props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={9} className="Info">
        <p>Item Id: {props.id}</p>
        <p>Item cost: ${props.cost}</p>
        <p>Estimated delivery time: {props.processTime} days</p>
      </Grid>
      <Grid item xs={3} className="Archive">
      <ArchiveButton {...{props:props, archiveFunc:archiveFunc}} />
      </Grid>
    </Grid>
  );
}

function SemiFinishedGood({props, archiveFunc}: Props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={9} className="Info">
        <p>Item Id: {props.id}</p>
        <p>Item cost: ${props.cost}</p>
        <p>Manufacturing time: {props.processTime} minutes</p>
      </Grid>
      <Grid item xs={3}>
      <ArchiveButton {...{props:props, archiveFunc:archiveFunc}} />
      </Grid>
      <Grid item xs={6}>
        {props.components.length !== 0 && <ComponentsTable key={props.id} {...props} />}
      </Grid>
      <Grid item xs={6}>
        {props.properties.length !== 0 && <PropertiesTable key={props.id} {...props} />}
      </Grid>
    </Grid>
  );
}

function FinishedGood({props, archiveFunc}: Props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={9} className="Info">
        <p>Item Id: {props.id}</p>
        <p>Selling price: ${props.price}</p>
        <p>Manufacturing time: {props.processTime} minutes</p>
      </Grid>
      <Grid item xs={3} className="Archive">
        <ArchiveButton {...{props:props, archiveFunc:archiveFunc}} />
      </Grid>
      <Grid item xs={6}>
        {props.components.length !== 0 && <ComponentsTable key={props.id} {...props} />}
      </Grid>
      <Grid item xs={6}>
        {props.properties.length !== 0 && <PropertiesTable key={props.id} {...props} />}
      </Grid>
    </Grid>
  );
}

function PropertiesTable(item: Item) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Properties</TableCell>
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
    <Table size="small">
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
