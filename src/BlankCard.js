import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

//import  "./NewCard.css";

const useStyles = makeStyles({
  root: {
    maxWidth: 1000,
    background: '#ddd',
    cursor: 'progress',
  },
  media: {
    height: 40,
  },
});

function BlankCard() {
  const classes = useStyles();

  return (
    <Card className={`${classes.root} blankCard `}>
    <CardMedia  className={classes.media} />
    </Card>
  );
}

export default BlankCard;
