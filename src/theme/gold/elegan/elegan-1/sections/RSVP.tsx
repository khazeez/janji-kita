import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGuestBook, insertMessages } from '@/models';
import supabase from '@/lib/supabase/client';
import { GuestBook } from '@/types/interface';

export interface Props {
  invitationId: string;
}

export default function RSVP({ invitationId }: Props) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<GuestBook[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getNameFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');

    if (toParam) {
      // Replace + or %20 with space and capitalize each word
      return toParam
        .replace(/\+/g, ' ')
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
    }
    return '';
  };

  useEffect(() => {
    const nameFromURL = getNameFromURL();
    if (nameFromURL) {
      setName(nameFromURL);
    }
  }, []);

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-emerald-400 to-emerald-600',
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-orange-400 to-orange-600',
      'from-teal-400 to-teal-600',
      'from-indigo-400 to-indigo-600',
      'from-rose-400 to-rose-600',
      'from-cyan-400 to-cyan-600',
      'from-amber-400 to-amber-600',
    ];
    const hash = name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getNameColor = (name: string) => {
    const colors = [
      'text-emerald-600',
      'text-blue-600',
      'text-purple-600',
      'text-pink-600',
      'text-orange-600',
      'text-teal-600',
      'text-indigo-600',
      'text-rose-600',
      'text-cyan-600',
      'text-amber-600',
    ];
    const hash = name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const resetTime = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const msgDate = resetTime(messageDate);
    const todayDate = resetTime(today);
    const yesterdayDate = resetTime(yesterday);

    if (msgDate.getTime() === todayDate.getTime()) {
      return 'HARI INI';
    } else if (msgDate.getTime() === yesterdayDate.getTime()) {
      return 'KEMARIN';
    } else {
      return messageDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const groupMessagesByDate = (messages: GuestBook[]) => {
    const groups: { [key: string]: GuestBook[] } = {};

    messages.forEach((msg) => {
      const dateKey = formatMessageDate(msg.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  // ============================================
  // FETCH MESSAGES
  // ============================================

  const fetchMessages = async () => {
    try {
      const result = await getGuestBook(invitationId);

      if (result.success && result.data) {
        setMessages(result.data);
      } else {
        console.error('❌ Error fetching messages:', result.error);
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
    }
  };

  // ============================================
  // EFFECTS
  // ============================================

  // Fetch messages saat komponen pertama kali dimuat
  useEffect(() => {
    if (invitationId) {
      fetchMessages();
    }
  }, [invitationId]);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Realtime subscription untuk pesan baru
  useEffect(() => {
    if (!invitationId) return;

    const channel = supabase
      .channel(`guest-book-${invitationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'GUEST_BOOK',
          filter: `INVITATION_ID=eq.${invitationId}`,
        },
        (payload) => {
          console.log('📨 New message received:', payload);
          // Refresh messages saat ada insert baru
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId]);

  // Handle keyboard open/close untuk mobile
  useEffect(() => {
    if (!isOpen) return;

    const handleFocus = () => {
      setTimeout(() => {
        inputAreaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 300);
    };

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('focus', handleFocus);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('focus', handleFocus);
      });
    };
  }, [isOpen]);

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const handleSubmit = async () => {
    // Get name from URL parameter
    const guestName = getNameFromURL();

    if (!guestName.trim() || !message.trim()) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await insertMessages({
        invitationId,
        guestName: guestName.trim(),
        attendanceStatus: 'ATTENDING',
        guestCount: 1,
        message: message.trim(),
      });

      if (result.success) {
        console.log('✅ Message sent successfully');

        // Clear input
        setMessage('');

        // Refresh messages
        await fetchMessages();
      } else {
        console.error('❌ Error sending message:', result.error);
        alert(`Gagal mengirim pesan: ${result.error}`);
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ============================================
  // RENDER
  // ============================================

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setHasOpenedOnce(true);
        }}
        className='fixed top-6 lg:right-110 right-6 z-[100] group'
        aria-label='Buka doa dan ucapan'
      >
        <div className='relative'>
          <div className='absolute -inset-1'></div>
          <div className='relative bg-transparent border border-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110'>
            <MessageCircle className='w-6 h-6 text-white' strokeWidth={2} />
            {messages.length > 0 && !hasOpenedOnce && (
              <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold'>
                {messages.length > 99 ? '99+' : messages.length}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/60 z-[101]'
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='fixed inset-4 md:inset-8 lg:inset-16 z-[102] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden'
            >
              {/* Header */}
              <div className='bg-[#075E54] px-4 py-3 flex items-center justify-between flex-shrink-0'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-white/90 rounded-full flex items-center justify-center'>
                    <MessageCircle className='w-5 h-5 text-[#075E54]' />
                  </div>
                  <div>
                    <h2 className='text-white font-medium text-base'>
                      Doa & Ucapan
                    </h2>
                    <p className='text-white/80 text-xs'>
                      {messages.length} pesan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className='w-9 h-9 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors'
                  aria-label='Tutup'
                >
                  <X className='w-5 h-5 text-white' />
                </button>
              </div>

              {/* Messages Container */}
              <div
                className='flex-1 overflow-y-auto'
                style={{
                  backgroundColor: '#E5DDD5',
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D3D3D3' fill-opacity='0.05'%3E%3Cpath d='M0 0h50v50H0V0zm50 50h50v50H50V50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              >
                <div className='p-4 space-y-3'>
                  {messages.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-full min-h-[400px] text-center'>
                      <div className='w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mb-4 shadow-md'>
                        <MessageCircle className='w-10 h-10 text-[#075E54]' />
                      </div>
                      <p className='text-slate-600 text-lg font-medium'>
                        Belum ada pesan
                      </p>
                      <p className='text-slate-500 text-sm mt-1'>
                        Kirim ucapan dan doa terbaikmu!
                      </p>
                    </div>
                  ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date} className='space-y-2'>
                        {/* Date Separator */}
                        <div className='flex items-center justify-center my-4'>
                          <div className='bg-white/90 shadow-sm px-3 py-1.5 rounded-lg'>
                            <p className='text-xs font-medium text-gray-700'>
                              {date}
                            </p>
                          </div>
                        </div>

                        {/* Messages for this date */}
                        {msgs.map((msg) => (
                          <motion.div
                            key={msg.guestId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className='flex gap-2 items-start'
                          >
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(
                                msg.guestName
                              )} flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0`}
                            >
                              {msg.guestName.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex-1 max-w-[80%]'>
                              <div className='bg-white rounded-lg rounded-tl-none shadow-sm'>
                                <div className='px-3 pt-2 pb-1'>
                                  <p
                                    className={`font-semibold text-sm mb-1 ${getNameColor(
                                      msg.guestName
                                    )}`}
                                  >
                                    {msg.guestName}
                                  </p>
                                  <p className='text-gray-800 text-sm leading-relaxed break-words'>
                                    {msg.message || '-'}
                                  </p>
                                </div>
                                <div className='px-3 pb-1.5 flex justify-end'>
                                  <p className='text-[11px] text-gray-500'>
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                      'id-ID',
                                      {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div
                ref={inputAreaRef}
                className='bg-[#F0F0F0] border-t border-gray-300 p-3 flex-shrink-0'
              >
                <div className='space-y-2'>
                  {/* <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='Nama kamu...'
                    disabled={isLoading}
                    className='w-full px-4 py-2.5 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#075E54] text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                  /> */}
                  <div className='flex gap-2 items-end'>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder='Tulis pesan...'
                      rows={1}
                      disabled={isLoading}
                      className='flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#075E54] resize-none text-sm shadow-sm max-h-32 disabled:opacity-50 disabled:cursor-not-allowed'
                      style={{ minHeight: '44px' }}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!name.trim() || !message.trim() || isLoading}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 ${
                        name.trim() && message.trim() && !isLoading
                          ? 'bg-[#25D366] hover:bg-[#20BD5A]'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      aria-label='Kirim pesan'
                    >
                      {isLoading ? (
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <Send
                          className={`w-5 h-5 ${
                            name.trim() && message.trim()
                              ? 'text-white'
                              : 'text-gray-500'
                          }`}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
