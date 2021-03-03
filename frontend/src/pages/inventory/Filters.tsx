import { Item } from '../../interfaces/Items';

function sortItemsByType(x: Item, y: Item) {
  if (
    (x.type === 'raw' && y.type === 'semi-finished') ||
    (x.type === 'raw' && y.type === 'finished') ||
    (x.type === 'semi-finished' && y.type === 'finished')
  ) {
    return -1;
  } else {
    return 1;
  }
}

function filterForRawItems(x: Item) {
  if (x.type === 'raw') {
    return true;
  }
  return false;
}

function filterForSemiItems(x: Item) {
  if (x.type === 'semi-finished') {
    return true;
  }
  return false;
}

function filterForFinishedItems(x: Item) {
  if (x.type === 'finished') {
    return true;
  }
  return false;
}

export { sortItemsByType, filterForRawItems, filterForSemiItems, filterForFinishedItems };
