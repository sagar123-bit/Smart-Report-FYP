import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DELETE_CRIME_REPORT_ROOM,
    GET_CRIME_REPORT_ROOM_MESSAGES,
    GET_MY_CRIME_REPORT_ROOMS,
    UPLOAD_MESSAGE_FILE
} from '@/routes/serverEndpoint';
import { useLiveSocket } from '@/services/socketContext';
import axiosService from '@/utils/axiosService';
import {
    CheckCheck,
    Clock,
    Download,
    ExternalLink,
    File,
    Loader2,
    MessageSquare,
    MoreVertical,
    Paperclip,
    Search,
    Send,
    Trash2,
    User,
    X
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const ChatComponent = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state?.user || {});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [showChatMenu, setShowChatMenu] = useState(null);
  const { socket } = useLiveSocket();

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleIncomingMessage = (message) => {
      if (selectedChat && message.room === selectedChat._id) {
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.isTemp);
          return [...filtered, message];
        });
      }
      
      updateChatLastMessage(message.room, {
        body: message.body || (message.kind === 'image' ? '📷 Image' : message.kind === 'file' ? '📄 File' : ''),
        createdAt: message.createdAt,
        _id: message._id,
        kind: message.kind,
        mediaUrl: message.mediaUrl
      });
    };

    const handleSentAck = (data) => {
      setSendingMessage(false);
      setMessages(prev => prev.filter(msg => !msg.isTemp));
      
      if (selectedChat && data.room === selectedChat._id) {
        updateChatLastMessage(data.room, {
          body: data.body || (data.kind === 'image' ? '📷 Image' : data.kind === 'file' ? '📄 File' : ''),
          createdAt: data.createdAt,
          _id: data._id,
          kind: data.kind,
          mediaUrl: data.mediaUrl
        });
      }
    };

    const handleSendError = () => {
      toast.error('Failed to send message');
      setSendingMessage(false);
      setUploadingFile(false);
      setMessages(prev => prev.filter(msg => !msg.isTemp));
    };

    const handleRoomEntered = () => {
      console.log('Successfully joined room');
    };

    const handleRoomError = () => {
      toast.error('Failed to join chat room');
    };

    socket.on('incomingMessage', handleIncomingMessage);
    socket.on('sentAck', handleSentAck);
    socket.on('sendError', handleSendError);
    socket.on('roomEntered', handleRoomEntered);
    socket.on('roomError', handleRoomError);

    return () => {
      socket.off('incomingMessage', handleIncomingMessage);
      socket.off('sentAck', handleSentAck);
      socket.off('sendError', handleSendError);
      socket.off('roomEntered', handleRoomEntered);
      socket.off('roomError', handleRoomError);
    };
  }, [socket, user?._id, selectedChat]);

  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.emit('enterRoom', selectedChat._id);
      return () => {
        socket.emit('exitRoom', selectedChat._id);
      };
    }
  }, [socket, selectedChat]);

  const fetchUserChats = async () => {
    if (!user?._id) return;
    setLoadingChats(true);
    try {
      const response = await axiosService.get(
        `${GET_MY_CRIME_REPORT_ROOMS}/${user._id}`,
        { withCredentials: true }
      );
      if (response?.status === 200) {
        setChats(response.data.rooms || []);
        if (response.data.rooms.length > 0 && !selectedChat) {
          setSelectedChat(response.data.rooms[0]);
          fetchChatMessages(response.data.rooms[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchChatMessages = async (roomId) => {
    if (!roomId) return;
    setLoadingMessages(true);
    try {
      const response = await axiosService.get(
        `${GET_CRIME_REPORT_ROOM_MESSAGES}/${roomId}`,
        { withCredentials: true }
      );
      if (response?.data?.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchUserChats();
  }, [user?._id]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user || !socket) return;

    setSendingMessage(true);
    const tempMessageId = `temp_${Date.now()}`;
    const tempMessage = {
      _id: tempMessageId,
      from: {
        _id: user._id,
        userName: user.userName,
        userImage: user.userImage
      },
      room: selectedChat._id,
      kind: 'text',
      body: newMessage,
      createdAt: new Date(),
      isTemp: true
    };

    setMessages(prev => [...prev, tempMessage]);
    
    updateChatLastMessage(selectedChat._id, {
      body: newMessage,
      createdAt: new Date(),
      _id: tempMessageId,
      kind: 'text'
    });

    setNewMessage('');

    socket.emit('postMessage', {
      roomId: selectedChat._id,
      text: newMessage,
      type: 'text',
      sender: user._id
    });
  };

  const handleFileUpload = async (file) => {
    if (!file || !selectedChat || !user || !socket) return;
    
    const fileType = file.type.startsWith('image/') ? 'image' : 'file';
    setUploadingFile(true);
    
    const tempMessageId = `temp_${fileType}_${Date.now()}`;
    const tempMessage = {
      _id: tempMessageId,
      from: {
        _id: user._id,
        userName: user.userName,
        userImage: user.userImage
      },
      room: selectedChat._id,
      kind: fileType,
      body: '',
      mediaUrl: '',
      createdAt: new Date(),
      isTemp: true,
      isUploading: true
    };

    setMessages(prev => [...prev, tempMessage]);
    
    updateChatLastMessage(selectedChat._id, {
      body: fileType === 'image' ? '📷 Image' : '📄 File',
      createdAt: new Date(),
      _id: tempMessageId,
      kind: fileType
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await axiosService.post(
        UPLOAD_MESSAGE_FILE,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileProgress(progress);
          }
        }
      );

      if (uploadResponse.status === 200) {
        const fileUrl = uploadResponse.data.fileUrl;
        
        socket.emit('postMessage', {
          roomId: selectedChat._id,
          text: '',
          type: fileType,
          mediaUrl: fileUrl,
          sender: user._id
        });
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
      setMessages(prev => prev.filter(msg => msg._id !== tempMessageId));
    } finally {
      setUploadingFile(false);
      setFileProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchChatMessages(chat._id);
    setShowChatMenu(null);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await axiosService.delete(
        `${DELETE_CRIME_REPORT_ROOM}/${chatId}`,
        { withCredentials: true }
      );
      if (response?.status === 200) {
        toast.success(response?.data.message||'Chat deleted successfully');
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete chat');
    }
  };

  const getOtherParticipant = useCallback((chat) => {
    if (!chat?.participants || !user) return null;
    return chat.participants.find(participant => participant._id !== user._id);
  }, [user]);

  const updateChatLastMessage = (roomId, lastMessage) => {
    setChats(prev => prev.map(chat => 
      chat._id === roomId 
        ? { 
            ...chat, 
            lastChat: lastMessage, 
            updatedAt: new Date(),
            lastMessageTime: lastMessage.createdAt
          }
        : chat
    ));
  };

  const filteredChats = useMemo(() => {
    return chats
      .sort((a, b) => new Date(b.lastMessageTime || b.updatedAt) - new Date(a.lastMessageTime || a.updatedAt))
      .filter(chat => {
        if (!searchTerm.trim()) return true;
        
        const query = searchTerm.toLowerCase();
        const otherParticipant = getOtherParticipant(chat);
        const userName = otherParticipant?.userName?.toLowerCase() || '';
        const lastMessage = chat?.lastChat?.body?.toLowerCase() || '';
        const crimeType = chat?.relatedReport?.crimeType?.toLowerCase() || '';
        
        return userName.includes(query) || lastMessage.includes(query) || crimeType.includes(query);
      });
  }, [chats, searchTerm, getOtherParticipant]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMessageContent = (message) => {
    if (!message) return 'No messages yet';
    
    const content = message.body || (message.kind === 'image' ? '📷 Image' : message.kind === 'file' ? '📄 File' : '');
    
    if (content.length > 30) {
      return content.substring(0, 30) + '...';
    }
    return content;
  };

  const renderMessageContent = (message) => {
    if (message.kind === 'text') {
      return <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>;
    } else if (message.kind === 'image') {
      return (
        <div className="relative group">
          <img 
            src={`${import.meta.env.VITE_SERVER_URL}/${message.mediaUrl}`}
            alt="Shared image"
            className="rounded-lg max-w-xs max-h-64 object-cover cursor-pointer"
            onClick={() => window.open(`${import.meta.env.VITE_SERVER_URL}/${message.mediaUrl}`, '_blank')}
          />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-black/60 hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`${import.meta.env.VITE_SERVER_URL}/${message.mediaUrl}`, '_blank');
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-black/60 hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = `${import.meta.env.VITE_SERVER_URL}/${message.mediaUrl}`;
                link.download = `image-${Date.now()}.jpg`;
                link.click();
              }}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    } else if (message.kind === 'file') {
      return (
        <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
          <File className="h-5 w-5 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{message.mediaUrl.split('/').pop()}</p>
            <p className="text-xs text-gray-400">File</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              const link = document.createElement('a');
              link.href = `${import.meta.env.VITE_SERVER_URL}/${message.mediaUrl}`;
              link.download = message.mediaUrl.split('/').pop();
              link.click();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  if (loadingChats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Chats Yet</h2>
          <p className="text-gray-600 mb-6">Start a conversation by contacting someone</p>
          <Button onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row h-[calc(100vh-180px)]">
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600 text-sm mt-1">Chat with police officers</p>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredChats.map((chat) => {
                    const otherParticipant = getOtherParticipant(chat);
                    
                    return (
                      <div
                        key={chat._id}
                        onClick={() => handleSelectChat(chat)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 relative ${
                          selectedChat?._id === chat._id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage 
                                src={otherParticipant?.userImage 
                                  ? `${import.meta.env.VITE_SERVER_URL}/${otherParticipant.userImage}`
                                  : undefined
                                }
                                alt={otherParticipant?.userName}
                              />
                              <AvatarFallback>
                                {getUserInitials(otherParticipant?.userName)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">
                                {otherParticipant?.userName || 'Unknown User'}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(chat.lastMessageTime || chat.updatedAt)}
                              </span>
                            </div>
                            <div className="mb-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {chat?.relatedReport?.crimeType || 'No type'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {getMessageContent(chat.lastChat)}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowChatMenu(showChatMenu === chat._id ? null : chat._id);
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {showChatMenu === chat._id && (
                          <div className="absolute right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteChat(chat._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Chat
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            <div className="w-full md:w-2/3 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={getOtherParticipant(selectedChat)?.userImage 
                            ? `${import.meta.env.VITE_SERVER_URL}/${getOtherParticipant(selectedChat).userImage}`
                            : undefined
                          }
                          alt={getOtherParticipant(selectedChat)?.userName}
                        />
                        <AvatarFallback>
                          {getUserInitials(getOtherParticipant(selectedChat)?.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {getOtherParticipant(selectedChat)?.userName || 'Unknown User'}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {selectedChat?.relatedReport?.crimeType || 'No crime type specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ScrollArea 
                    ref={messagesContainerRef}
                    className="flex-1 p-4 bg-gray-50"
                  >
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="mb-2">No messages yet</p>
                        <p className="text-sm">Say hello to start the conversation</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isMe = message.from?._id === user?._id;
                          const isTemp = message.isTemp;
                          
                          return (
                            <div
                              key={message._id}
                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md ${
                                isMe ? 'ml-auto' : 'mr-auto'
                              }`}>
                                {!isMe && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-700">
                                      {message.from.userName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatTime(message.createdAt)}
                                    </span>
                                  </div>
                                )}
                                
                                <div className={`rounded-lg p-3 ${
                                  isMe 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                }`}>
                                  {renderMessageContent(message)}
                                  {isTemp && message.isUploading && (
                                    <div className="mt-2">
                                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-blue-400 transition-all duration-300"
                                          style={{ width: `${fileProgress}%` }}
                                        />
                                      </div>
                                      <p className="text-xs mt-1">
                                        Uploading {fileProgress}%
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                {isMe && (
                                  <div className="flex items-center justify-end gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                      {formatTime(message.createdAt)}
                                    </span>
                                    {isTemp ? (
                                      <Clock className="h-3 w-3 text-gray-400 animate-spin" />
                                    ) : (
                                      <CheckCheck className="h-3 w-3 text-blue-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile || !selectedChat}
                        className="flex-shrink-0"
                      >
                        {uploadingFile ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Paperclip className="h-5 w-5" />
                        )}
                      </Button>
                      
                      <div className="flex-1 relative">
                        <Input
                          type="text"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={!selectedChat || sendingMessage}
                          className="pr-12"
                        />
                        <Button
                          type="button"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || !selectedChat || sendingMessage}
                        >
                          {sendingMessage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p>Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;