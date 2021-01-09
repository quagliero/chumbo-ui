import React, { useState } from 'react';
import Container from '../../layout/Container';
import styles from './HoF.module.css'
import hofers from './hofers';

const HoF = () => {
  const [ active, setActive ] = useState(hofers[hofers.length - 1]);

  return (
    <Container flush={true}>
      <article>
        <div className={styles.hofers}>
          {hofers.map((hofer) => (
            <figure
              className={`${styles.hofer} ${active?.id === hofer.id ? styles['hofer--active'] : ''}`}
              onClick={() => setActive(hofers.find(x => x.id === hofer.id))}
            >
              <h3>{hofer.year}</h3>
              <img
                src={`/images/hof-${hofer.id}-action.jpg`}
                alt={hofer.name}
              />
              <figcaption className={styles.figtext}>
                {active && (
                  <>
                    <h2>{hofer.name}</h2>
                    <h5>{hofer.position}</h5>
                    <h4>{hofer.manager}</h4>
                  </>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        <section className={styles.text}>
          {active && (
            <>
              <div>
                <h2>{active.name} - {active.position}</h2>
                <h3>{`Inducted by ${active.manager}`}</h3>
              </div>
              <blockquote>
                {active.blurb}
              </blockquote>
            </>
          )}
        </section>
      </article>
    </Container>
  )
};

export default HoF;
