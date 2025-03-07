import React from 'react';

const PrimaryRoundedButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className='bg-black border-black border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:opacity-80 active:opacity-60 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5'
      onClick={onClick}
    >
      Add a new task!
    </button>
  );
};

export default PrimaryRoundedButton;