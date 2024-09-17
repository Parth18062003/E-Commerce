import React, { useEffect } from 'react';
import { CopyCheck, X } from 'lucide-react'
import { motion } from 'framer-motion';

type NotificationType = {
  id: number;
  text: string;
  type: 'info' | 'success' | 'error'; // Add types for different notification styles
};

const Notification = ({
  text,
  id,
  removeNotif,
  type,
}: NotificationType & { removeNotif: Function }) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [id, removeNotif]);

  // Define styles based on type
  const getStyle = (type: 'info' | 'success' | 'error') => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`p-2 flex items-start rounded gap-2 text-xs font-medium shadow-lg text-white ${getStyle(type)} pointer-events-auto`}
    >
      <CopyCheck className="mt-0.5" />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <X />
      </button>
    </motion.div>
  );
};

const NOTIFICATION_TTL = 5000;

export default Notification;
