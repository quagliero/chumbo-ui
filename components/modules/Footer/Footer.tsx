import React from 'react';
import Container from '../../layout/Container';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <Container>
      {'Made with ✌️ and ❤️ by the Commish'}
    </Container>
  </footer>
);

export default Footer;
