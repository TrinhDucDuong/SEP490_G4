import React, {useEffect, useState} from 'react';
import RatingStar from '../../../../components/ui/RatingStar/RatingStar';

const CommentCard = ({
                         starRate,
                         hasReply,
                         isVisible = true,
                         onReply,
                         onToggleVisibility,
                         onUpdateReply,
                         replies = []
                     }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editText, setEditText] = useState('');

    const [localIsVisible, setLocalIsVisible] = useState(isVisible);

    // Sync with prop changes
    useEffect(() => {
        setLocalIsVisible(isVisible);
    }, [isVisible]);

    const handleToggleVisibility = async () => {
        try {
            await onToggleVisibility(starRate.starRateId, localIsVisible);
            setLocalIsVisible(!localIsVisible);
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReplySubmit = async () => {
        if (replyText.trim()) {
            try {
                await onReply(starRate.starRateId, replyText);
                setReplyText('');
                setShowReplyInput(false);
            } catch (error) {
                console.error('Error submitting reply:', error);
            }
        }
    };

    const handleEditSubmit = async (replyId) => {
        if (editText.trim()) {
            try {
                await onUpdateReply(replyId, editText);
                setEditingReplyId(null);
                setEditText('');
            } catch (error) {
                console.error('Error updating reply:', error);
            }
        }
    };

    const startEdit = (reply) => {
        setEditingReplyId(reply.starRateId);
        setEditText(reply.comment);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 relative">
            {/* Visibility toggle - Moved to top right corner */}
            <button
                onClick={handleToggleVisibility}
                className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                title={localIsVisible ? "Ẩn đánh giá" : "Hiện đánh giá"}
            >
                {localIsVisible ? (
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                )}
            </button>

            {/* Notification badge for unread - Moved to top left corner */}
            {!hasReply && (
                <div className="absolute top-2 left-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center z-10">
                    <span className="text-white text-xs font-bold">!</span>
                </div>
            )}

            {/* Customer info */}
            <div className="flex items-start justify-between mb-4 pr-12">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                            {starRate.account.username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{starRate.account.username}</h4>
                        <p className="text-sm text-gray-600">{starRate.account.email}</p>
                        <p className="text-xs text-gray-500">ID Đánh Giá: {starRate.starRateId}</p>
                    </div>
                </div>
                <div className="text-right">
                    <RatingStar rating={starRate.starRate} size="sm" />
                    <p className="text-xs text-gray-500 mt-1">
                        {formatDate(starRate.createdAt)}
                    </p>
                </div>
            </div>

            {/* Product info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">{starRate.productVariant.productName}</h5>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Size: {starRate.productVariant.productSize}</span>
                    <div className="flex items-center space-x-1">
                        <span>Màu:</span>
                        <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: starRate.productVariant.color.colorHex }}
                        ></div>
                        <span>{starRate.productVariant.color.colorHex}</span>
                    </div>
                    <span>SL: {starRate.productVariant.quantity}</span>
                </div>
            </div>

            {/* Customer comment */}
            <div className="mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-800">{starRate.comment}</p>
                </div>
            </div>

            {/* Staff replies */}
            {replies.length > 0 && (
                <div className="ml-8 space-y-3 mb-4">
                    {replies.map((reply) => (
                        <div key={reply.starRateId} className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                            {reply.account.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-green-800">
                                        {reply.account.username}
                                    </span>
                                </div>
                                <button
                                    onClick={() => startEdit(reply)}
                                    className="text-xs text-green-600 hover:text-green-800"
                                >
                                    Chỉnh sửa
                                </button>
                            </div>

                            {editingReplyId === reply.starRateId ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                                        rows="2"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditSubmit(reply.starRateId)}
                                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => setEditingReplyId(null)}
                                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-800">{reply.comment}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(reply.createdAt)}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Reply input */}
            {showReplyInput ? (
                <div className="ml-8 space-y-3">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập phản hồi của bạn..."
                        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleReplySubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Gửi phản hồi
                        </button>
                        <button
                            onClick={() => {
                                setShowReplyInput(false);
                                setReplyText('');
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <div className="ml-8">
                    <button
                        onClick={() => setShowReplyInput(true)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span>Phản hồi</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentCard;