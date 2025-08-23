import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

/**
 * Component ShowSection
 * Hiển thị một section có thể mở rộng hoặc thu gọn
 *
 * @param {string} label - Tiêu đề của section
 * @param {boolean} show - Trạng thái hiện/ẩn nội dung
 * @param {function} onToggle - Callback khi click để thay đổi trạng thái show
 * @param {ReactNode} children - Nội dung bên trong section
 */
const ShowSection = ({ label, show, onToggle, children }) => (
    <div>
        {/* Nút tiêu đề, khi click sẽ gọi onToggle */}
        <button
            type="button"
            className="flex w-full items-center justify-between py-3 font-semibold text-lg border-b focus:outline-none"
            onClick={onToggle}
        >
            <span>{label}</span>
            {/* Icon mũi tên lên/xuống tùy trạng thái show */}
            <FontAwesomeIcon icon={show ? faChevronUp : faChevronDown} className="ml-2" />
        </button>

        {/* Nội dung chỉ hiển thị khi show = true */}
        {show && (
            <div className="pt-2 pb-4 text-gray-700">
                {children}
            </div>
        )}
    </div>
);

export default ShowSection;
