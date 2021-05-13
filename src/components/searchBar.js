import React from 'react';
import {
    Grid, Box,
    Button,
    TextField,
   } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    goButton: {
        height: '100%',
        // color: 'white',
        fontWeight: 'bold',
    }
});

const SearchBar = props => {
    const { onFiltersGo, onSearchChange } = props;
    const classes = useStyles();
    return (
        <Box width="100%" ml={1} mr={1}>
        <form onSubmit={(e) => onFiltersGo(e)} style={{width:'100%'}}>
            <Grid container spacing={1}>
                <Grid item xs={9} sm={10} md={11}>
                    <TextField
                    id="outlined-basic"
                    label="Search"
                    variant="outlined"
                    onChange={(e) => onSearchChange(e)}
                    fullWidth
                    />
                </Grid>
                <Grid item xs={3} sm={2} md={1}>
                    <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    size="large"
                    className={classes.goButton}
                    >
                    GO
                    </Button>
                </Grid>
            </Grid>
        </form>
        </Box>

    );
}

export default SearchBar;