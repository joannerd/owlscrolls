import { useState, useEffect } from 'react';
import styles from '../../styles/Footer.module.css';

const Footer = ({ scrollTypes }) => {
  const [currentHash, setCurrentHash] = useState('');
  const resetCurrentHash = () => setCurrentHash('');
  const SAVED = 'saved';
  const getClassName = (isActive) => isActive ? styles.activeFooterLink : {};
  const iconLinks = [
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
