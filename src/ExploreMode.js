import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import Firestore from './services/firestore.js';
import './ExploreMode.css';
import GameCards from './gameCards.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  filterBar: {
    background: 'white',
  },
}));

function TabPanel(props) {
  return (<div hidden={props.value !== props.index}>{props.children}</div>)
}

function ExplorePage(props) {
  const classes = useStyles();
  const [trendingGrids, setTrendingGrids] = useState(null);
  const [recentGrids, setRecentGrids] = useState(null);
  const [followedGrids, setFollowedGrids] = useState(null);

  const [tabindex, setTabIndex] = React.useState(0);
  const changeTab = (event, index) => {
    setTabIndex(index);
  };

  const [user, setUser] = useState(props.user);
  useEffect(()=>{setUser(props.user)}, props.user);

  async function loadGrids() {
    const trendingGrids = user
      ? Firestore.get.trendingGridsForUser(user.id)
      : Firestore.get.trendingGridsForUnregisteredUser();
    trendingGrids.then((grids)=>{setTrendingGrids(grids);});

    const recentGrids = user
      ? Firestore.get.recentGridsForUser(user.id)
      : Firestore.get.recentGridsForUnregisteredUser();
    recentGrids.then((grids)=>{setRecentGrids(grids);});

    if (user) {
      Firestore.get.gridsFollowedForUser(user.id)
        .then((grids)=>{setFollowedGrids(grids);});
    }
  }
  // Todo: Cancel any incomplete promises in a cleanup callback.
  useEffect(()=>{loadGrids();}, [user]);

  return (
      <div className="Explore">
        <header className="Explore-header">
   <AppBar position="static" className={classes.filterBar}>
    <Tabs
        value={tabindex}
        onChange={changeTab}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Trending" />
        <Tab label="Recent" />
        { user ? <Tab label="Following" /> : <></> }
      </Tabs>
    </AppBar>
    <TabPanel value={tabindex} index={0}>
      <GameCards user={user} grids={trendingGrids} />
    </TabPanel>
    <TabPanel value={tabindex} index={1}>
      <GameCards user={user} grids={recentGrids} />
    </TabPanel>
    <TabPanel value={tabindex} index={2}>
      <GameCards user={user} grids={followedGrids} />
    </TabPanel>
    </header>
      </div>
  );
}

export default ExplorePage;
