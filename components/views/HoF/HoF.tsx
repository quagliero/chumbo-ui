import React, { useEffect, useState } from 'react';
import Container from '../../layout/Container';
import styles from './HoF.module.css'
import hofers from './hofers';

const HoF = () => {
  const [ active, setActive ] = useState(hofers[hofers.length - 1]);

  return (
    <Container flush={true}>
      <section>
        <div className={styles.hofers}>
          {hofers.map((hofer) => (
            <article
              className={`${styles.hofer} ${active?.id === hofer.id ? styles['hofer--active'] : ''}`}
              onClick={() => setActive(hofers.find(x => x.id === hofer.id))}
            >
              <h3>{hofer.year}</h3>
              <img
                src={`/images/hof-${hofer.id}-action.jpg`}
                alt={hofer.name}
              />
            </article>
          ))}
        </div>
        <figure>
          {active && (
            <>
              <h3>{active.name} - {active.position}</h3>
              <h3>{active.year} inductee by {active.manager}</h3>
            </>
          )}
        </figure>
      </section>
    </Container>
  )
};

export default HoF;
