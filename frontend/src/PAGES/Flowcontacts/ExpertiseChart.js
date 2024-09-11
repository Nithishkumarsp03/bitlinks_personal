import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import './ExpertiseChart.css';
import Exclaim from '../../Assets/Rank-3.svg'; 
import Complete from '../../Assets/Rank-2.svg';
import Star from '../../Assets/Rank-1.svg';
import Border from '../../Assets/Profile Border.png';
import Circle from '../../Assets/Rank-4.svg';

const ExpertiseChart = () => {
  return (
    <div className='ranking-tree'>
      <div className='expertise-network'>Network Info Graphic </div>
      <Tree 
        style={{ borderImage: `url(${Border}) 30 round` }} 
        lineColor='#f9b694' 
        lineStyle='dashed' 
        lineWidth='2px' 
        lineHeight='20px' 
        className='contact-tree'
        label={<div className="node-title"><span>Expertise</span></div>}
      >
        <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Exclaim} alt='' className='corner-img' /></div></div>}>
          <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Complete} alt='' className='corner-img' /></div></div>}>
            <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Star} alt='' className='corner-img' /></div></div>}>
              <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Circle} alt='' className='corner-img' /></div></div>}/>
            </TreeNode>
          </TreeNode>
        </TreeNode>
        <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Exclaim} alt='' className='corner-img' /></div></div>}>
          <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Complete} alt='' className='corner-img' /></div></div>}>
            <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Star} alt='' className='corner-img' /></div></div>}>
              <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Circle} alt='' className='corner-img' /></div></div>}/>
            </TreeNode>
          </TreeNode>
        </TreeNode>
        <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Exclaim} alt='' className='corner-img' /></div></div>}>
          <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Complete} alt='' className='corner-img' /></div></div>}>
            <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Star} alt='' className='corner-img' /></div></div>}>
              <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Circle} alt='' className='corner-img' /></div></div>}/>
            </TreeNode>
          </TreeNode>
        </TreeNode>
        <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Exclaim} alt='' className='corner-img' /></div></div>}>
          <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Complete} alt='' className='corner-img' /></div></div>}>
            <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Star} alt='' className='corner-img' /></div></div>}>
              <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Circle} alt='' className='corner-img' /></div></div>}/>
            </TreeNode>
          </TreeNode>
        </TreeNode>
        <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Exclaim} alt='' className='corner-img' /></div></div>}>
          <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Complete} alt='' className='corner-img' /></div></div>}>
            <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Star} alt='' className='corner-img' /></div></div>}>
              <TreeNode label={<div className="node child"><div className='dot'></div><div className="border-image-container"><img src={Border} alt="Border" className="border-image" /></div><div className="expertise-profile"><img src={Circle} alt='' className='corner-img' /></div></div>}/>
            </TreeNode>
          </TreeNode>
        </TreeNode>
      </Tree>
    </div>
  );
};

export default ExpertiseChart;
