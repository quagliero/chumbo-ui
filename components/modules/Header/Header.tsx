import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Logo from '../../elements/Logo';
import Button from '../../elements/Button';
import Container from '../../layout/Container';
import styles from './Header.module.css';

const Header = () => {
  const router = useRouter();
  const pages = [
    'Almanac',
    'History',
    'Drafts',
    'Trophies',
    'HoF',
  ];

  return (
    <header className={styles.header}>
      <Container flush={true}>
        <nav className={styles.nav}>
          <Link href="/">
            <a className={styles.logo}>
              <Logo height="40"/>
            </a>
          </Link>
          <div className={styles.menu}>
            {pages.map((route) => {
              const href = `/${route.toLocaleLowerCase()}`;
              const activeClass = router.pathname === href ? styles['menu__link--active'] : '';

              return (
                <Link
                  key={route}
                  href={href}
                >
                  <a className={`${styles.menu__link} ${activeClass}`}>
                    {route}
                  </a>
                </Link>
              );
            })}
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
