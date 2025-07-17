import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ShowSection = ({ label, show, onToggle, children }) => (
    <div>
        <button
            type="button"
            className="flex w-full items-center justify-between py-3 font-semibold text-lg border-b focus:outline-none"
            onClick={onToggle}
        >
            <span>{label}</span>
            <FontAwesomeIcon icon={show ? faChevronUp : faChevronDown} className="ml-2" />
        </button>
        {show && (
            <div className="pt-2 pb-4 text-gray-700">
                {children}
            </div>
        )}
    </div>
);

export default ShowSection;
