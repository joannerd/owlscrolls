import React, { useState } from 'react';
import { formatNameId, unformatNameId } from '../../lib/utils';
import styles from '../../styles/SearchBar.module.css';

interface ISearchBarProps {
  scrollNames: string[];
}

const SearchBar = ({ scrollNames }: ISearchBarProps): React.ReactElement => {
  const searchItems: string[] = [...scrollNames];
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearchSubmit = (e): void => {
    e.preventDefault();
    window.location.hash = formatNameId(searchInput);
    getSearchResults('');
  };

  const handleSearchListClick = (e): void => {
    setSearchInput(e.target.innerText);
    window.location.hash = formatNameId(e.target.innerText);
    getSearchResults('');
  };

  const getSearchResults = (searchTerm: string): void => {
    if (searchTerm.length === 0) {
      setSearchResults([]);
      return;
    }

    const searchInputResults: string[] = searchItems.filter((formattedName) => {
      const potentialResult = formattedName;
      const term = formatNameId(searchTerm);
      return potentialResult.includes(term);
    });
    setSearchResults(searchInputResults);
  };

  const navigatePrevious = (e): void => {
    if (!e.target.previousSibling) return;
    e.target.previousSibling.focus();
  };

  const navigateNext = (e): void => {
    if (!e.target.nextSibling) return;
    e.target.nextSibling.focus();
  };

  const changeFocus = (e): void => {
    e.preventDefault();

    if (searchResults.length === 0) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        handleSearchListClick(e);
      case 'ArrowLeft':
        navigatePrevious(e);
        break;
      case 'ArrowUp':
        navigatePrevious(e);
        break;
      case 'ArrowRight':
        navigateNext(e);
        break;
      case 'ArrowDown':
        navigateNext(e);
        break;
      case 'Tab':
        navigateNext(e);
        break;
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSearchSubmit}>
        <button type="submit">🔍</button>
        <input
          autoFocus
          placeholder="Search for a scroll"
          onClick={() => (window.location.hash = '')}
          onChange={(e) => {
            setSearchInput(e.target.value);
            getSearchResults(e.target.value);
          }}
          type="search"
          autoComplete="off"
          value={searchInput}
        />
      </form>
      <ul
        onKeyDown={changeFocus}
        onClick={handleSearchListClick}
        className={searchResults.length ? styles.results : styles.hiddenResults}
      >
        {searchResults.map((formattedName) => (
          <li tabIndex={0} key={formattedName}>
            {unformatNameId(formattedName)}
          </li>
        ))}
      </ul>
    </>
  );
};

export default SearchBar;
