import rp from 'request-promise';
import pQueue from 'p-queue';
import cheerio from 'cheerio';
import ora from 'ora';
import chalk from 'chalk';
import * as r from 'ramda';
import Table from 'tty-table';
import cfonts from 'cfonts';
import fs from 'fs';
const spinner = ora();

// spinner.start('Parsing Chumbolone Data');

const urlBase = 'http://fantasy.nfl.com/league/874089/history';
const years = r.range(2012, r.inc(2020));
const currentWeek = 12;

const managers = [
  {
    id: 'thd',
    name: 'thd',
    teamName: 'King of Wishful Tinkering',
    userId: ['2820383'],
    teamId: '1',
    sleeper: {
      id: 77140390129844224,
    },
  },
  {
    id: 'jay',
    name: 'jay',
    teamName: 'Kansas City Chumps',
    crowns: 2,
    userId: ['2833865'],
    teamId: '2',
    sleeper: {
      id: 428943291145265152,
    },
  },
  {
    id: 'hadkiss',
    name: 'hadkiss',
    teamName: 'Bush Johnson',
    crowns: 1,
    userId: ['2839340'],
    teamId: '3',
    sleeper: {
      id: 337210029620883456,
    },
  },
  {
    id: 'fin',
    name: 'fin',
    teamName: 'Tha Dollar',
    crowns: 1,
    userId: ['2873481'],
    teamId: '4',
    sleeper: {
      id: 438629899490553856,
    },
  },
  {
    id: 'dix',
    name: 'dix',
    teamName: 'SIIBON',
    crowns: 2,
    userId: ['2886224', '6557238', '14118531'],
    teamId: '5',
    sleeper: {
      id: 337221174670938112,
    },
  },
  {
    id: 'ant',
    name: 'ant',
    teamName: 'Wolverhampton Wasters',
    crowns: 1,
    userId: ['2899570'],
    teamId: '6',
    sleeper: {
      id: 337297176361201664,
    },
  },
  {
    id: 'jimbo',
    name: 'jimbo',
    teamName: 'Jimbo\'s Chiefs',
    active: false,
    userId: ['576154'],
    teamId: {
      2012: '7',
    },
  },
  {
    id: 'kitch',
    name: 'kitch',
    teamName: 'The Roaches',
    userId: ['1245126'],
    teamId: '8',
    sleeper: {
      id: 77361676378587136,
    },
  },
  {
    id: 'karsten',
    name: 'karsten',
    teamName: 'Team EZ',
    active: false,
    userId: ['2725162'],
    teamId: {
      2012: '9',
    },
  },
  {
    id: 'rich',
    name: 'rich',
    teamName: 'Zaragoza\'s Zooting Zorro',
    userId: ['3832177'],
    teamId: '10',
    sleeper: {
      id: 337222928615612416,
    },
  },
  {
    id: 'brock',
    name: 'brock',
    teamName: 'The Disciples of Juan Carlos',
    active: false,
    userId: ['4205393'],
    teamId: {
      2013: '7',
      2014: '7',
      2015: '7',
    },
  },
  {
    id: 'htc',
    name: 'htc',
    userId: ['5045797'],
    teamName: '21st & Hine',
    teamId: '9',
    sleeper: {
      id: 337226046606704640,
    },
  },
  {
    id: 'sol',
    name: 'sol',
    userId: ['7344145'],
    teamName: 'The Unicorn',
    crowns: 1,
    teamId: {
      current: '7',
      2014: '11',
      2015: '11',
    },
    weeks: {
      2015: [1,2,3,4,5,6,7,8],
      2020: [1,2,3,4,5,6,7,9,10,11,12,13],
    },
    sleeper: {
      id: 411186928751230976,
    },
  },
  {
    id: 'chris',
    name: 'chris',
    teamName: 'Suh Suh Sudio',
    active: false,
    userId: ['3306975'],
    teamId: {
      2014: '12',
      2015: '12',
      2016: '12',
      2017: '12',
      2018: '12',
      2020: '7',
    },
    weeks: {
      2020: [8],
    },
  },
  {
    id: 'phil',
    name: 'phil',
    teamName: 'Consolation Prize',
    active: false,
    userId: ['7381941'],
    teamId: {
      2015: 11,
      2016: 11,
    },
    weeks: {
      2015: [9,10,11,12,13],
      2016: [1,2,3,4,5,6,7,8,9],
    },
  },
  {
    id: 'nick',
    name: 'nick',
    teamName: 'Catch-22',
    userId: ['2454671'],
    teamId: {
      current: '11',
      2016: '11',
    },
    weeks: {
      2016: [10,11,12,13],
    },
    sleeper: {
      id: 429243125446230016,
    },
  },
  {
    id: 'ryan',
    name: 'ryan',
    teamName: 'Pimpin Ain\'t Leesy', 
    userId: ['19850746'],
    teamId: {
      2019: '12',
      current: 12,
    },
    sleeper: {
      id: 359110473351696384,
    },
  }
];

// fs.writeFile('managers.json', JSON.stringify(managers), (err) => {
//   if (err) return console.log(err);
//   console.log('managers > managers.json');
// });

const formatNumber = (num) => Math.round(num * 1e2) / 1e2;

const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const getManager = (year, week, teamId) => r.find((manager) => {
  // has left and/or taken control of another team
  if (r.is(Object, manager.teamId)) {
    // was managing this team in this year
    if (manager.teamId[year] == teamId) {
      // was partially managing the team this year
      if (manager.weeks && manager.weeks[year]) {
        // was he managing the team this specific week?
        if (r.contains(week, manager.weeks[year])) {
          return true;
        } else {
          // no he was not
          return false;
        }
      }
    }

    // managed the team throughout this year
    if (manager.teamId[year] == teamId) {
      return true;
    }

    // took over a team and this is now his
    if (manager.teamId.current == teamId) {
      return true;
    }
  }

  // easy peasy, manager never left
  if (manager.teamId == teamId) {
    return true;
  }

  // no joy
  return false;
}, managers);


const parseWeek = (year, week, teams = {}) => new Promise((resolve) => {
  rp(`${urlBase}/${year}/schedule?scheduleDetail=${week}`).then((html) => {
    // spinner.info(`Fetching week ${week} results from ${year}`);
    const $ = cheerio.load(html);
    const $matchups = $('.scheduleContent .matchups > ul > li');
    const matchups = [];

    $matchups.each((i, el) => {
      const $matchup = $(el);
      const $team1 = $matchup.find($('.teamWrap-1 .teamTotal'));
      const $team2 = $matchup.find($('.teamWrap-2 .teamTotal'));
      const manager1 = getManager(year, week, $team1.attr('class').split('teamId-')[1]);
      const manager2 = getManager(year, week, $team2.attr('class').split('teamId-')[1]);

      const divisional = (
        year >= 2017 &&
        teams[manager1.id] && teams[manager2.id] &&
        teams[manager1.id].division === teams[manager2.id].division
      ) ? true : false;
      
      matchups.push([
        [
          manager1.id,
          Number($team1.text()),
        ],
        [
          manager2.id,
          Number($team2.text()),
        ],
        {
          week,
          year,
          divisional,
        }
      ]);
    });

    resolve(matchups);
  });
});

const DIVISION_MAP = {
  0: 0,
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 1,
  6: 2,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
  11: 3,
};

const parseRegularSeasonStandings = (year) => new Promise((resolve) => {
  spinner.info(`Fetching ${year} standings`);
  rp(`${urlBase}/${year}/standings?historyStandingsType=regular`).then((html) => {
    const standingsData = {};
    const managerQueue = new pQueue();
    const $ = cheerio.load(html);
    let $standings = $('#leagueHistoryStandings table tbody tr');
    
    // nfl.com seems to have a hidden double row of first team on division seasons
    if (year >= 2017) {
      $standings = $standings.slice(1,13);
    }

    const divisions = $('#leagueHistoryStandings .tableWrap h5').map((i, el) => {
      return $(el).text().split(':')[1].trim();
    });
    

    $standings.each((i, el) => {
      const $el = $(el);
      const teamHref = $el.find('.teamImageAndName a.teamName').attr('href');
      const teamId = teamHref.split('teamId=')[1];
      const teamName = $el.find('.teamName').text();
      const record = $el.find('.teamRecord').text().split('-');
      const division = divisions[DIVISION_MAP[i]];

      managerQueue.add(() => new Promise((mResolve) => {
        rp(`${urlBase}/${year}/owners`).then((html) => {
          const $ = cheerio.load(html);
          const $manager = $(`#leagueOwners tr.team-${teamId}`);
          const id = $manager.find('.userName').attr('class').split('userId-')[1];
          mResolve(id);
        });
      })).then((mId) => {
        const manager = r.find(r.propSatisfies(r.contains(mId), 'userId'), managers);

        standingsData[manager.id] = {
          id: manager.id,
          name: manager.teamName,
          wins: Number(record[0]),
          losses: Number(record[1]),
          ties: Number(record[2]),
          division: division,
        };
      });

    });

    managerQueue.onIdle().then(() => resolve(standingsData));
  });
});

// years.forEach(parseRegularSeasonStandings);

const parseTeamRoster = (team, year, week) => new Promise((resolve) => {
  rp(`${urlBase}/${year}/teamhome?teamId=${team}&week=${week}&statWeek=${week}&statType=weekStats`).then((html) => {
    const $ = cheerio.load(html);
    const $roster = $('.tableWrap table > tbody > tr');
    const rosterData = [];

    $roster.each((i, el) => {
      if (el.attribs.class.indexOf('odd') > -1 || el.attribs.class.indexOf('even') > -1) {
        // filter out bench, we only want starts
        // `player-20- seems to be used only on bench spots
        if (el.attribs.class.indexOf('player-20-') === -1) {
          const $player = $(el);
          rosterData.push({
            name: $player.find('.playerNameFull').text(),
            position: $player.find('.playerNameAndInfo > div > em').text().split(' - ')[0],
          });
        }
      }
    });
    resolve(rosterData);
  });
});

const rosterHistory = (yrs, team, title) => {
  let rosterRaw = {};
  let roster = {};
  const queue = new pQueue();

  yrs.forEach((year) => {
    r.range(1, 17).forEach((week) => {
      if (year === years[years.length - 1] && week >= currentWeek) {
        return false;
      }
      queue.add(() => parseTeamRoster(team, year, week)).then((data) => {
        rosterRaw[year] = rosterRaw[year] || {};
        rosterRaw[year][week] = data;
      });
    });
  });

  queue.onIdle().then(() => {
    if (Object.keys(rosterRaw).length === 0) {
      return false;
    }

    Object.keys(rosterRaw).forEach((year) => {
      Object.keys((rosterRaw[year])).forEach((week) => {
        rosterRaw[year][week].forEach((player) => {
          roster[player.name] = r.inc(r.defaultTo(0, roster[player.name]));
        });
      });
    });
    console.log(title);
    console.log(r.toPairs(roster).sort((a,b) => {
      if (a[1] > b[1]) {
        return -1;
      } else if (a[1] < b[1]) {
        return 1
      } else {
        return 0;
      }
    }));
  });
};

// rosterHistory(years, 1, 'THD');
// rosterHistory(years, 2, 'Jay');
// rosterHistory(years, 3, 'Hadkiss');
// rosterHistory(years, 4, 'Fin');
// rosterHistory(years, 5, 'Dix');
// rosterHistory(years, 6, 'Ant');
// rosterHistory(years, 7, 'Jimbo / Brock / Sol');
// rosterHistory(years, 8, 'Kitch');
// rosterHistory(years, 9, 'Karsten / HTC');
// rosterHistory(years, 10, 'Rich');
// rosterHistory([2014,2015,2016,2017,2018,2019,2020], 11, 'Sol / Nick');
// rosterHistory([2014,2015,2016,2017,2018,2019,2020], 12, 'Sudio / Ryan');

const makeOutcomeAmendments = (standings, years) => {
  // in here we apply all the hacks that take/give wins to the right
  // people based on times when managers left and others took over
  // if you leave through a season you are given L's for each remaining game
  // the team that takes over takes the 'actual' record from then on

  if (years.indexOf(2015) > -1) {
    // ammendment 1:
    // Sol leaves week 9 2015, forfeiting weeks 9-13 (5 games)
    standings.sol.forfeits = 5;
    // Phil joins week 9 2015, so the record of 2-6 that he inherited is removed from him and added to sol
    // Phil played 14 games total
    standings.sol.wins += 2;
    standings.sol.losses += (6 + 5); // 6 + 5 forfeits
    standings.phil.wins -= 2;
    standings.phil.losses -= 6;
  }

  if (years.indexOf(2016) > -1) {
    if (standings.phil) {
      // ammendment 2:
      // Phil leaves week 10 2016, forfeiting weeks 10-13 (4 games)
      standings.phil.forfeits = 4;
      // Wadlow joines week 10 2016, going 3-1, but the record of 3-6 at this point is phil's
      standings.phil.wins += 3;
      standings.phil.losses += (6 + 4); // 6 + 4 forfeits
    }
    standings.nick.wins -= 3;
    standings.nick.losses -= 6;
  }

  return standings;
};

const scrape = (yrs, title, tiers) => {
  const history = {};
  const cumulative = {};
  const queue = new pQueue();

  yrs.forEach((year) => {
    queue.add(() => parseRegularSeasonStandings(year)).then((data) => {
      history[year] = {
        standings: data,
      };
    }).then(() => {
      history[year].schedule = {};
      r.range(1, (year >= 2014 ? 14 : 15)).forEach((week) => {
        if (year === years[years.length - 1] && week >= currentWeek) {
          return false;
        }

        queue.add(() => parseWeek(year, week, history[year].standings)).then((data) => {
          history[year].schedule[week] = data;
        });
      });
    });
  });

  queue.onIdle().then(() => {
    if (Object.keys(history).length === 0) {
      return false;
    }

    // fs.writeFile('history.json', JSON.stringify(history), (err) => {
    //   if (err) return console.log(err);
    //   console.log('history > history.json');
    // });

    r.map((year) => {
      r.mapObjIndexed((stats, team) => {
        const tm = cumulative[team];
        if (tm) {
          cumulative[team].wins = r.add(tm.wins, stats.wins);
          cumulative[team].losses = r.add(tm.losses, stats.losses);
          cumulative[team].ties = r.add(tm.ties, stats.ties);
        } else {
          const mgr = managers.find((m) => m.id === team);
          cumulative[team] = {
            name: mgr.teamName,
            wins: Number(stats.wins),
            losses: Number(stats.losses),
            ties: Number(stats.ties),
            forfeits: 0,
            winPerc: 0,
            for: [],
            against: [],
            divWins: 0,
            divLosses: 0,
          };
        }
      }, year.standings);


      r.mapObjIndexed((matchups, week) => {
        r.map((matchup) => {
          if (cumulative[matchup[0][0]]) {
            const pfor = matchup[0][1];
            const pag = matchup[1][1];
            cumulative[matchup[0][0]].for.push(pfor);
            cumulative[matchup[0][0]].against.push(pag);

            if (matchup[2].divisional) {
              if (pfor > pag) {
                cumulative[matchup[0][0]].divWins += 1;
              } else {
                cumulative[matchup[0][0]].divLosses += 1;
              }
            }
          }
          if (cumulative[matchup[1][0]]) {
            const pfor = matchup[1][1];
            const pag = matchup[0][1];
            cumulative[matchup[1][0]].for.push(pfor);
            cumulative[matchup[1][0]].against.push(pag);

            if (matchup[2].divisional) {
              if (pfor > pag) {
                cumulative[matchup[1][0]].divWins += 1;
              } else {
                cumulative[matchup[1][0]].divLosses += 1;
              }
            }
          }
        }, matchups);
      }, year.schedule);
    })(history);
    

    const adjusted = makeOutcomeAmendments(cumulative, yrs);

    const averaged = r.map((team) => {
      const totalFor = team.for.reduce((prev, cur) => prev + cur, 0);
      const totalAgainst = team.against.reduce((prev, cur) => prev + cur, 0);

      const total = (team.wins + team.losses + team.ties);
      const totalPlayed = total - team.forfeits;

      const winPerc = formatNumber((team.wins + (team.ties / 2)) / total * 100);
      const avgFor = formatNumber(totalFor / totalPlayed);
      const medianFor = formatNumber(median(team.for));
      const medianAgainst = formatNumber(median(team.against));
      const avgAgainst = formatNumber(totalAgainst / totalPlayed);

      return r.merge(team, {
        winPerc,
        for: formatNumber(totalFor),
        against: formatNumber(totalAgainst),
        avgFor,
        // medianFor,
        avgAgainst,
        // medianAgainst,
        divWins: formatNumber(team.divWins),
        divLosses: formatNumber(team.divLosses),
      });
    }, adjusted);

    const sorted = r.pipe(
      r.filter((team) => {
        // remove inactive teams
        if (tiers) {
          return ['karsten', 'phil', 'jimbo', 'brock', 'Disciples of Aaron Rodgers', 'chris', 'Suh Suh Sudio'].every((tm) => team.name !== tm);
        }

        return r.identity;
      }),
      r.values,
      r.sortWith([
        r.descend(r.prop('winPerc')),
        r.descend(r.prop('avgFor')),
        r.descend(r.prop('avgAgainst')),
        r.descend(r.prop('wins')),
      ]),
    )(averaged);
    
    const tierList = r.map((team) => team.name, sorted);

    const tableData = r.map(r.pipe(
      r.values,
      r.remove(4,1),
    ), sorted);

    const table = new Table(
      [
        { value: 'Team', formatter: (value) => {
          const manager = managers.find((m) => m.teamName === value);

          if (tiers) {
            if (tierList.indexOf(value) >= 8) {
              value = chalk.white.bgRed(value);
            } else if (tierList.indexOf(value) >= 4) {
              value = chalk.white.bgBlue(value);
            } else {
              value = chalk.white.bgGreen(value);
            }
          }

          // identify inactive teams
          if (manager.active === false) {
            value = chalk.white.cyan(`${value} (X)`);
          }

          // add crowns
          if (manager.crowns && !tiers) {
            value = manager.teamName.concat(` ${'🏆'.repeat(manager.crowns || 0)}`);
          }

          return value;
        } },
        { value: 'Wins', },
        { value: 'Losses' },
        { value: 'Ties' },
        { value: '%' },
        { value: 'For' },
        { value: 'Against' },
        { value: 'Div Wins' },
        { value: 'Div Loses' },
        { value: 'Avg. For' },
        // { value: 'Median For' },
        { value: 'Avg. Against' },
        // { value: 'Median Against' },
      ],
      tableData,
      {
        align: 'left',
      }
    );

    cfonts.say(`\n${title}`, {
      font: 'chrome',
      align: 'center',
    });
    console.log(table.render());
  });

};

const allWeeks = () => years.map((year) => r.range(1, (year >= 2014 ? 14 : 15)).map((week) => {
  if (year === years[years.length - 1] && week >= currentWeek) {
    return null;
  }
  return parseWeek(year, week);
}));

const getWeek = (week) => years.map((year) => {
  // we don't play reg season games in week 14 after the 2013 season
  // and don't get a week we havne't played yet
  if (year >= 2014 && week >= 14 || (year === years[years.length - 1] && week >= currentWeek)) {
    return [];
  }

  return parseWeek(year, week);
});

const getWeekRecord = (week) => Promise.all(getWeek(week)).then((years) => {
  cfonts.say(` Week ${week} performance`);
  const results = {};

  years.forEach((week) => {
    week.forEach((matchup) => {
      if (!results[matchup[0][0]]) {
        results[matchup[0][0]] = {
          name: matchup[0][0],
          wins: 0,
          losses: 0,
          ties: 0,
          for: 0,
          against: 0,
        };
      }
      if (!results[matchup[1][0]]) {
        results[matchup[1][0]] = {
          name: matchup[1][0],
          wins: 0,
          losses: 0,
          ties: 0,
          for: 0,
          against: 0,
        };
      }

      results[matchup[0][0]].for += matchup[0][1];
      results[matchup[0][0]].against += matchup[1][1];
      results[matchup[1][0]].for += matchup[1][1];
      results[matchup[1][0]].against += matchup[0][1];

      if (matchup[0][1] > matchup[1][1]) {
        // home win
        results[matchup[0][0]].wins += 1;
        results[matchup[1][0]].losses += 1;
      }
      if (matchup[0][1] < matchup[1][1]) {
        // away win
        results[matchup[0][0]].losses += 1;
        results[matchup[1][0]].wins += 1;
      }
      if (matchup[0][1] == matchup[1][1]) {
        // tie
        results[matchup[0][0]].ties += 1;
        results[matchup[1][0]].ties += 1;
      }
    });
  });

  const sorted = r.values(results).map((team) => {
    const total = team.wins + team.losses + team.ties;
    return Object.assign({}, team, {
      winPerc: formatNumber((team.wins + (team.ties / 2)) / total * 100),
      for: formatNumber(team.for / total),
      against: formatNumber(team.against / total),
    });
  })
    .filter((team) => ['karsten', 'phil', 'brock', 'Disciples of Aaron Rodgers', 'jimbo', 'chris', 'Suh Suh Sudio'].every((tm) => team.name !== tm))
    .sort((a, b) => {
      if (a.winPerc > b.winPerc) {
        return -1;
      }

      if (a.winPerc < b.winPerc) {
        return 1;
      }

      if (a.for > b.for) {
        return -1;
      }

      if (a.for < b.for) {
        return 1;
      }
      
      return 0;
    });

  const tableData = r.values(r.map(r.values, sorted));

  const table = new Table(
    [
      { value: 'Team' },
      { value: 'Wins', },
      { value: 'Losses' },
      { value: 'Ties' },
      { value: 'For' },
      { value: 'Against' },
      { value: '%' },
    ],
    tableData,
    {
      align: 'left',
    }
  );

  console.log(table.render());
});

const getHeadToHead = (a, b) => Promise.all(r.filter(r.identity, r.flatten(allWeeks()))).then((gameWeeks) => {
  const results = [];
  const details = {
    [a]: {
      wins: 0,
      losses: 0,
      ties: 0,
    },
    [b]: {
      wins: 0,
      losses: 0,
      ties: 0,
    },
  };
  gameWeeks.forEach((week) => {
    week.forEach((game) => {
      if (game[0][0] === a || game[1][0] == a) {
        if (game[0][0] === b || game[1][0] == b) {
          results.push(game);
        }
      }
    });
  });
  cfonts.say(`${a} vs ${b}`);
  results.forEach((result) => {
    if (result[0][1] > result[1][1]) {
      // home win
      details[result[0][0]].wins += 1;
      details[result[1][0]].losses += 1;
    }
    if (result[0][1] < result[1][1]) {
      // away win
      details[result[0][0]].losses += 1;
      details[result[1][0]].wins += 1;
    }
    if (result[0][1] == result[1][1]) {
      // tie
      details[result[0][0]].ties += 1;
      details[result[1][0]].ties += 1;
    }
  });

  results.forEach((game) => {
    console.log(`${game[0][0]} ${game[0][1]} - ${game[1][1]} ${game[1][0]} (Week ${game[2].week}, ${game[2].year})`);
  });
  let tie = (details[a].ties > 0) ? `(${details[a].ties} tie)` : '';
  console.log(`\nAll-time: ${a} ${details[a].wins} - ${details[b].wins} ${b} ${tie}`);
});

// [
//   [ 'thd', 'hadkiss' ],
//   [ 'ryan', 'rich' ],
//   [ 'jay', 'htc' ],
//   [ 'kitch', 'nick' ],
//   [ 'ant', 'dix' ],
//   [ 'sol', 'fin' ],
// ].forEach((matchup) => getHeadToHead(matchup[0], matchup[1]));

// getWeekRecord(11);
scrape(years, 'All-Time Records');
// scrape(r.slice(-1, Infinity, years), 'Tiers', true);
