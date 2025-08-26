import React from 'react';
import { FaRobot, FaPhone, FaPhoneSlash, FaTimes } from 'react-icons/fa';
import { useAIAssistant } from '../../../../hooks/admin/useAIAssistant';
import ChatMessage from './ChatMessage';

const AIVoiceAssistant = ({ isOpen, onClose }) => {
    const {
        isRecording,
        isConnected,
        isInCall,
        isPlaying,
        isProcessing,
        error,
        chatHistory,
        audioLevel,
        startCall,
        endCall,
        endConversation,
        setError
    } = useAIAssistant();

    const handleEndConversation = () => {
        endConversation();
        onClose();
    };

    const handleRetryConnection = () => {
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay Background */}
            <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={onClose}
            />

            {/* Chat Window - FIXED BOTTOM RIGHT */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="bg-white rounded-lg shadow-2xl w-[360px] h-[500px] flex flex-col border">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaRobot size={18} />
                                </div>
                                {/* Connection status indicator */}
                                {isConnected && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                )}
                                {/* Call status indicator */}
                                {isInCall && (
                                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Trợ lý ảo của Quang Vinh</h3>
                                <p className="text-xs opacity-90">
                                    {isInCall ? (isRecording ? 'Đang nghe...' : 'Đang chờ...') :
                                        isConnected ? 'Sẵn sàng' : 'Đang kết nối...'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Main Call Button */}
                            <button
                                onClick={isInCall ? endCall : startCall}
                                disabled={isProcessing && !isInCall}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    isInCall
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-white hover:bg-blue-500 hover:text-white text-blue-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={isInCall ? 'Kết thúc cuộc gọi' : 'Bắt đầu cuộc gọi'}
                            >
                                {isInCall ? <FaPhoneSlash size={16} /> : <FaPhone size={16} />}
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Call Status Bar */}
                    {isInCall && (
                        <div className="px-4 py-2 bg-gray-100 text-xs border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-gray-700 font-medium">Cuộc gọi đang diễn ra</span>
                                </div>

                                {/* Voice Activity Indicator */}
                                {isRecording && (
                                    <div className="flex items-center space-x-1">
                                        <span className="text-red-600 text-xs">Đang thu âm</span>
                                        <div className="flex space-x-0.5">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 bg-red-500 rounded-full animate-pulse"
                                                    style={{
                                                        height: `${6 + audioLevel * 8}px`,
                                                        animationDelay: `${i * 0.1}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Processing Indicator */}
                                {isProcessing && (
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-blue-600 text-xs">Đang xử lý...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {/* Welcome message when no chat history */}
                        {chatHistory.length === 0 && !isInCall && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[280px]">
                                    <p className="text-sm text-gray-800 font-medium mb-2">xin chào</p>
                                    <div className="text-gray-600 text-sm">
                                        Chào bạn, rất vui được hỗ trợ bạn! Bạn có cần tìm hiểu thông tin về sản phẩm nào không?
                                        Hoặc bạn có câu hỏi nào khác mà tôi có thể giúp đỡ không? Xin mời bạn cứ chia sẻ nhé.
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Nhấn nút điện thoại để bắt đầu cuộc gọi voice
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Call Instructions */}
                        {isInCall && chatHistory.length === 0 && (
                            <div className="flex justify-center mb-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-center">
                                    <p className="text-blue-800 text-sm font-medium">Cuộc gọi đã bắt đầu</p>
                                    <p className="text-blue-600 text-xs mt-1">
                                        Hãy nói gì đó. Tôi sẽ tự động nghe và trả lời bạn.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Chat History */}
                        <div className="space-y-3">
                            {chatHistory.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}

                            {/* AI Processing indicator during call */}
                            {isProcessing && isInCall && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-sm text-gray-600">AI đang suy nghĩ...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* End Conversation Button - Only show when has chat history */}
                    {chatHistory.length > 0 && (
                        <div className="p-4 border-t bg-white">
                            <button
                                onClick={handleEndConversation}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                            >
                                <FaTimes size={14} />
                                <span>Kết thúc và xóa lịch sử</span>
                            </button>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 mx-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-red-600 text-sm flex-1">{error}</p>
                                    <button
                                        onClick={handleRetryConnection}
                                        className="ml-2 text-red-600 hover:text-red-800 text-xs underline flex-shrink-0"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AIVoiceAssistant;
