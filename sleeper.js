/**
 * This monolithic hack file takes scraped data that the `index.js`
 * script writes and turns it into sleeper friendly JSON
 * 
 * TODO:
 *  - winners bracket
 *  - losers bracket
 *  - transactions
 */

const league =  require('./data/2012/league.json');
const playerData = require('./data/players.json');

const { writeFileSync } = require('fs');

const playerKeys = Object.keys(playerData);

const getOwnerByRosterId = (year, rosterId) => {
  const rosters = require(`./data/${year}/rosters.json`);

  return rosters.find(x => x.roster_id === rosterId);
}

const getUserByOwnerId = (year, ownerId) => {
  const users = require(`./data/${year}/users.json`);

  return users.find(x => x.user_id === ownerId);
}

const getUserByRosterId = (year, rosterId) => getUserByOwnerId(getOwnerByRosterId(year, rosterId)?.owner_id);

const getRosterByOwnerId = (year, ownerId) => {
  const rosters = require(`./data/${year}/rosters.json`);
  return rosters.find(x => x.owner_id === ownerId);
}

const getPlayerDetails = (p, pos) => {
  if (playerData[p]) {
    return playerData[p];
  }

  const attemptedMatch = playerKeys.find((k) => {
    if (playerData[k].full_name === p && playerData[k].position === pos) {
      return true;
    }

    if (playerData[k].full_name === p) {
      return true;
    }

    return false;
  });

  if (playerData[attemptedMatch]?.length === 1) {
    return playerData[attemptedMatch];
  }

  return {
    full_name: p,
    position: pos,
  }
};

const getPlayerId = (name, position) => {
  let matchType = [];
  const attemptedMatch = playerKeys.filter((k) => {
    // only check positions we use
    const player = playerData[k];
    if (!league.roster_positions.includes(player.position)) {
      return false;
    }

    // Full(-ish) name and position match
    if (player.position === position) {
      if (player.full_name === name) {
        matchType.push('name and position');
        return true;
      }
      if (`${player.first_name} ${player.last_name}` === name) {
        // Handle DSTs who have first_name: City, last_name: nickname
        matchType.push('DST');
        return true;
      }
      // Handle names that contain everything, e.g. Robert Griffin III = Robert Griffin
      if (name.includes(player.full_name)) {
        matchType.push('name includes full_name');
        return true;
      }
    }

    // Partial
    if (player.full_name === name) {
      matchType.push('name only');
      return true;
    }

    return false;
  });

  if (attemptedMatch.length > 1) {
    console.warn(`Matched ${name} multiples times: ${matchType.join(', ')}`, {
      attemptedMatch,
      name,
      position,
    });
  }
  
  if (attemptedMatch.length === 1) {
    console.info(`Matched ${name} by ${matchType.join('')}`, {
      attemptedMatch
    });
  }

  if (attemptedMatch.length === 0) {
    console.warn(`Couldn't match ${name} - ${position}`);
  }

  // Defer to highest ranked match
  return attemptedMatch[0] || name;
}

// USERS
const createUsersJson = (year) => {
  const users = require(`./raw_data/${year}/users.json`);

  writeFileSync(`./data/${year}/users.json`, JSON.stringify(users), 'utf-8', (err) => {
    if (err) throw err;
    console.log(`${year} users written to ./data/${year}/users.json`);
  })
}

// ROSTERS
const createRostersJson = (year) => {
  const roster = require(`./raw_data/${year}/rosters.json`);

  const formattedRoster = roster.map((team) => {
    const starters = [];
    const players = [];

    team.players.forEach((p) => {
      const playerId = getPlayerId(p.name, p.position);
      if (p.starter) {
        starters.push(playerId);
      }
      players.push(playerId);
    });

    return Object.assign(team, {
      players,
      starters,
    });
  });

  writeFileSync(`./data/${year}/rosters.json`, JSON.stringify(formattedRoster), 'utf-8', (err) => {
    if (err) throw err;
  });
  console.log(`${year} rosters written to ./data/${year}/rosters.json`);
}


// MATCHUPS
const createMatchupsJson = (year, weeks) => 
  // Take scraped matchup data and replace player objects with player IDs
  weeks.forEach((week) => {
    try {
      const matchups = require(`./raw_data/${year}/matchups/${week}.json`);

      const formattedMatchups = matchups.map((matchup) => {
        const starters = [];
        const players = [];
        matchup.players.forEach((m) => {
          const playerId = getPlayerId(m.name, m.position);
          if (m.starter) {
            starters.push(playerId);
          }
          players.push(playerId);
        });
        
        return Object.assign(matchup, {
          roster_id: getRosterByOwnerId(year, matchup.roster_id)?.roster_id || matchup.roster_id,
          starters,
          players,
        });
      });
  
      writeFileSync(`./data/${year}/matchups/${week}.json`, JSON.stringify(formattedMatchups), 'utf-8', (err) => {
        if (err) throw err;
      });
      console.info(`${year} week ${week} matchups written to ./data/${year}/matchups/${week}.json`);

    } catch (err) {
      console.error(err);
    }
  });


// PICKS
const createPicksJson = (year) => {
  const picks = require(`./raw_data/${year}/picks.json`);

  const formattedPicks = picks.map((p) => {
    const roster = getRosterByOwnerId(year, p.picked_by);
    const {
      round,
      pick_no,
      picked_by,
      draft_slot,
    } = p;

    return {
      round,
      pick_no,
      picked_by,
      draft_slot,
      player_id: getPlayerId(p.name, p.position),
      roster_id: roster.roster_id,
    };
  });

  writeFileSync(`./data/${year}/picks.json`, JSON.stringify(formattedPicks), 'utf-8', (err) => {
    if (err) throw err;
  })
  console.log(`${year} draft picks written to ./data/${year}/picks.json`);
};


// createPicksJson(2012);

const createJsonForYear = (year) => {
  createUsersJson(year);
  createRostersJson(year);
  createPicksJson(year);
  createMatchupsJson([ year ], [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
};

createJsonForYear(2013);












// LOGGING PLAYGROUND

const logWinnersBracket = (year) => {
  const winnersBracket = require(`./data/${year}/winners_bracket.json`);

  winnersBracket.forEach((m) => {
    if (m.t1_from?.w) {
      console.log(`${getUserByRosterId(m.t1_from?.w)?.display_name} vs ${getUserByRosterId(m.t2_from?.w)?.display_name}`);
    } else if (m.t1_from?.l) {
      console.log(`${getUserByRosterId(m.t1_from?.l)?.display_name} vs ${getUserByRosterId(m.t2_from?.l)?.display_name}`);
    } else {
      console.log(`${getUserByRosterId(m.t1)?.display_name} vs ${getUserByRosterId(m.t2)?.display_name}`);
    }
  })
};
  
const logWeeklyMatchups = (years, weeks) =>
  years.forEach((y) => {
    weeks.forEach((w) => {
      const week = require(`./data/${y}/matchups/${w}.json`);
  
      const grouped = week.reduce((acc, cur) => {
        if (acc[cur.matchup_id]) {
          acc[cur.matchup_id].push(cur)
        } else {
          acc[cur.matchup_id] = [cur];
        }
  
        return acc;
      }, {});
  
      Object.keys(grouped).forEach((key) => {
        const matchup = grouped[key];
  
        console.log(`
          ${getUserByRosterId(matchup[0].roster_id)?.metadata.team_name} vs ${getUserByRosterId(matchup[1].roster_id)?.metadata.team_name}
        `);
      })
    })
  });
