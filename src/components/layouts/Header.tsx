import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="h-16 shadow-sm">
      <header className="flex justify-between px-4">
        <div className="self-end">{/* <BreadCrumbs /> */}</div>

        <ul className="flex text-lg ml-auto">
          <li className="hover:bg-blue-50 flex items-center">
            <Link to="/" className="font-semibold text-blue-800 p-4">
              YaYa Dashboard
            </Link>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Header;
