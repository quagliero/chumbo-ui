import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../elements/Logo';
import Button from '../../elements/Button';
import Container from '../../layout/Container';
import styles from './Header.module.css';

const Header = () => {

  const routes = [
    'Almanac',
    'History',
    'Drafts',
    'Trophies',
    'HoF',
  ];

  return (
    <header className={styles.header}>
      <Container>
        <nav className={styles.nav}>
          <Link href="/">
            <a className={styles.logo}>
              <Logo height="40"/>
            </a>
          </Link>
          <div className={styles.menu}>
            {routes.map((route) => (
              <Link href={`/${route.toLocaleLowerCase()}`}>
                {route}
              </Link>
            ))}
          </div>
          <div className={styles.extra}>
            <Link
              href="/wiki"
              passHref
            >
              <Button
                kind="secondary"
                component="a"
              >
                {'Wiki'}
              </Button>
            </Link>
            <Link
              href="https://sleeper.app/leagues/651106865610084352"
              passHref
            >
              <Button
                kind="primary"
                component="a"
                rel="noopener noreferrer"
                target="_blank"
              >
                {'League'}
              </Button>
            </Link>
            <a
              href="https://github.com/quagliero/chumbo"
              aria-label="Chumbo on GitHub"
              rel="noopener noreferrer"
              target="_blank"
              className={styles.icon}
            >
              <img
                src="/images/GitHub-Mark-120px-plus.png"
                alt="GitHub"
                height="24"
                width="24"
              />
            </a>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
