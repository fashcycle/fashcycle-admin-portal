// import React, { createContext, useContext, useState, ReactNode } from 'react';

// type MessageType = 'success' | 'error' | 'info' | null;

// interface AppStateContextType {
//   loading: boolean;
//   setLoading: (value: boolean) => void;
//   message: string | null;
//   messageType: MessageType;
//   setMessage: (msg: string, type?: MessageType) => void;
//   clearMessage: () => void;
// }

// const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// export const AppStateProvider = ({ children }: { children: ReactNode }) => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMsg] = useState<string | null>(null);
//   const [messageType, setMessageType] = useState<MessageType>(null);

//   const setMessage = (msg: string, type: MessageType = 'info') => {
//     setMsg(msg);
//     setMessageType(type);
//   };

//   const clearMessage = () => {
//     setMsg(null);
//     setMessageType(null);
//   };

//   return (
//     <AppStateContext.Provider
//       value={{
//         loading,
//         setLoading,
//         message,
//         messageType,
//         setMessage,
//         clearMessage,
//       }}
//     >
//       {children}
//     </AppStateContext.Provider>
//   );
// };

// export const useAppState = (): AppStateContextType => {
//   const context = useContext(AppStateContext);
//   if (!context) {
//     throw new Error('useAppState must be used within AppStateProvider');
//   }
//   return context;
// };


import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type MessageType = 'success' | 'error' | 'info' | null;

interface AppStateContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
  message: string | null;
  messageType: MessageType;
  setMessage: (msg: string, type?: MessageType) => void;
  clearMessage: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMsg] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const setMessage = (msg: string, type: MessageType = 'info') => {
    setMsg(msg);
    setMessageType(type);
    setVisible(true);
  };

  const clearMessage = () => {
    setVisible(false);
    setTimeout(() => {
      setMsg(null);
      setMessageType(null);
    }, 300); // Give time for fade-out animation if needed
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getColor = () => {
    switch (messageType) {
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
    <AppStateContext.Provider
      value={{
        loading,
        setLoading,
        message,
        messageType,
        setMessage,
        clearMessage,
      }}
    >
      {children}

      {visible && message && (
        <div
          className={`fixed top-4 right-4 z-50 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 ${getColor()}`}
        >
          {message}
        </div>
      )}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
