const formatNumber = (number) => {
  if (!number) return '';
  const numberString = number.toString();
  let formattedNumberString = '';
  let currentCount = 0;
  for (let i = numberString.length - 1; i >= 0; i--) {
    currentCount += 1;
    formattedNumberString += numberString[i];
    if (currentCount === 3) {
      currentCount = 0;
      if (i !== 0) formattedNumberString += ',';
    }
  }

  return formattedNumberString.split('').reverse().join('');
};

const defaultScrolls = {
  '10%': {
    type: '10%',
    items: [],
  },
  '30%': {
    type: '30%',
    items: [],
  },
  '60%': {
    type: '60%',
    items: [],
  },
  '70%': {
    type: '70%',
    items: [],
  },
  '100%': {
    type: '100%',
    items: [],
  },
  'etc': {
    type: 'etc',
    items: [],
  },
};

export const formatScrollData = (data) => {
  const scrolls = { ...defaultScrolls };
  for (const item of data) {
    const { search_item, p25, p50 } = item;
    const [firstWord, secondWord, ...rest] = search_item.split(' ');
    const percentage = rest[rest.length - 1];
    if (!firstWord || !secondWord) {
      continue;
    }

    const isScroll =
      firstWord.toLowerCase() === 'scroll' ||
      secondWord.toLowerCase() === 'scroll';

    if (!isScroll) {
      continue;
    }

    const isPercentage =
      scrolls[percentage] && Array.isArray(scrolls[percentage].items);
    if (isPercentage) {
      scrolls[percentage].items = [
        ...scrolls[percentage].items,
        {
          name: search_item,
          lowPrice: formatNumber(p25),
          midPrice: formatNumber(p50),
        },
      ];
    } else {
      scrolls['etc'].items = [
        ...scrolls['etc'].items,
        {
          name: search_item,
          lowPrice: formatNumber(p25),
          midPrice: formatNumber(p50),
        },
      ];
    }
  }

  return {
    scrolls: scrolls || defaultScrolls,
  };
};
