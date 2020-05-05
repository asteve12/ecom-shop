import React, { useState, useRef, useEffect } from 'react';
import CSS from 'csstype';

import './style.scss';


interface IProps {
  header: string;
  timeInMs?: number;
  opened?: boolean;
  className?: string;
  children?: React.ReactNode;
}


const Rollup: React.FC<IProps> = (props) => {
  const {
    header,
    timeInMs,
    opened = false,
    className = '',
    children,
  } = props;

  const [isOpened, setOpened] = useState<boolean>(opened);
  const [style, setStyle] = useState<CSS.Properties>({
    transitionDelay: `${timeInMs || ''}`,
    height: '0px',
  });

  const rollupRef = useRef<HTMLDivElement>(null);

  const rollup = () => {
    setOpened((prevState) => !prevState);
  };

  // Set full height if isOpened === true, otherwise set it 0
  useEffect(() => {
    if (rollupRef.current) {
      const { scrollHeight } = rollupRef.current;
      const newHeight = isOpened ? scrollHeight : 0;

      setStyle((prevStyle) => ({
        ...prevStyle,
        height: `${newHeight}px`,
      }));
    }
  }, [isOpened]);

  return (
    <div
      className={`Rollup ${className}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={rollup}
        onKeyPress={rollup}
        className="Rollup__h"
      >
        {header}
        <span className={`Rollup__state-icon ${isOpened ? 'Rollup__state-icon_active' : ''}`} />
      </div>
      <div ref={rollupRef} style={style} className="Rollup__inner">
        {children}
      </div>
    </div>
  );
};

export default Rollup;
