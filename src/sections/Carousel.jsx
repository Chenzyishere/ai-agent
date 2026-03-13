import React from 'react';
import { Carousel,Image } from 'antd';
const contentStyle = {
  margin: 0,
  height: '100vh',
  color: '#fff',
  textAlign: 'center',
  background: '#364d79',
};
export default function App(){
  const onChange = currentSlide => {
    console.log(currentSlide);
  };
  return (
    <Carousel afterChange={onChange}>
      <div className='relative' style={contentStyle}>
        <h1 className='absolute top-1/3 left-1/10 text-9xl font-black text-red-50 z-10 max-w-1'>Welcome to my website</h1>
        <Image className='w-full' src='https://chenzyishere.oss-cn-guangzhou.aliyuncs.com/img_for_typora/000027.jpg'/>
      </div>
    </Carousel>
  );
};