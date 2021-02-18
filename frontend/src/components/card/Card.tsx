import styles from './Card.module.css';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export default function Card(props: Props) {
  const className = [styles.Card, props.className].join(' ');

  return (
    <div {...props} className={className}>
      {props.children}
    </div>
  );
}
