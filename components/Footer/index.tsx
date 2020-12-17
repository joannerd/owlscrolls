import { useState, useEffect } from 'react';
import styles from '../../styles/Footer.module.css';

interface IFooterProps {
  scrollTypes: string[];
}

interface ILink {
  emoji: string;
  url: string;
}

const Footer = ({ scrollTypes }: IFooterProps): React.ReactElement => {
  const [currentHash, setCurrentHash] = useState<string>('');
  const resetCurrentHash = (): void => setCurrentHash('');
  const SAVED: Readonly<string> = 'saved';
  const getClassName = (isActive: boolean): string =>
    isActive ? styles.activeFooterLink : '';
  const iconLinks: ILink[] = [
    {
      emoji: '🍅',
      url: 'http://www.fruitscrollguide.ml/',
    },
    {
      emoji: '🦉',
      url: 'http://owlrepo.com/',
    },
    {
      emoji: '💻',
      url: 'https://github.com/joannerd',
    },
  ];

  useEffect(() => {
    setTimeout(resetCurrentHash, 3000);
  }, [currentHash]);

  return (
    <footer className={styles.footer}>
      <a
        key={SAVED}
        href={`#${SAVED}`}
        className={getClassName(currentHash === SAVED)}
        onClick={() => setCurrentHash(SAVED)}
      >
        {SAVED}
      </a>
      {scrollTypes.map((type) => (
        <a
          key={type}
          href={`#${type}`}
          className={getClassName(currentHash === type)}
          onClick={() => setCurrentHash(type)}
        >
          {type}
        </a>
      ))}
      {iconLinks.map(({ emoji, url }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={resetCurrentHash}
        >
          {emoji}
        </a>
      ))}
    </footer>
  );
};

export default Footer;
