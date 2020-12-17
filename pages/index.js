import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import {
  encodeIds,
  decodeIds,
  formatScrollData,
  notifications,
} from '../utils';
import Footer from '../components/Footer/index';
import ScrollList from '../components/ScrollList/index';

const SAVED_OWL_SCROLLS = 'SAVED_OWL_SCROLLS';

const Home = ({ scrolls, scrollTypes }) => {
  const [allScrolls, setAllScrolls] = useState({});
  const [shareLink, setShareLink] = useState('');
  const [savedScrollIds, setSavedScrollIds] = useState([]);
  const savedScrolls = savedScrollIds.map((id) => allScrolls[id]);
  const savedScrollNames = savedScrollIds.map((id) => allScrolls[id].name);

  const updateSavedScrollIds = (ids) => {
    setSavedScrollIds(ids);
    const idString = encodeIds(ids);
    localStorage.setItem(SAVED_OWL_SCROLLS, idString);
    const url = location.origin + `/?saved=${idString}`;
    setShareLink(url);
  };

  const saveScroll = (id) => {
    if (savedScrollIds.includes(id)) return;
    const ids = [...savedScrollIds, id];
    updateSavedScrollIds(ids);
  };

  const removeSavedScroll = (id) => {
    const ids = savedScrollIds.filter((scrollId) => scrollId !== id);
    updateSavedScrollIds(ids);
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
    const localStorageIdString = localStorage.getItem(SAVED_OWL_SCROLLS);
    if (localStorageIdString) {
      const ids = decodeIds(localStorageIdString);
      updateSavedScrollIds(ids);
    }

    if (location.search) {
      const idString = location.search.split('?saved=')[1];
      const ids = decodeIds(idString);
      updateSavedScrollIds(ids);
    }

    return () => updateSavedScrollIds(savedScrollIds);
  }, []);

  const savedScrollsMessage = savedScrollIds.length
    ? notifications.REMOVE_SCROLL : notifications.SAVE_SCROLL;

  return (
    <div className={styles.container}>
      <Head>
        <title>Owl Scrolls</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Owl Scrolls!</h1>
        <section className={styles.lists}>
          <ScrollList
            key="saved"
            type="saved"
            items={savedScrolls}
            handleClick={removeSavedScroll}
            savedScrollsMessage={savedScrollsMessage}
            link={shareLink}
          />
          {scrolls.map(({ type, items }) => (
            <ScrollList
              key={type}
              type={type}
              items={items}
              handleClick={saveScroll}
              savedScrollNames={savedScrollNames}
            />
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
      scrolls: [],
      scrollTypes: [],
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
