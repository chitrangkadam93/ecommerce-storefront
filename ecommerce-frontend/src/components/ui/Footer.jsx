import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: (theme) => 
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800]
      }}
    >
      <Typography variant="body1" align="center">
        © {new Date().getFullYear()} E-Commerce Store
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary">
        <Link href="#" color="inherit">Terms</Link> | 
        <Link href="#" color="inherit">Privacy</Link> | 
        <Link href="#" color="inherit">Contact</Link>
      </Typography>
    </Box>
  );
};

export default Footer;