import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import './ReturnButton.scss';

interface Props {
  to?: string;
}

export function ReturnButton({ to = '#' }: Props) {
  return (
    <div className="ReturnButton">
      <Button variant="outlined" component={Link} to={to}>
        <ArrowBack />
      </Button>
    </div>
  );
}
