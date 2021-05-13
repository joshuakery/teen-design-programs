import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff6363',
      contrastText: '#ffffff',
    },
  },
  overrides: {
    MuiTableCell: {
        root: {
            padding: '2px',
        },
    },
  },
  props: {
    MuiTextField: {
        size: "small",
    },
    MuiTableCell: {
        size: "small",
    }
  },
});

export default theme;