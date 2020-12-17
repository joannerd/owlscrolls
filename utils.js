export const notifications = {
  COPY_SHARE_LINK: 'Copy share link',
  COPIED: 'Copied!',
  REMOVE_SCROLL: 'Click on a scroll to remove it.',
  SAVE_SCROLL: 'Click on a scroll to save it.',
};

const toBinary = (string) => {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
};

const fromBinary = (binary) => {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
};

export const encodeIds = (ids) => window.btoa(toBinary(ids.join('|')));

export const decodeIds = (idString) => {
  const binaryIds = window.atob(idString);
  return fromBinary(binaryIds).split('|');
};

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
};

export const formatScrollData = (data) => {
  const allScrolls = {};
  const scrolls = { ...defaultScrolls };
  for (const item of data) {
    const { search_item, p25, p50 } = item;
    const [firstWord, secondWord, ...rest] = search_item.split(' ');
    if (!firstWord || !secondWord) {
      continue;
    }

    const isScroll =
      firstWord.toLowerCase() === 'scroll' ||
      secondWord.toLowerCase() === 'scroll';
    if (!isScroll) {
      continue;
    }

    const percentage = rest[rest.length - 1];
    const isPercentage =
      scrolls[percentage] && Array.isArray(scrolls[percentage].items);
    if (!isPercentage) {
      continue;
    }

    allScrolls[search_item] = {
      type: percentage,
      name: search_item,
      lowPrice: formatNumber(p25),
      midPrice: formatNumber(p50),
    };
  }

  for (const key in allScrolls) {
    const scroll = allScrolls[key];
    const percent = scroll.type;
    scrolls[percent].items = [...scrolls[percent].items, scroll];
  }

  return {
    scrolls: scrolls || defaultScrolls,
  };
};
