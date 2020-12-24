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
  let owner = rosters.find(x => x.owner_id === ownerId);

  // check for co_owner
  if (!owner) {
    owner = rosters.find(x => x.metadata?.co_owner?.owner_id === ownerId);
  }

  return owner;
}

const getPlayerDetails = (p, pos) => {
  if (playerData[p]) {
    return playerData[p];
  }

  const attemptedMatch = playerKeys.find((k) => {
    if (playerData[k].full_name === p && playerData[k].position === pos) {
      return true;
    }
    console.log(p);

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
  })
  console.log(`${year} users written to ./data/${year}/users.json`);
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
          user_id: matchup.roster_id,
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

// BRACKETS
const createBracketsJson = (year, type = 'championship') => {
  const fileName = type === 'consolation' ? 'losers_bracket' : 'winners_bracket';
  const bracket = require(`./raw_data/${year}/${fileName}.json`);

  const formattedBracket = bracket.map((b) => {
    const x = {
      r: b.round,
      m: b.matchup,
      w: getRosterByOwnerId(year, b.winner).roster_id,
      l: getRosterByOwnerId(year, b.loser).roster_id,
      t1: getRosterByOwnerId(year, b.team_1).roster_id,
      t2: getRosterByOwnerId(year, b.team_2).roster_id,
      p: b.p,
      t1_from: b.t1_from,
      t2_from: b.t2_from,
    }

    return x;
  });

  writeFileSync(`./data/${year}/${fileName}.json`, JSON.stringify(formattedBracket), 'utf-8', (err) => {
    if (err) throw err;
  });
  console.log(`${year} ${type} bracket written to ./data/${year}/${fileName}.json`);
}

// createBracketsJson(2013);
// createBracketsJson(2013, 'consolation');

// LEAGUE
const createLeagueJson = (year) => {
  const league = require(`./raw_data/${year}/league.json`);
  const formattedLeague = {
    status: 'post_season',
    sport: 'nfl',
    season_type: 'regular',
    season: league.season,
    name: league.name,
    draft_id: `chumbo_draft_${year}`,
    league_id: `chumbo_${year}`,
    previous_league_id: year > 2012 ? `chumbo_${year - 1}` : null,
    bracket_id: `chumbo_winners_bracket_${year}`,
    loser_bracket_id: `chumbo_losers_bracket_${year}`,
    settings: {
      playoff_type: 1,
      daily_waivers: 0,
      playoff_seed_type: 0,
      start_week: 1,
    },
  };

  Object.entries(league.settings).forEach(([ key, val ]) => {
    if (key === 'Divisions') {
      formattedLeague.settings.divisions = parseInt(val) || 0;
    } else if (key === 'Playoffs') {
      formattedLeague.settings.playoff_teams = parseInt(val.split('- ')[1]);
    } else if (key === 'Teams') {
      formattedLeague.total_rosters = Number(val);
      formattedLeague.settings.num_teams = Number(val);
    }
  });
  
  const positionMap = {
    'Quarterback:': 'QB',
    'Running Back:': 'RB',
    'Wide Receiver:': 'WR',
    'Tight End:': 'TE',
    'Wide Receiver / Running Back:': 'FLEX',
    'Kicker:': 'K',
    'Defensive Team:': 'DEF',
    'Bench:': 'BN',
  }
  formattedLeague.roster_positions = league.roster_positions.map((o) => {
    return Array(Number(o.value)).fill(positionMap[o.key]);
  }).flat();

  const formatScoring = (key, pointPer) => {
    let val;
    if (pointPer) {
      const [ points, yards ] = league.scoring_settings[key].split(' point per ');
      val = parseInt(points) / parseInt(yards);
    } else {
      val = parseInt(league.scoring_settings[key]);
    }

    if (val < 0){
      return val;
    }

    return val || 0;
  }

  formattedLeague.scoring_settings = {
    blk_kick: formatScoring('Blocked Kicks:'),
    def_2pt: formatScoring('Team Def 2-point Return:'),
    def_kr_td: formatScoring('Kickoff and Punt Return Touchdowns:'),
    def_pr_td: formatScoring('Kickoff and Punt Return Touchdowns:'),
    def_st_ff: formatScoring('Fumbles Forced:'),
    def_st_fum_rec: formatScoring('Fumbles Recovered:'),
    def_st_td: formatScoring('Touchdowns:'),
    def_td: formatScoring('Touchdowns:'),
    ff: formatScoring('Fumbles Forced:'),
    fgm_0_19: formatScoring('FG Made 0-19:'),
    fgm_20_29: formatScoring('FG Made 20-29:'),
    fgm_30_39: formatScoring('FG Made 30-39:'),
    fgm_40_49: formatScoring('FG Made 40-49:'),
    fgm_50p: formatScoring('FG Made 50+:'),
    fgmiss_0_19: formatScoring('FG Missed 0-19:'),
    fgmiss_20_29: formatScoring('FG Missed 20-29:'),
    fgmiss: formatScoring('FG Missed:'),
    fum_lost: formatScoring('Fumbles Lost:'),
    fum_rec: formatScoring('Fumbles Recovered:'),
    fum: 0.0,
    int: formatScoring('Interceptions:'),
    pass_2pt: formatScoring('2-Point Conversions:'),
    pass_int: formatScoring('Interceptions Thrown:'),
    pass_td: formatScoring('Passing Touchdowns:'),
    pass_yd: formatScoring('Passing Yards:', true),
    pts_allow_0: formatScoring('Points Allowed 0:'),
    pts_allow_1_6: formatScoring('Points Allowed 1-6:'),
    pts_allow_14_20: formatScoring('Points Allowed 14-20:'),
    pts_allow_21_27: formatScoring('Points Allowed 21-27:'),
    pts_allow_28_34: formatScoring('Points Allowed 28-34:'),
    pts_allow_35p: formatScoring('Points Allowed 35+:'),
    pts_allow_7_13: formatScoring('Points Allowed 7-13:'),
    rec_2pt: formatScoring('2-Point Conversions:'),
    rec_td: formatScoring('Receiving Touchdowns:'),
    rec_yd: formatScoring('Receiving Yards:', true),
    rec: formatScoring('Receptions:'),
    rush_2pt: formatScoring('2-Point Conversions:'),
    rush_td: formatScoring('Rushing Touchdowns:'),
    rush_yd: formatScoring('Rushing Yards:', true),
    sack: formatScoring('Sacks:'),
    safe: formatScoring('Safeties:'),
    st_ff: formatScoring('Fumbles Forced:'),
    st_fum_rec: formatScoring('Fumbles Recovered:'),
    st_td: formatScoring('Touchdowns:'),
    xpm: formatScoring('PAT Made:'),
    xpmiss: formatScoring('PAT Missed:'),
  };

  writeFileSync(`./data/${year}/league.json`, JSON.stringify(formattedLeague), 'utf-8', (err) => {
    if (err) throw err;
  });

  console.log(`${year} league data written to ./data/${year}/league.json`);
};

// createLeagueJson(2018);


// DRAFT
const createDraftJson = (year) => {
  const draft = require(`./raw_data/${year}/draft.json`);
  let draft_order = {};
  let slots_to_roster_id = {};

  draft.draft_order.forEach((id, i) => {
    try {
      const roster = getRosterByOwnerId(year, id);
      draft_order[id] = i + 1;
      slots_to_roster_id[i + 1] = roster.roster_id;
    } catch (err) {
      console.log(year, id);
    }
  });

  const formattedDraft = {
    type: 'snake',
    status: 'complete',
    start_time: new Date(`01/09/${year}`).getTime(),
    sport: 'nfl',
    season_type: 'regular',
    season: String(year),
    metadata: {
      scoring_type: 'std',
      name: `${year} Chumbo Draft`,
    },
    league_id: `chumbo_${year}`,
    settings: {
      teams: draft.draft_order.length,
      rounds: 15,
      slots_wr: 2,
      slots_te: 1,
      slots_rb: 2,
      slots_qb: 1,
      slots_k: 1,
      slots_flex: 1,
      slots_def: 1,
      slots_bn: 6,
      reversal_round: 0,
    },
    draft_order,
    slots_to_roster_id,
  };

  writeFileSync(`./data/${year}/draft.json`, JSON.stringify(formattedDraft), 'utf-8', (err) => {
    if (err) throw err;
  });
  console.log(`${year} draft info written to ./data/${year}/draft.json`);
};

// createDraftJson(2012);

// CREATE ALL DATA
const createJsonForYear = (year) => {
  createLeagueJson(year);
  createUsersJson(year);
  createRostersJson(year);
  // createDraftJson(year);
  // createPicksJson(year);
  createBracketsJson(year);
  createBracketsJson(year, 'consolation');
  createMatchupsJson([ year ], [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
};

// [2012,2013,2014,2015,2016,2017,2018,2019].forEach((y) => {
//   createRostersJson(y)
// })
// createJsonForYear(2019);

// const x = require('./data/2015/matchups/12.json');

// x.forEach((m) => {
//   console.log(m);
// })



// LOGGING PLAYGROUND

const formatNumber = (whole, decimal) => whole + (decimal / 100);

const logRecords = (years) => {
  let table = [];
  years.forEach((year) => {
    const y = require(`./data/${year}/rosters.json`);
  
  
    y.forEach((m) => {
      let team = table.find((z) => z.owner_id === m.owner_id);

      if (team) {
        team.wins += m.settings.wins;
        team.losses += m.settings.losses;
        team.ties += m.settings.ties;
        team.fpts += formatNumber(m.settings.fpts, m.settings.fpts_decimal);
        team.fpts_against += formatNumber(m.settings.fpts_against, m.settings.fpts_against_decimal);

        if (m.metadata.co_owner) {
          console.log(m.metadata.co_owner);
          team.losses -= m.metadata.co_owner.losses;
          team.wins -= m.metadata.co_owner.wins;
          team.ties -= m.metadata.co_owner.ties;
        }
      } else {
        const data = {
          owner_id: m.owner_id,
          name: getUserByOwnerId(year, m.owner_id).display_name,
          wins: m.settings.wins,
          losses: m.settings.losses,
          ties: m.settings.ties,
          perc: null,
          fpts: formatNumber(m.settings.fpts, m.settings.fpts_decimal),
          fpts_avg: null,
          fpts_against: formatNumber(m.settings.fpts_against, m.settings.fpts_against_decimal),
        };

        if (m.metadata.co_owner) {
          data.losses -= m.metadata.co_owner.losses;
          data.wins -= m.metadata.co_owner.wins;
          data.ties -= m.metadata.co_owner.ties || 0;
        }

        table.push(data);
      }
    });
  });
  
  console.table(table.map((x) => {
    return Object.assign(x, {
      perc: ((x.wins + (x.ties / 2)) / (x.wins + x.losses + x.ties) * 100).toFixed(2),
      fpts_avg: (x.fpts / (x.wins + x.losses + x.ties)),
    });
  }).sort((a,b) => b.perc - a.perc || b.wins - a.wins || b.fpts - a.fpts));
}

// logRecords([ 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]);

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
