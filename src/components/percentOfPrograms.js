import React, { useState, useEffect } from 'react';
import {
    Box, Grid,
    Typography,
   } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    textContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
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

const getBars = (fraction, prevIndex) => {
    const bars = [];
    if (fraction) {
        for (let i=0; i<fraction[1]; i++) {
            bars.push(<div style={getBarStyle(fraction,i,prevIndex)} key={'bar'+i}></div>)
        }
    }
    return bars;
}

const getBarStyle = (fraction, index, prevIndex) => {
    const delayStagger = prevIndex === fraction[0] ? 0 : 0.5 / (Math.abs(prevIndex - fraction[0]));
    const border = window.innerWidth > 450 ? '1px solid #f3f3f3' : 'none';
    const style = {
        background: "#ff6363",
        width: `calc(100% / ${fraction[1]})`,
        height: (index < fraction[0]) ? '100%' : '10%',
        border: border,
        transition: '1s',
    };
    if (prevIndex > index) {
        style.transitionDelay = `${(prevIndex - index) * delayStagger}s`;
    } else {
        style.transitionDelay = `${(index - prevIndex) * delayStagger}s`;
    }
    return style;
}

const PercentageBar = props => {
    const { fraction } = props;
    const [prevIndex, setPrevIndex] = useState(fraction[1]);
    const classes = useStyles();
    const bars = getBars(fraction, prevIndex);
    useEffect(() => {
        setPrevIndex(fraction[0]);
    }, [fraction])
    return (
        <div>
            <Grid item xs={12}>
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
            </Grid>
            <div className={classes.containerStyle}>
                {fraction && bars}
            </div>
        </div>
    );
}

export default PercentageBar;