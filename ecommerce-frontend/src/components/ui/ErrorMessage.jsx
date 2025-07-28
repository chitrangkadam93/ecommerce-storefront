import { Alert, Box } from '@mui/material';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">
        {message}
        {onRetry && (
          <Box sx={{ mt: 1 }}>
            <Button 
              variant="outlined" 
              color="error" 
              size="small" 
              onClick={onRetry}
            >
              Retry
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;