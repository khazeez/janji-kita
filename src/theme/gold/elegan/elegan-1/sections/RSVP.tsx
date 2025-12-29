'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGuestBook, insertMessages } from '@/models';
import supabase from '@/lib/supabase/client';
import { GuestBook } from '@/types/interface';

interface Props {
  invitationId: string;
}

export default function RSVP({ invitationId }: Props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<GuestBook[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ================= FETCH ================= */

  const fetchMessages = async () => {
    const res = await getGuestBook(invitationId);
    if (res.success && res.data) setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, [invitationId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  /* ================= RENDER ================= */

  return (
    <div className='relative'>
      {/* ================= FLOATING BUTTON ================= */}
      <button
        onClick={() => setIsOpen(true)}
        className='
          absolute bottom-6 right-4 z-40
          w-11 h-11 rounded-full
          bg-black/40 backdrop-blur
          border border-white
          flex items-center justify-center
        '
      >
        <MessageCircle className='text-white w-5 h-5' />
      </button>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay — TERIKAT KE DEVICE */}
            <motion.div
              className='absolute inset-0 z-40 bg-black/60'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal box */}
            <motion.div
              className='
                absolute inset-4 z-50
                bg-white rounded-2xl
                flex flex-col overflow-hidden
              '
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* Header */}
              <div className='bg-[#075E54] px-4 py-3 flex justify-between items-center'>
                <p className='text-white font-medium'>Doa & Ucapan</p>
                <button onClick={() => setIsOpen(false)}>
                  <X className='text-white' />
                </button>
              </div>

              {/* Messages */}
              <div className='flex-1 overflow-y-auto bg-[#E5DDD5] p-4 space-y-3'>
                {messages.map((msg) => (
                  <div key={msg.guestId} className='bg-white p-3 rounded-lg'>
                    <p className='font-semibold text-sm'>{msg.guestName}</p>
                    <p className='text-sm'>{msg.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className='p-3 border-t flex gap-2'>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='flex-1 border rounded-full px-4 py-2 text-sm'
                  placeholder='Tulis pesan...'
                />
                <button
                  disabled={isLoading}
                  className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center'
                  onClick={async () => {
                    if (!message.trim()) return;
                    setIsLoading(true);
                    await insertMessages({
                      invitationId,
                      guestName: 'Tamu',
                      attendanceStatus: 'ATTENDING',
                      guestCount: 1,
                      message,
                    });
                    setMessage('');
                    fetchMessages();
                    setIsLoading(false);
                  }}
                >
                  <Send className='text-white w-4 h-4' />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
