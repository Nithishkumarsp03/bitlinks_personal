import React from 'react';
import './Team.css'; 
import Nithish from '../Assets/nithishkumar.jpg';
import Thaya from '../Assets/thayanithi.jpg';
import Dhanu from '../Assets/dhanusri.png';
import Tharun from '../Assets/tharun.jpeg';
import link from '../Assets/t-link.png';
import gmail from '../Assets/t-email.png';
import whatsapp from '../Assets/t-whatsapp.png';

const teamMembers = [
  {
    name: 'NITHISH KUMAR S P',
    title: 'Full-stack Developer',
    image: Nithish,
    email: 'mailto:nithishkumar3115@gmail.com?',
    whatsapp: '+918903342911',
    student: 'https://www.linkedin.com/in/nithish-kumar-s-p-b5295828b/',
    cont: 'Team Lead'
  },
  {
    name: 'THAYANITHI S',
    title: 'Full-stack Developer',
    image: Thaya,
    email: 'mailto:thayanithi2006s@gmail.com?',
    whatsapp: '+919025391287',
    student: 'https://www.linkedin.com/in/thayanithi-s-293999296',
    cont: 'Team member'
  },
  {
    name: 'DHANU SHRI V',
    title: 'Full-stack Developer',
    image: Dhanu,
    email: 'mailto:dhanushri.ec23@bitsathy.ac.in?',
    whatsapp: '+916374129588',
    student: 'https://www.linkedin.com/in/dhanushri-vijayakumar-28494929b/',
    cont: 'Team member'
  },
  {
    name: 'THARUN KRITHIK K S',
    title: 'UI/UX Designer',
    image: Tharun,
    email: 'mailto:tharunkiruthik.cs22@bitsathy.ac.in',
    whatsapp: '+918667074749',
    student: 'https://www.linkedin.com/in/tharun-kiruthik-4b222325a/',
    cont: 'Team Designer',
  },
];

const Team = () => {
  return (
    <div className="team-section">
      <h2 className="team-title">Meet Our Team</h2>
      <p className="team-subtitle">
        {/* Members who contributed for BITLINKS development. */}
      </p>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member-card">
            <img src={member.image} alt='' className="team-member-image" />
            <h3 className="team-member-name">{member.name}</h3>
            <p className="team-member-title">{member.title}</p>
            <br/>
            <p className="team-member-title">{member.cont}</p>
            <p className='team-member-contact'>
              {member.email && (
                <a href={member.email} target='_blank'>
                  <img src={gmail} alt="Email" className='g-image' />
                </a>
              )}
              <span className='spacing'></span>
              <a href={member.student} target='_blank'>
                <img src={link} alt="LinkedIn" className='g-image' />
              </a>
              <span className='spacing'></span>
              <a href={`https://wa.me/${member.whatsapp}`} target='_blank'>
                <img src={whatsapp} alt="WhatsApp" className='g-image' />
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
