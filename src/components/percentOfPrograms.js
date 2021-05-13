import React from 'react';
import {
    Box,
    Typography,
   } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    textContainer: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    text: {
        marginRight: '10px',
    },
    textBig: {
        marginRight: '10px',
        fontSize: '72px',
        lineHeight: '72px',
        fontWeight: 'bold',
    },
    containerStyle: {
        width: "100%",
        height: "40px",
        display: 'flex',
        alignItems: 'flex-end',
    },
});

const getBars = fraction => {
    const bars = [];
    if (fraction) {
        const tallBarStyle = getBarStyle(fraction, true);
        const shortBarStyle = getBarStyle(fraction, false);
        for (let i=0; i<fraction[1]; i++) {
            if (i < fraction[0]) {
                bars.push(<div style={tallBarStyle} key={'bar'+i}></div>)
            } else {
                bars.push(<div style={shortBarStyle} key={'bar'+i}></div>)
            }
        }
    }
    return bars;
}

const getBarStyle = (fraction, isTall) => {
    return {
        background: "#ff6363",
        width: `calc(100% / ${fraction[1]})`,
        height: isTall ? '100%' : '10%',
        border: '1px solid #f3f3f3',
        transition: '1s',
    }
}

const PercentageBar = props => {
    const { fraction } = props;
    const classes = useStyles();
    const bars = getBars(fraction);
    return (
        <div>
            <Box mb={2} className={classes.textContainer}>
                <Typography variant="h4" className={classes.text}>
                    displaying
                </Typography>
                <Typography variant="h4" className={classes.textBig}>
                    {fraction[0]}
                </Typography>
                <Typography variant="h4" className={classes.text}>
                    of
                </Typography>
                <Typography variant="h4" className={classes.textBig}>
                    {fraction[1]}
                </Typography>
                <Typography variant="h4" className={classes.text}>
                    programs
                </Typography>
            </Box>
            <div className={classes.containerStyle}>
                {fraction && bars}
            </div>
        </div>
    );
}

export default PercentageBar;