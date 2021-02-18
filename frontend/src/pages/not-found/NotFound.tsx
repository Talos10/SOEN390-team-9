import { Link } from 'react-router-dom';

import './NotFound.scss';

export default function NotFound() {
  return (
    <div className="NotFound">
      <div>
        <p className="h3">404</p>
        <p>The page you requested could not be found.</p>
        <p>
          Return <Link to="/">Home</Link>.
        </p>
      </div>
    </div>
  );
}
