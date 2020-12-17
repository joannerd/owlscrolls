import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import {
  encodeIds,
  decodeIds,
  formatScrollData,
  notifications,
} from '../lib/utils';
import Footer from '../components/Footer/index';
import ScrollList from '../components/ScrollList/index';
import { IScrollList, IScrolls, IScroll } from '../lib/types';

const SAVED_OWL_SCROLLS = 'SAVED_OWL_SCROLLS';

interface IHomeProps {
  scrolls: IScrollList[];
  scrollTypes: string[];
}

const Home = ({ scrolls, scrollTypes }: IHomeProps): React.ReactElement => {
  const [allScrolls, setAllScrolls] = useState<IScrolls>({});
  const [shareLink, setShareLink] = useState<string>('');
  const [savedScrollIds, setSavedScrollIds] = useState<string[]>([]);
  const savedScrolls: IScroll[] = savedScrollIds.map((id) => allScrolls[id]);
  const savedScrollNames: string[] = savedScrollIds.map(
    (id) => allScrolls[id].name
  );

  const updateSavedScrollIds = (ids: string[]): void => {
    setSavedScrollIds(ids);
    const idString = encodeIds(ids);
    localStorage.setItem(SAVED_OWL_SCROLLS, idString);
    const url = location.origin + `/?saved=${idString}`;
    setShareLink(url);
  };

  const saveScroll = (id: string): void | null => {
    if (savedScrollIds.includes(id)) return;
    const ids = [...savedScrollIds, id];
    updateSavedScrollIds(ids);
  };

  const removeSavedScroll = (id: string): void => {
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
    const localStorageIdString: string =
      localStorage.getItem(SAVED_OWL_SCROLLS) || '';
    if (localStorageIdString) {
      const ids: string[] = decodeIds(localStorageIdString);
      updateSavedScrollIds(ids);
    }

    if (location.search) {
      const idString: string = location.search.split('?saved=')[1];
      const ids: string[] = decodeIds(idString);
      updateSavedScrollIds(ids);
    }

    return () => updateSavedScrollIds(savedScrollIds);
  }, []);

  const savedScrollsMessage: string = savedScrollIds.length
    ? notifications.REMOVE_SCROLL
    : notifications.SAVE_SCROLL;

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

interface IStaticProps {
  props: IHomeProps;
}

export const getStaticProps = async (): Promise<IStaticProps> => {
  const res = await fetch(
    'https://storage.googleapis.com/owlrepo/v1/queries/search_item_index.json'
  );
  const data = await res.json();

  if (!data) {
    return {
      props: {
        scrolls: [],
        scrollTypes: [],
      },
    };
  }

  const { scrolls } = formatScrollData(data);
  return {
    props: {
      scrolls: Object.values(scrolls),
      scrollTypes: Object.keys(scrolls),
    },
  };
};

export default Home;
