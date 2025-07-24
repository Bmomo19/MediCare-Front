import SearchIcon from '@mui/icons-material/Search';

type Props = {
    type: string;
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    setValue?: (value: string) => void;
}

export const SearchInput = ({ type, placeholder, value, setValue, onChange }: Props) => {
    return (
        <div className="mt-1 relative">
            <input
                type={type}
                value={value}
                onChange={onChange ? onChange : (e) => setValue?.(e.target.value)}
                placeholder={placeholder}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
        </div>

    );
}