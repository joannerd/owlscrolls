import { useRef, useState } from 'react';
import styles from '../../styles/ShareField.module.css';
import { notifications } from '../../utils';

const ShareField = ({ link }) => {
  const shareLinkRef = useRef();
  const [tooltipText, setTooltipText] = useState(notifications.COPY_SHARE_LINK);

  const copyLink = () => {
    const copyText = shareLinkRef.current;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setTooltipText(notifications.COPIED);
    setTimeout(() => setTooltipText(notifications.COPY_SHARE_LINK), 20000);
  };

  return (
    <div className={styles.tooltip} onClick={copyLink}>
      <input type="text" value={link} readOnly ref={shareLinkRef} />
      <span className={styles.linkIcon}>🔗</span>
      <span className={styles.tooltipText}>{tooltipText}</span>
    </div>
  );
};

export default ShareField;
