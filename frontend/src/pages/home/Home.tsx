export const Home = () => {
  return <div>Welcome {localStorage.getItem('name')}.</div>;
};

export default Home;
