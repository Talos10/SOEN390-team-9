import { Snackbar, Button } from '@material-ui/core';
import { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext({
  push: (message: string, callback?: () => void) => {}
});

interface Provider {
  children?: React.ReactNode;
}

export const SnackbarProvider = ({ ...props }: Provider) => {
  const [message, setMessage] = useState<string>();
  const [undo, setUndo] = useState<{ invoke: () => void }>();

  const push = (message: string, undo?: () => void) => {
    setMessage(message);
    setUndo(undo && { invoke: undo });
  };

  const handleClose = () => {
    setMessage(undefined);
    setUndo(undefined);
  };

  const handleUndo = () => {
    undo?.invoke();
    handleClose();
  };

  return (
    <>
      <SnackbarContext.Provider value={{ push }}>{props.children}</SnackbarContext.Provider>
      <Snackbar
        open={message !== undefined}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          undo === undefined ? (
            <></>
          ) : (
            <Button color="secondary" onClick={handleUndo}>
              UNDO
            </Button>
          )
        }
      />
    </>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
