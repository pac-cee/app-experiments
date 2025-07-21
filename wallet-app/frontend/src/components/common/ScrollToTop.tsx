import React, { useState, useEffect } from 'react';
import { Fab, useScrollTrigger, Zoom } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    setIsVisible(trigger);
  }, [trigger]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
