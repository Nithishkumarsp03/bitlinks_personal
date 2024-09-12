import React, { createContext, useContext, useState } from 'react';

const PersonContext = createContext();

export function PersonProvider({ children }) {
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  // const [selectedsubid, setSelectedsubid] = useState(null);
 
  // console.log('PersonProvider rendering'); // Debug statement

  return (
    <PersonContext.Provider value={{ 
      selectedPersonId, 
      setSelectedPersonId,
      // selectedsubid,
      // setSelectedsubid,
      }}>
      {children}
    </PersonContext.Provider>
  );
}

export function usePerson() {
  const context = useContext(PersonContext);
  if (context === undefined) {
    throw new Error('usePerson must be used within a PersonProvider');
  }
  return context;
}
