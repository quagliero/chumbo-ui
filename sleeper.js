/**
 * This monolithic hack file takes scraped data that the `index.js`
 * script writes and turns it into sleeper friendly JSON
 * 
 * TODO:
 *  - "final roster"
 *  - winners bracket
 *  - losers bracket
 *  - draft
 *  - transactions
 */

const league =  require('./data/2012/league.json');
const users = require('./data/2012/users.json');
const rosters = require('./data/2012/rosters.json');
const playerData = require('./data/players.json');
const winners_bracket = require('./data/2012/winners_bracket.json');
const { writeFileSync } = require('fs');

const playerKeys = Object.keys(playerData);

const getOwnerByRosterId = (rosterId) => rosters.find(x => x.roster_id === rosterId);

const getUserByOwnerId = (ownerId) => users.find(x => x.user_id === ownerId);

const getUserByRosterId = (rosterId) => getUserByOwnerId(getOwnerByRosterId(rosterId)?.owner_id);

const getRosterByOwnerId = (ownerId) => rosters.find(x => x.owner_id === ownerId);

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

const createDecimalNumber = (x, y) => x + (y / 100);

const standings = rosters.map((roster) => {
  const user = getUserByOwnerId(roster.owner_id);
  return {
    team: user.metadata.team_name,
    manager: user.display_name,
    wins: roster.settings.wins,
    losses: roster.settings.losses,
    ties: roster.settings.ties,
    fpts: createDecimalNumber(roster.settings.fpts, roster.settings.fpts_against),
    fpts_against: createDecimalNumber(roster.settings.fpts_against, roster.settings.fpts_against_decimal),
  }
}).sort((a, b) => {
  if (a.wins === b.wins) {
    return a.fpts > b.fpts ? -1 : 1;
  }
  return b.wins - a.wins;
});


const roster = rosters[1].players.map((p) => {
  const player = getPlayerDetails(p);

  return {
    player_id: player.player_id,
    position: player.position,
    name: player.full_name || player.team
  }
});

if (process.env.build === 'matchups') {
  [2012].forEach((year) => {
    // Take scraped matchup data and replace player objects with player IDs
    [16].forEach((week) => {
      const matchups = require(`./data/${year}/matchups/${week}.json`);
      
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
          roster_id: getRosterByOwnerId(matchup.roster_id)?.roster_id || matchup.roster_id,
          starters,
          players,
        });
      });
  
      writeFileSync(`./data/${year}/matchups/${week}.json`, JSON.stringify(formattedMatchups), 'utf-8', (err) => {
        if (err) throw err;
        console.info(`${year} week ${week} matchups written to file`);
      });
  
      // @TODO get the final week rosters and update the 'rosters.json' with them
    });
  
  });
}

// winners_bracket.forEach((m) => {
//   if (m.t1_from?.w) {
//     console.log(`${getUserByRosterId(m.t1_from?.w)?.display_name} vs ${getUserByRosterId(m.t2_from?.w)?.display_name}`);
//   } else if (m.t1_from?.l) {
//     console.log(`${getUserByRosterId(m.t1_from?.l)?.display_name} vs ${getUserByRosterId(m.t2_from?.l)?.display_name}`);
//   } else {
//     console.log(`${getUserByRosterId(m.t1)?.display_name} vs ${getUserByRosterId(m.t2)?.display_name}`);
//   }
// })

// rosters.forEach((r) => {
//   console.log({
//     display_name: getUserByRosterId(r.roster_id).display_name,
//     rosterId: r.roster_id,
//   });
// });

// [2012].forEach((y) => {
//   [11].forEach((w) => {
//     const week = require(`./data/${y}/matchups/${w}.json`);

//     const grouped = week.reduce((acc, cur) => {
//       if (acc[cur.matchup_id]) {
//         acc[cur.matchup_id].push(cur)
//       } else {
//         acc[cur.matchup_id] = [cur];
//       }

//       return acc;
//     }, {});

//     Object.keys(grouped).forEach((key) => {
//       const matchup = grouped[key];

//       console.log(`
//         ${getUserByRosterId(matchup[0].roster_id)?.metadata.team_name} vs ${getUserByRosterId(matchup[1].roster_id)?.metadata.team_name}
//       `);
//     })
//   })
// })
