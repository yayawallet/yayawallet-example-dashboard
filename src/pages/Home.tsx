import yayawallet from '../assets/yayawallet-brand.svg';

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 mt-20">
      <img src={yayawallet} alt="" className="w-1/4" />
      <p className="text-gray-600 lg:text-xl text-center">Welcome to YaYa Dashboard</p>
    </div>
  );
};

export default Home;
