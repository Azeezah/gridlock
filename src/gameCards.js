import React, { useState, useEffect } from 'react';
import SingleCard from './card.js';
import NewCard from './NewCard.js';
import BlankCard from './BlankCard.js';
import './gameCards.css';
import Firestore from './services/firestore.js';
import Authentication from './services/authentication.js';


function GameCards() {

  const [grid_list, setgridlist] = useState(null);
  const [user_grid_list, setUser_grid_list] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(load_grids, []);

  async function getCurrentUser() {
    const user = await Authentication.currentUser();
    if (user === null) { console.log("error or the user is not logged in"); return; }
    setCurrentUser(user);
  }

  async function load_grids() {
   const grids = await Firestore.get.trendingGridsForUnregisteredUser();
    // If grid is null, set it to an empty grid instead.

    const user =  getCurrentUser()
    setCurrentUser(user);
    if (grids === null || grids.length == 0) { console.log("failed to load grids");
      setgridlist(grids);
    return;
    }

    setgridlist(grids);
  }
  async function load_user_grids() {
   const grids = await Firestore.get.trendingGridsForUser();
    // If grid is null, set it to an empty grid instead.
    if(grids != null){
      console.log(grids);
    }
    setgridlist(user_grid_list);
  }

  console.log("grid_list", grid_list)
     return (
        <div className="Explore-body">
        <NewCard />
       {grid_list && grid_list.length ? "" :Array(8).fill().map(()=><BlankCard />)}
       {grid_list ? (grid_list).map(function(grid, key) {
          return < SingleCard
          name = {grid.title}
          author = {grid.creatorDisplayName}
          numberOfLikes = {grid.numberOfLikes}
          gridID = {grid.id}
          creatorID = {grid.creatorId}
          numberOfCompletes = {grid.numberOfCompletes}
          numberOfAttempts = {grid.numberOfAttempts}
          numberOfIncompletes = {grid.numberOfIncompletes}
          currentUser = {currentUser}
          />
        }) : " "}
      </div>

    );


}

export default GameCards;
