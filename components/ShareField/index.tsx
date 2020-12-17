import { useRef, useState } from 'react';
import styles from '../../styles/ShareField.module.css';
import { notifications } from '../../utils';

interface IShareFieldProps {
  link: string;
};

const ShareField = ({ link }: IShareFieldProps): React.ReactElement => {
  const shareLinkRef = useRef<HTMLInputElement | null>(null);
  const [tooltipText, setTooltipText] = useState<string>(notifications.COPY_SHARE_LINK);

  const copyLink = () => {
    const copyText = shareLinkRef.current;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setTooltipText(notifications.COPIED);
    setTimeout(() => setTooltipText(notifications.COPY_SHARE_LINK), 2000);
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
