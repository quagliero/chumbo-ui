import React from 'react';
import Logo from '../../elements/Logo';
import Container from '../../layout/Container';
import styles from './Home.module.css';

const year = new Date().getFullYear() - 2012;

const Home = () => (
  <article className={styles.home}>
    <Container>
      <h1>The greatest fantasy football league on Earth</h1>
      {/* <div className={styles.logo}>
        <Logo width="120"/>
      </div> */}
      <h3>{`Now in its `}<span>{year + 1}<sup>th</sup></span> magical season.</h3>
      <h4>With <span>686</span> games played, over <span>130,000</span> points scored, <span>7</span> different champions, and <span>1</span> <s>corrupt</s> benevolent Commissioner.</h4>
    </Container>
  </article>
);

export default Home;
