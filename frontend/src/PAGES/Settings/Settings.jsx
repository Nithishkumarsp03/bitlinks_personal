import React, { useState, useEffect } from 'react';
import Address from '../../COMPONENTS/Address';
import Company from '../../COMPONENTS/Company';
import Domain from '../../COMPONENTS/Domain';
import Role from '../../COMPONENTS/Role';
import Skillset from '../../COMPONENTS/Skillset';
import LoginData from '../../COMPONENTS/LoginData';
import Team from '../../COMPONENTS/Team';
import './Settings.css';

export default function Settings({ user }) {
  const [activeSection, setActiveSection] = useState('address');
  const isAdmin = user === 'admin';

  // Use `useEffect` to manage state updates based on the user role
  useEffect(() => {
    if (!isAdmin) {
      setActiveSection('support');
    }
  }, [isAdmin]);

  // Helper function to render the content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'address':
        return <Address />;
      case 'company':
        return <Company />;
      // case 'domain':
      //   return <Domain />;
      case 'role':
        return <Role />;
      case 'skillset':
        return <Skillset />;
      case 'login':
        return <LoginData />;
      case 'support':
        return <Team />;
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: '#edf3f7' }}>
      <div className='Settings-page'>
        <div className='navbar-settings'>
          {isAdmin && (
            <div>
              <div
                className={`nav-bar-content-settings ${activeSection === 'address' ? 'active' : ''}`}
                onClick={() => setActiveSection('address')}
              >
                <h2 className={`contents ${activeSection === 'address' ? 'active' : ''}`}>Address</h2>
              </div>
              <div
                className={`nav-bar-content-settings ${activeSection === 'company' ? 'active' : ''}`}
                onClick={() => setActiveSection('company')}
              >
                <h2 className={`contents ${activeSection === 'company' ? 'active' : ''}`}>Company</h2>
              </div>
              {/* <div
                className={`nav-bar-content-settings ${activeSection === 'domain' ? 'active' : ''}`}
                onClick={() => setActiveSection('domain')}
              >
                <h2 className={`contents ${activeSection === 'domain' ? 'active' : ''}`}>Domain</h2>
              </div> */}
              <div
                className={`nav-bar-content-settings ${activeSection === 'role' ? 'active' : ''}`}
                onClick={() => setActiveSection('role')}
              >
                <h2 className={`contents ${activeSection === 'role' ? 'active' : ''}`}>Role</h2>
              </div>
              <div
                className={`nav-bar-content-settings ${activeSection === 'skillset' ? 'active' : ''}`}
                onClick={() => setActiveSection('skillset')}
              >
                <h2 className={`contents ${activeSection === 'skillset' ? 'active' : ''}`}>Skillset</h2>
              </div>
              <div
                className={`nav-bar-content-settings ${activeSection === 'login' ? 'active' : ''}`}
                onClick={() => setActiveSection('login')}
              >
                <h2 className={`contents ${activeSection === 'login' ? 'active' : ''}`}>Login</h2>
              </div>
            </div>
          )}
          <div className='nav-bar-logout' onClick={() => setActiveSection('support')}>
            <h2>
              <i className='fa-solid fa-headset'></i> Support
            </h2>
          </div>
        </div>
        <div className='table-structure-settings'>
          <div className='table-containers'>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
