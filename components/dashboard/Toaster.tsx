import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useState } from "react";

type ToasterProps = {
  open: boolean;
  message: string;
  type?: AlertColor; // 'success' | 'error' | 'info' | 'warning'
  autoHideDuration?: number;
  onClose?: () => void;
};

const Toaster = ({
  open,
  message,
  type = "info",
  autoHideDuration = 6000,
  onClose,
}: ToasterProps) => {
  // Internal fallback close handler
  const [internalOpen, setInternalOpen] = useState(open);

  const handleClose = () => {
    setInternalOpen(false);
    onClose?.(); // Call user-supplied one if it exists
  };
  return (
    <Snackbar
      open={onClose ? open : internalOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
