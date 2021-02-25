import { Snackbar } from '@material-ui/core';
import { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext({
  push: (message: string) => {}
});

interface Provider {
  children?: React.ReactNode;
}

export const SnackbarProvider = ({ ...props }: Provider) => {
  const [message, setMessage] = useState<string>();

  const push = (message: string) => {
    setMessage(message);
  };

  return (
    <>
      <SnackbarContext.Provider value={{ push }}>{props.children}</SnackbarContext.Provider>
      <Snackbar
        open={message !== undefined}
        autoHideDuration={6000}
        onClose={() => setMessage(undefined)}
        message={message}
      />
    </>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
