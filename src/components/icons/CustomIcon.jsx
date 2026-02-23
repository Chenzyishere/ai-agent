// src/icons/CustomIcon.jsx
import React from 'react';
import { Icon } from '@ant-design/icons';
import PirateIcon from './PirateIcon';

const PirateIcon = (props) => {
  return <Icon component={PirateIcon} {...props} />;
};

export default PirateIcon;