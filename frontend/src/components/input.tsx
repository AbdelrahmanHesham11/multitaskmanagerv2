
import React, { useState } from "react";
import clsx from "clsx";

interface InputProps {
  onAddTask: (title: string) => void;
}

export default function Input({ onAddTask }: InputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = () => {
    if (inputValue.trim()) {
      onAddTask(inputValue); // Pass the input value to the parent
      setInputValue(""); // Clear the input after adding
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div>
        <input
          className={clsx(
            "mt-3 block w-full rounded-lg border border-gray-600 bg-gray-800 py-1.5 px-3 text-sm text-white",
            "placeholder-gray-400 italic",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
          placeholder="Write something ..."
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <button
        className="mt-3 bg-black border-black border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:opacity-80 active:opacity-60 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5"
        onClick={handleAddTask}
      >
        Add a new task!
      </button>
    </div>
  );
}