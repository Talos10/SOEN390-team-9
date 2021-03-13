import { CircularProgress } from '@material-ui/core';
import styles from './Progress.module.css';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Progress = ({ className, ...props }: Props) => {
  return (
    <div {...props} className={`${styles.Progress} ${className ?? ''}`}>
      <CircularProgress />
    </div>
  );
};
