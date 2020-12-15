import Head from 'next/head'
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Home.module.css'
import { formatScrollData } from '../utils';

const SAVED_OWL_SCROLLS = 'SAVED_OWL_SCROLLS';
const colors = {
  '10%': 'gold',
  '30%': '#8C2F8C', // purple
  '60%': '#EE7342', // orange
  '70%': '#D6CECE', // grey
  '100%': '#A2DCF3', // light blue
  'etc': 'rgb(128, 87, 87)', // brown
};

const Footer = ({ scrollTypes }) => (
  <footer className={styles.footer}>
    <a key="saved" href="#saved">
      saved
    </a>
    {scrollTypes.map((type) => (
      <a key={type} href={`#${type}`}>
        {type}
      </a>
    ))}
    <a
      href="http://www.fruitscrollguide.ml/"
      target="_blank"
      rel="noreferrer"
    >
      🍅
    </a>
    <a href="http://owlrepo.com/" target="_blank" rel="noreferrer">
      🦉
    </a>
    <a href="https://github.com/joannerd" target="_blank" rel="noreferrer">
      💻
    </a>
  </footer>
);

const Home = ({ notFound, scrolls, scrollTypes }) => {
  const shareLinkRef = useRef();
  const [allScrolls, setAllScrolls] = useState({});
  const [myOwlScrollLink, setMyOwlScrollLink] = useState('');
  const [tooltipText, setTooltipText] = useState('Copy share link');
  const [savedScrollIds, setSavedScrollIds] = useState([]);
  const savedScrolls = savedScrollIds.map((id) => allScrolls[id]);

  const updateStorageScrollIds = (ids) => {
    const idString = ids.join(',');
    window.localStorage.setItem(SAVED_OWL_SCROLLS, idString);
  };

  const updateScrollLink = (ids) => {
    const idString = ids.join(',');
    const url = window.location.origin + `/?saved=${idString}`;
    setMyOwlScrollLink(url);
  };

  const saveScroll = (id) => {
    if (savedScrollIds.includes(id)) return;
    const ids = [...savedScrollIds, id];
    setSavedScrollIds(ids);
    updateStorageScrollIds(ids);
    updateScrollLink(ids);
  };

  const removeSavedScroll = (id) => {
    const ids = savedScrollIds.filter((scrollId) => scrollId !== id);
    setSavedScrollIds(ids);
    updateStorageScrollIds(ids);
    updateScrollLink(ids);
  };

  const copyShareScrollLink = () => {
    const copyText = shareLinkRef.current;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setTooltipText('Copied: ' + myOwlScrollLink);
  };

  useEffect(() => {
    const scrollDictionary = {};
    for (const list of scrolls) {
      for (const item of list.items) {
        const id = window.btoa(item.name);
        scrollDictionary[id] = item;
      }
    }
    setAllScrolls(scrollDictionary);
  }, []);

  useEffect(() => {
    const localStorageIdString = window.localStorage.getItem(SAVED_OWL_SCROLLS);
    if (localStorageIdString) {
      const ids = localStorageIdString.split(',');
      setSavedScrollIds(ids);
      updateScrollLink(ids);
    }

    if (window.location.search) {
      const [key, idString] = window.location.search.split('=');
      if (key.includes('saved')) {
        const ids = idString.split(',');
        setSavedScrollIds(ids);
        updateStorageScrollIds(ids);
        updateScrollLink(ids);
      }
    }

    return () => updateStorageScrollIds(savedScrollIds);
  }, []);

  if (notFound) {
    return <h1>Unable to fetch :(</h1>;
  }

  const isValidScrollLink =
    myOwlScrollLink && myOwlScrollLink[myOwlScrollLink.length - 1] !== '=';
  const savedScrollsMessage = savedScrollIds.length
    ? 'Click on a scroll to remove it.'
    : 'Click on a scroll to save it.';

  return (
    <div className={styles.container}>
      <Head>
        <title>Owl Scrolls</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Owl Scrolls!</h1>
        <section className={styles.lists}>
          <ul
            id="saved"
            key="saved-owl-scrolls"
            className={styles.list}
            style={{ borderColor: 'rgb(168, 228, 56)' }}
          >
            <h2>Saved Scrolls</h2>
            <h3 className={styles.savedTitle}>{savedScrollsMessage}</h3>
            {savedScrolls.map(({ name, lowPrice, midPrice }) => (
              <li
                key={`saved-${name}`}
                className={styles.card}
                onClick={() => removeSavedScroll(window.btoa(name))}
              >
                <h3>{name}</h3>
                <span>Low: {lowPrice}</span>
                <span>High: {midPrice}</span>
              </li>
            ))}
            {isValidScrollLink && (
              <div className={styles.tooltip} onClick={copyShareScrollLink}>
                <input
                  type="text"
                  value={myOwlScrollLink}
                  readOnly
                  ref={shareLinkRef}
                />
                <span className={styles.linkIcon}>🔗</span>
                <span className={styles.tooltipText}>{tooltipText}</span>
              </div>
            )}
          </ul>
          {scrolls.map(({ type, items }) => (
            <ul
              id={type}
              key={type}
              className={styles.list}
              style={{ borderColor: colors[type] }}
            >
              <h2 style={{ backgroundColor: colors[type] }}>{type}</h2>
              {items.map(({ name, lowPrice, midPrice }) => (
                <li
                  key={name}
                  className={styles.card}
                  onClick={() => saveScroll(window.btoa(name))}
                >
                  <h3>{name}</h3>
                  <span>Low: {lowPrice}</span>
                  <span>High: {midPrice}</span>
                </li>
              ))}
            </ul>
          ))}
        </section>
      </main>
      <Footer scrollTypes={scrollTypes} />
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    'https://storage.googleapis.com/owlrepo/v1/queries/search_item_index.json'
  );
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  const { scrolls } = formatScrollData(data);
  return {
    props: {
      scrolls: Object.values(scrolls),
      scrollTypes: Object.keys(scrolls),
    },
  };
}

export default Home;
