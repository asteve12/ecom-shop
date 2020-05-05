import React, { useState, useEffect, useRef } from 'react';
import './style.scss';

export interface IRelatedElement {
  top: number;
  height: number;
}

interface IProps {
  onClick: (e: React.BaseSyntheticEvent) => void;
  related?: IRelatedElement;
  className?: string;
  shouldCenter?: boolean;
}


const ShowButton: React.FC<IProps> = ({
  related = { top: 0, height: 0 },
  className,
  shouldCenter,
  onClick,
}) => {
  const { top, height } = related;
  const [mounted, setMounted] = useState<boolean>(false);
  const [newTop, setNewTop] = useState<string>(`${top}px`);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setNewTop(() => (shouldCenter
      ? `${(top - (containerRef.current?.offsetHeight! / 2) + (height / 2))}px`
      : `${top}px`));
  }, [mounted, related.top, related.height]);

  return (
    <div ref={containerRef} style={{ top: newTop, display: mounted ? '' : 'none' }} className={`ShowButton ${className || ''}`}>
      <div className="ShowButton__inner">
        <button onClick={onClick} type="button" className="ShowButton__button">
          <span className="ShowButton__text">Show</span>
        </button>
      </div>
    </div>
  );
};

export default ShowButton;
