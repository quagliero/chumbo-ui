import React from 'react';
import Container from '../../layout/Container';
import styles from './Wiki.module.css';

const Wiki = () => (
  <Container>
    <div className={styles.wiki}>
      <aside>
        <nav>
          <a href="#2020-covid-contingency">COVID (2020)</a>
          <a href="#tiers">Tiers</a>
          <a href="#division-selection">Division Selection</a>
          <a href="#draft-slot-selections">Draft Slot Selections</a>
          <a href="#draft-picks">Draft Picks</a>
          <a href="#draft-night">Draft Night</a>
          <a href="#waivers">Waivers</a>
          <a href="#scoring">Scoring</a>
          <a href="#transaction-locks">Transaction Locks</a>
          <a href="#playoffs-and-tiebreakers">Playoffs and Tiebreakers</a>
          <a href="#consolation-playoffs">Consolation Playoffs</a>
          <a href="#scumbo">Scumbo</a>
          <a href="#clauses">Clauses</a>
        </nav>
      </aside>
      <article>
        <h1 id="chumbo-wiki">Chumbo wiki</h1>
        <p>A place for all things Chumbo that get asked, answered, and then usually forgotten.</p>
        <blockquote>
          <h2 id="2020-covid-contingency">2020 Covid Contingency</h2>
          <h3 id="covid-ir-slots">IR Slots</h3>
          <p>For the 2020 season, each team will have 5 Covid IR slots to use. These can only contain players who have the &#39;covid&#39; IR tag designated. Once this tag is removed they can be placed onto your active roster, traded, or cut. This must happen within 24 hours, or before they play their next game, whichever is sooner. If the player still remains on your roster after the 24 hour period (or they play in a game), they will be manually dropped and you will be fined 5 WAB. Note that you can still trade/cut covid players before this window.</p>
          <h3 id="covid-tiers">Tiers</h3>
          <p>Any meaningful regular season games will count toward tiers and all-time rankings. Be it 1, or all 13, they will be used to calculate the tiering for 2021 season. If the season doesn&#39;t go ahead, the same tiers and divisions will roll on to 2021.</p>
          <h3 id="covid-draft-picks">Draft picks</h3>
          <p>If the 2020 season is cancelled, all draft pick trades will be reset and we will start the 2021 season with the draft slots as they were after the 2020 lottery.</p>
          <h3 id="covid-playoffs-trophies">Playoffs &amp; Trophies</h3>
          <p>In order for there to be a full and proper playoffs, at least 10 weeks of regular season games need to be played. If the season is cut short and we are unable to have the required number of games and a full playoff field, then the <em>interim</em> champ will be crowned as the team with the most wins, with points scored being the tiebreaker, then H2H. Same for the Scumbo but in reverse.</p>
        </blockquote>
        <h2 id="tiers">Tiers</h2>
        <p>The Chumbo runs an ongoing &#39;tiering&#39; process which is used to organise the <a href="#division-selection">division selection</a> for the following season. The 12 teams in the league are ordered best to worst by their win percentage over the previous 3 seasons, and then broken into 3 groups of 4 (Tier 1, 2 and 3). If win percentages are the same, the tie is broken by points scored. </p>
        <p>You need one full year in the league to qualify for the Tiers (during your inaugural season you will be locked into Tier 3).</p>
        <p>The Chumbo winner automatically gets placed in Tier 1 (at position 4 if they were not a Tier 1 team).</p>
        <p>The <a href="#scumbo">scumbo</a> automatically gets placed in Tier 3, this shift down results in every other team moving up 1 spot.</p>
        <h2 id="division-selection">Division selection</h2>
        <p>There are 4 divisions in the league and they each contain 3 teams. Each division is made up of one team from each of the tiers. Divisions are chosen in a standard draft order by the teams in Tier 1. There are no restrictions on whether you pick a team from Tier 2 or Tier 3 first, but you have to have one from each.</p>
        <p>Selection order is as follows:</p>
        <ol>
          <li>Tier 1.1</li>
          <li>Tier 1.2</li>
          <li>Tier 1.3</li>
          <li>Tier 1.4</li>
          <li>Tier 1.1</li>
          <li>Tier 1.2</li>
          <li>Tier 1.3</li>
          <li>Tier 1.4</li>
        </ol>
        <p>The division draft traditionally happens over a few days in March/April.</p>
        <h2 id="draft-slot-selections">Draft slot selections</h2>
        <p>The winner of the Consolation playoffs from the previous season holds the first draft slot selection, and the Scumbo is given the last. Selections 2 through 11 are done via a hat-pick lottery matching teams to draft slots during the NFL Draft. For ceremonial reasons, the order the remaining teams are drawn is done by the final standings of the previous season.</p>
        <p>Note that these are draft slot <em>selection</em> orders, and not the actual pick position. Once assigned your selection number, the official draft pick position takes place with each team taking it in turn (via their given draft slot selection) to choose from the available draft pick slots.</p>
        <p>These draft slots can be traded.</p>
        <h2 id="draft-picks">Draft picks</h2>
        <p>These can be traded, along with FAAB, for the current year only.</p>
        <h2 id="draft-night">Draft Night</h2>
        <p>The draft is the biggest night of the year and we do a live in-person event in which attendance is mandatory for all those within the country, and those outside the country take part via video call and the sleeper draft app.</p>
        <p>There is no hard time-limit on picks, we instead rely on heckling and peer pressure.</p>
        <h2 id="waivers">Waivers</h2>
        <p>Waivers are done using a FAAB system ($100) and run daily on Wednesday to Sunday at 12:05am (PST, so 7:05 or 8:05am UK depending on Dayligh Savings). All players are locked on Tuesdays. On Sundays, Mondays and Thursdays after the waivers run, all available players are Free Agents (in case last minute injuries or news force lineup changes).</p>
        <p>FAAB can be traded, and included in trades for draft picks and draft slots.</p>
        <h2 id="scoring">Scoring</h2>
        <p>The Chumbo uses standard scoring with the following caveats:</p>
        <h3 id="kicker">Kicker</h3>
        <ul>
          <li>+0.1 for each yard over 30 (e.g. 47 yard field goal scores 4.7)</li>
          <li>-1 for missed XP</li>
          <li>-1 for missed FG &lt; 30 yards</li>
        </ul>
        <h3 id="dst">DST</h3>
        <p>We have removed the scoring &#39;buckets&#39; where you&#39;d get 7 for conceding 0-6, 4 for conceding 7-13 etc and have instead opted for:</p>
        <ul>
          <li>-0.1 per point conceded (e.g., 31 points against = -3.1)</li>
          <li>+0.5 per TFL</li>
          <li>+1 per FF</li>
          <li>+1 per FR</li>
        </ul>
        <p>This scoring ends up being very similar to &#39;default&#39; over the course of a season, but means DSTs start on 0 (like any other player), and are rewarded for more skill based metrics (TFLs and FFs). Full scoring settings can be seen <a href="https://sleeper.app/leagues/521050726446252032">on sleeper</a>.</p>
        <h2 id="transaction-locks">Transaction locks</h2>
        <p>When your team has been mathematically eliminated from Chumbo Bowl, Scumbo Bowl, or Consolation Bowl contention, your roster is locked and you are unable to add/drop and make trades. You may only trade with teams who are eligible for the same bowl you are. i.e., A team eliminated from Chumbo Bowl contention cannot trade with a team who is still eligible.</p>
        <h2 id="playoffs-and-tiebreakers">Playoffs and tiebreakers</h2>
        <p>There are 6 playoff teams: All 4 division winners and 2 wildcards.</p>
        <p>Division tie breakers are done via:</p>
        <ol>
          <li>H2H</li>
          <li>Division Record</li>
          <li>Points For</li>
        </ol>
        <p>If all 3 teams are tied, the following tie breaker order is used to eliminate one team:</p>
        <ol>
          <li>Division Record</li>
          <li>Points For</li>
          <li>Points Against</li>
        </ol>
        <p>Division winners are seeded 1 through 4. Ordering for these seeds is done via:</p>
        <ol>
          <li>Points scored</li>
          <li>Points against (higher number wins), if this is somehow also a tie we are living in a simulation and go to</li>
          <li>H2H, if <em>that</em> was also a tie then we toss a coin with Commish calling it in the air.</li>
        </ol>
        <p>The wildcards, seeds 5 and 6, are the 2 remaining teams with the best records. Tie breaking and ordering for wildcard teams is done via the same method as ordering division winners.</p>
        <p>The top 2 seeds earn the bye in week 14.</p>
        <p>Playoff re-seeding occurs each week so the highest rank team always plays the lowest.</p>
        <p>In the event of a tie playoff game, the following tie breaker order is used to determine a winner:</p>
        <ol>
          <li>Touchdowns scored (in the matchup)</li>
          <li>Yards gained (in the matchup)</li>
          <li>Highest seed</li>
        </ol>
        <h2 id="consolation-playoffs">Consolation playoffs</h2>
        <p>The consolation playoff bracket competes for the right to own the first choice of draft slot selection in the following season. The 2 teams with the best records (seed 7 and 8) earn the bye in week 14. The losers of the 2 matches in Week 14 between seeds 9,10,11 and 12 will face off in Week 15 in the Scumbo Bowl.</p>
        <h2 id="scumbo">Scumbo</h2>
        <p>The loser of the consolation playoff bracket. Can only come from the bottom 4 seeds.</p>
        <p>The Scumbo is the epitomy of bad, and as such, they are punished by:</p>
        <ul>
          <li>Being placed in Tier 3 for the end of that season</li>
          <li>Given the last choice of draft slot for the following season</li>
        </ul>
        <h3 id="clauses">Clauses</h3>
        <ul>
          <li>Commissioner HD is the decision owner and ultimate arbiter of any disputes; this is a benevolent dictatorship.</li>
        </ul>
      </article>
    </div>
  </Container>
);

export default Wiki;
