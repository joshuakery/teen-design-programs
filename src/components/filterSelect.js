import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    FormControl, InputLabel, Select, MenuItem,
   } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        minWidth: 120,
        width: '100%',
    },
    item: {
        color: 'black',
    }
});

const FilterSelect = props => {
    const { optionName, options, onSelectChange, selected } = props;
    const classes = useStyles();
    return (
        <FormControl className={classes.formControl} variant="filled">
            <InputLabel id={optionName + "-selectLabel"}>{optionName}</InputLabel>
            <Select
                labelId={optionName + "-selectLabel"}
                id={optionName + "-select"}
                value={selected}
                // onOpen={(e) => onSelectChange(e, optionName)}
                onChange={(e) => onSelectChange(e, optionName)}
                inputProps={{
                    name: optionName,
                    id: optionName + "-select",
                }}
            >
                <MenuItem value="">
                    <em>Any</em>
                </MenuItem>
                {options.map(option => (
                    <MenuItem key={option} value={option} className={classes.item}>
                        {option}
                    </MenuItem>
                ))
                }
            </Select>
        </FormControl>
    ); 
}

export default FilterSelect;