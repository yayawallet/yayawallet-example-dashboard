import { useState, useEffect } from 'react';
import axios from 'axios';
import BuyAirTime from './BuyAirTime';
import BuyPackage from './BuyPackage';

const AirTime = () => {
  const [forSelf, setForSelf] = useState(true);
  const [ownPhoneNumber, setOwnPhoneNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('package');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/user/profile`)
      .then((res) => setOwnPhoneNumber(res.data.phone));
  }, []);

  useEffect(() => {
    if (forSelf) setErrorMessage('');
  }, [forSelf]);

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Top-up Air Time</h1>

      <div className="">
        <div className="border-2 rounded-lg p-2 px-5">
          <div className="flex gap-x-4 my-2 justify-end">
            <button
              className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${forSelf ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
              onClick={() => setForSelf(true)}
            >
              <input
                id="forSelf"
                type="radio"
                name="phone-number"
                className="w-4 h-4 cursor-pointer"
                checked={forSelf}
                onChange={() => setForSelf(true)}
              />
              <label htmlFor="forSelf" className="cursor-pointer">
                For Self
              </label>
            </button>

            <button
              className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${!forSelf ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
              onClick={() => setForSelf(false)}
            >
              <input
                id="forOther"
                type="radio"
                name="phone-number"
                className="w-4 h-4 cursor-pointer"
                checked={!forSelf}
                onChange={() => setForSelf(false)}
              />
              <label htmlFor="forOther" className="cursor-pointer">
                For Other
              </label>
            </button>
          </div>

          <div className="relative w-full mb-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <span>+251</span>
            </div>
            <input
              type="number"
              id="phone-number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-14 p-2.5 outline-none"
              placeholder="Phone number"
              value={forSelf ? ownPhoneNumber : phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.currentTarget.value);
                setForSelf(false);
                /(^09\d{8}$|^9\d{8}$)/.test(e.currentTarget.value)
                  ? setErrorMessage('')
                  : setErrorMessage('Invalid phone number');
              }}
            />
          </div>
          <span className="block text-red-600 text-sm pl-10">
            {errorMessage}
          </span>
        </div>

        <div className="flex gap-x-4 my-4 px-4a mb-10">
          <button
            className={`focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center ${selectedCategory == 'airtime' ? 'text-white bg-violet-600 hover:bg-violet-700 ' : 'text-violet-900 bg-white border-2 border-violet-600 hover:bg-violet-100'}`}
            onClick={() => setSelectedCategory('airtime')}
          >
            Buy Air Time
          </button>

          <button
            className={`focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center ${selectedCategory == 'package' ? 'text-white bg-violet-600 hover:bg-violet-700 ' : 'text-violet-900 bg-white border-2 border-violet-600 hover:bg-violet-100'}`}
            onClick={() => setSelectedCategory('package')}
          >
            Buy Package
          </button>
        </div>
      </div>

      {selectedCategory == 'airtime' ? (
        <BuyAirTime
          phoneNumber={phoneNumber}
          isInvalidNumber={errorMessage ? true : false}
        />
      ) : (
        <BuyPackage
          phoneNumber={phoneNumber}
          isInvalidNumber={errorMessage ? true : false}
        />
      )}
    </div>
  );
};

export default AirTime;
