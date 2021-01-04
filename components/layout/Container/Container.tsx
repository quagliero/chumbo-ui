import React, { useMemo } from 'react';
import styles from './Container.module.css';

const Container = ({
  children,
  flush,
}: {
  children: React.ReactNode,
  flush?: boolean,
}) => {
  const className = useMemo(() => {
    return [
      styles.container,
      flush && styles['container--flush'],
    ].filter(Boolean).join(' ');
  }, [ flush ]);

  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default Container;
