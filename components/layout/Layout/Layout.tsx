import Head from 'next/head'
import Footer from '../../modules/Footer';
import Header from '../../modules/Header';
import styles from './Layout.module.css';

export default function Layout({
  children,
  title = 'Chumbo Almanac',
  description,
}) {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=optional" rel="stylesheet"/>
      </Head>
      <Header/>
      <main className={styles.main}>
        {children}
      </main>

      <Footer/>
    </div>
  )
}
