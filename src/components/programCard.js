import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Box,
    Card, CardContent, CardActions,
    Typography,
    Button, Link, Divider,
   } from '@material-ui/core';

const useStyles = makeStyles({
    root: {

    },
    card: {
      minWidth: 275,
      borderRadius: '10px',
      transition: '0.1s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    programTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    orgTitle: {
      marginBottom: 12,
      fontSize: 18,
    },
    location: {
      fontSize: 12,
      marginBottom: 12,
    },
    detail: {
      fontSize: 12,
      textAlign: 'right',
    },
    applicationWindow: {
      textAlign: 'right',
      fontSize: 12,
      fontWeight: 'bold',
    },
    actions: {
      justifyContent: "center",
    },
});

const ProgramCard = props => {
  const { data } = props;
  const classes = useStyles();
  if (!data || !data.location) return (<div>loading...</div>);
  return (
    <Link href={data.link} target="_blank" underline="none">
      <Card className={classes.card}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography className={classes.programTitle} color="textSecondary" gutterBottom>
                {data.programName}
              </Typography>
              <Typography className={classes.orgTitle} color="textSecondary">
                {data.orgName}
              </Typography>
              <Typography className={classes.location} color="textSecondary">
                {data.location.formatted}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box mb={2}>
                <Typography className={classes.detail} color="textSecondary">
                  {data.ageGroup.value.length > 0 && data.ageGroup.formatted}
                  {data.gradeBand.value.length > 0 && data.gradeBand.formatted}
                  {(data.ageGroup.value.length === 0 && data.gradeBand.value.length === 0) && data.ageGroup.formatted}
                </Typography>
                <Typography className={classes.detail} color="textSecondary">
                  {data.finances.isPaid ? data.finances.pay.formatted : data.finances.cost.formatted}
                </Typography>
                <Typography className={classes.detail} color="textSecondary">
                  {data.finances.aidAvailable && "Financial Aid Available"}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography className={classes.detail} color="textSecondary">
                  {data.lengths && data.lengths.text}
                </Typography>
                <Typography className={classes.detail} color="textSecondary">
                  {data.period}
                </Typography>
                {data.applicationWindow &&
                <div>
                <Typography className={classes.applicationWindow} color="textSecondary">
                  Application Window
                </Typography>
                <Typography className={classes.applicationWindow} color="textSecondary">
                  {data.applicationWindow}
                </Typography>
                </div>
                }
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className={classes.actions}>
          <Button
            size="small"
            className={classes.button}
            color="primary"
            // variant="contained"
          >
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Link>
  );
}

export default ProgramCard;