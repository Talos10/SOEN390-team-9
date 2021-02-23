import React, { useState } from 'react';
import Sidenav from './sidenav/Sidenav';
import Appbar from './appbar/Appbar';

import style from './Container.module.css';

interface Props {
  children: React.ReactNode;
}

export default function Container({ children }: Props) {
  const [showSidenav, toggleSidenav] = useState<boolean>(false);

  showSidenav
    ? document.body.classList.add('sidenav-open')
    : document.body.classList.remove('sidenav-open');

  return (
    <div className={style.Container}>
      <Sidenav {...{ showSidenav, toggleSidenav }} />
      <div>
        <Appbar {...{ showSidenav, toggleSidenav }} />
        <main className={style.main}>{children}</main>
      </div>
    </div>
  );
}
