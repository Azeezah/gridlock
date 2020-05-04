import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

import  "./NewCard.css";
import  plusSign from "./plusSign.png";


const useStyles = makeStyles({
  root: {
    maxWidth: 1000,
    cursor: "pointer",
  },
  media: {
    height: 40,
  },
});

function NewCard({ name, author, gameLink, numberOfLikes }) {
  const classes = useStyles();

  return (
    <Card className={`${classes.root} newCard `} onClick={event => window.location.href='/create'}>
    <CardMedia  className={classes.media} />
      <img className="plusSign" src={plusSign} />
    </Card>
  );
}

export default NewCard;
