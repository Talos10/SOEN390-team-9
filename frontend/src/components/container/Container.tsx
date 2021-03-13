import React, { useState } from 'react';
import Sidenav from './sidenav/Sidenav';
import Appbar from './appbar/Appbar';

import style from './Container.module.css';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
}

export function Container({ children, className, title, ...props }: Props) {
  const [showSidenav, toggleSidenav] = useState<boolean>(false);

  showSidenav
    ? document.body.classList.add('sidenav-open')
    : document.body.classList.remove('sidenav-open');

  return (
    <div {...props} className={style.Container}>
      <Sidenav {...{ showSidenav, toggleSidenav }} />
      <div className={style.Content}>
        <Appbar {...{ showSidenav, toggleSidenav, title }} />
        <div className={`${style.main}`}>{children}</div>
      </div>
    </div>
  );
}
