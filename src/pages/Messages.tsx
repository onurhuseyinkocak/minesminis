import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Send, Image as ImageIcon, Heart, Info } from 'lucide-react';
import InstagramSidebar from '../components/InstagramSidebar';
import './Messages.css';

interface Thread {
  id: string;
  participant_one: string;
  participant_two: string;
  last_message_at: string;
  other_user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  last_message?: string;
}

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  media_url: string | null;
  is_read: boolean;
  created_at: string;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadThreads();
    }
  }, [user]);

  useEffect(() => {
    if (selectedThread) {
      loadMessages(selectedThread.id);
      const subscription = supabase
        .channel(`messages:${selectedThread.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${selectedThread.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadThreads = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('message_threads')
      .select(`
        *,
        messages(content, created_at)
      `)
      .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (!error && data) {
      const threadsWithUsers = await Promise.all(
        data.map(async (thread: any) => {
          const otherUserId = thread.participant_one === user.id
            ? thread.participant_two
            : thread.participant_one;

          const { data: userData } = await supabase
            .from('users')
            .select('id, display_name, avatar_url')
            .eq('id', otherUserId)
            .single();

          return {
            ...thread,
            other_user: userData,
            last_message: thread.messages?.[0]?.content
          };
        })
      );

      setThreads(threadsWithUsers);
    }
  };

  const loadMessages = async (threadId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
      markAsRead(threadId);
    }
    setLoading(false);
  };

  const markAsRead = async (threadId: string) => {
    if (!user) return;
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('thread_id', threadId)
      .neq('sender_id', user.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        thread_id: selectedThread.id,
        sender_id: user.id,
        content: newMessage.trim(),
        media_url: null
      });

    if (!error) {
      await supabase
        .from('message_threads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedThread.id);

      setNewMessage('');
      loadThreads();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <>
      <InstagramSidebar />
      <div className="messages-container">
        <div className="messages-layout">
          <div className="threads-sidebar">
            <div className="threads-header">
              <h2>{user.email}</h2>
            </div>
            <div className="threads-list">
              {threads.map(thread => (
                <div
                  key={thread.id}
                  className={`thread-item ${selectedThread?.id === thread.id ? 'active' : ''}`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="thread-avatar">
                    {thread.other_user?.avatar_url ? (
                      <img src={thread.other_user.avatar_url} alt="" />
                    ) : (
                      thread.other_user?.display_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="thread-info">
                    <div className="thread-name">{thread.other_user?.display_name}</div>
                    <div className="thread-last-message">{thread.last_message || 'Start chatting'}</div>
                  </div>
                </div>
              ))}
              {threads.length === 0 && (
                <div className="empty-threads">
                  <p>No messages yet</p>
                  <span>Start a conversation from a profile</span>
                </div>
              )}
            </div>
          </div>

          <div className="messages-main">
            {selectedThread ? (
              <>
                <div className="messages-header">
                  <div className="header-user">
                    <div className="header-avatar">
                      {selectedThread.other_user?.avatar_url ? (
                        <img src={selectedThread.other_user.avatar_url} alt="" />
                      ) : (
                        selectedThread.other_user?.display_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="header-name">{selectedThread.other_user?.display_name}</span>
                  </div>
                  <button className="info-btn">
                    <Info size={24} />
                  </button>
                </div>

                <div className="messages-body">
                  {loading ? (
                    <div className="loading">Loading messages...</div>
                  ) : (
                    <>
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}
                        >
                          <div className="message-bubble">
                            {message.content}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="messages-input">
                  <button className="input-action-btn">
                    <ImageIcon size={24} />
                  </button>
                  <button className="input-action-btn">
                    <Heart size={24} />
                  </button>
                  <input
                    type="text"
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-thread-selected">
                <div className="no-thread-icon">
                  <Send size={96} strokeWidth={1} />
                </div>
                <h3>Your Messages</h3>
                <p>Send private photos and messages to a friend or group.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
