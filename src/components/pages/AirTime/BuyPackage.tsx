import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const packageCategories = [
  'One-Birr Package',
  'Good Morning',
  'Birthday Package',
  'Hourly & Daily Unlimited Package',
  'Internet',
  'Voice',
  'Voice Plus Internet',
  'Flexi,International Pack- Destination 1',
  'International Pack- Destination 2',
  'SMS Package',
  'Voice Flexi Local All Net Package',
];

const BuyPackage = () => {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState(packageCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedPackageAmount, setSelectedPackageAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/airtime/packages`, {
        phone: '+2519', // Ethio telecom packages
      })
      .then((res) => setPackages(res.data));
  }, []);

  useEffect(() => {
    if (packages.length === 0) return;

    const catgSet = new Set(packages.map((p) => p.category));
    setCategories(Array.from(catgSet));
  }, [packages]);

  const payForPackage = () => setOpenModal(true);

  const handleConfirm = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Modal
        openModal={openModal}
        onConfirm={handleConfirm}
        amount={selectedPackageAmount}
      />
      <div className="flex gap-6 border-2 rounded-lg p-5">
        <div className="flex flex-col gap-y-3">
          {categories.map((c) => (
            <div
              className={`border border-violet-200 rounded-lg text-violet-900 font-semibold w-40 p-2 py-4 flex justify-center text-center hover:bg-violet-50 cursor-pointer ${selectedCategory == c ? 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700' : ''}`}
              key={c}
              onClick={() => setSelectedCategory(c)}
            >
              <span>{c}</span>
            </div>
          ))}
        </div>

        {packages.length > 0 ? (
          <div className="h-full sticky top-3">
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              {packages
                .filter((pkg) =>
                  !selectedCategory ? pkg : pkg.category == selectedCategory
                )
                .map((pkg) => (
                  <div
                    key={pkg.code}
                    className={`border border-violet-200 rounded-lg w-[19.5rem] px-3 py-2 flex flex-col justify-between cursor-pointer ${selectedPackage === pkg.code ? 'bg-violet-100 hover:bg-violet-100 ring-4 ring-violet-300' : 'hover:bg-violet-50'}`}
                    onClick={() => {
                      setSelectedPackage(pkg.code);
                      setSelectedPackageAmount(pkg.amount);
                    }}
                  >
                    <span>{pkg.name.replace(/:\s\d+\sBirr$/, '')}</span> <br />
                    <span className="inline-block pt-2i text-lg text-violet-900 font-bold">
                      {pkg.amount} ETB
                    </span>
                  </div>
                ))}
            </div>
            <button
              className="block mx-auto mt-10 text-white gap-x-2 bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg w-full sm:max-w-56 px-5 py-2 text-center cursor-pointer"
              disabled={!selectedPackage}
              onClick={payForPackage}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="h-full w-full flex justify-center mt-20">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPackage;
