import React, { useState, useEffect } from 'react';
import SingleCard from './card.js';
import NewCard from './NewCard.js';
import BlankCard from './BlankCard.js';
import './gameCards.css';

function GameCards(props) {
  const [grids, setGrids] = useState(props.grids);
  const [user, setUser] = useState(props.user);

  useEffect(()=>{setUser(props.user);}, [props.user])
  useEffect(()=>{setGrids(props.grids);}, [props.grids])

  return (
        <div className="Explore-body">
        <NewCard />
       {grids && grids.length ? "" :Array(8).fill().map(()=><BlankCard />)}
       {grids ? (grids).map(function(grid, key) {
          return < SingleCard
          name = {grid.title}
          author = {grid.creatorDisplayName}
          numberOfLikes = {grid.numberOfLikes}
          gridID = {grid.id}
          creatorID = {grid.creatorId}
          numberOfCompletes = {grid.numberOfCompletes}
          numberOfAttempts = {grid.numberOfAttempts}
          numberOfIncompletes = {grid.numberOfIncompletes}
          currentUser = {user||{}}
          />
        }) : " "}
      </div>

    );
}

export default GameCards;
