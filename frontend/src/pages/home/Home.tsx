import { useSnackbar } from '../../contexts';

export const Home = () => {
  const snackbar = useSnackbar();
  const testSnack = () => {
    snackbar.push('What have you done!?', () => console.log('undid'));
  };

  return <div>Welcome {localStorage.getItem('name')}.</div>;
};

export default Home;
