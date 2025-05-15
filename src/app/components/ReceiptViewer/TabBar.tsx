export default function TabBar({ options, selectedOption, setSelectedOption }: {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}) {
  return (
    <div className="flex flex-row gap-2">
      {options.map((option) => (
        <button
          key={option}
          className={`border border-dark-border rounded-full px-3 py-1 hover:bg-neutral-700 cursor-pointer ${selectedOption === option ? 'bg-neutral-700' : ''}`}
          onClick={() => setSelectedOption(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );

}