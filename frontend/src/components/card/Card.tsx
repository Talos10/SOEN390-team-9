import styles from './Card.module.css';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Card = ({ className, ...props }: Props) => {
  return (
    <div {...props} className={`${styles.Card} ${className ?? ''}`}>
      {props.children}
    </div>
  );
};
