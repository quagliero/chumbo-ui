import React from 'react';
import Image from 'next/image';

interface OuterProps {
  height?: string | number,
  width?: string | number,
  layout?: 'fixed' | 'fill' | 'responsive' | 'intrinsic'
}

const Logo = ({
  width,
  height,
  layout,
  ...rest
}: OuterProps) => {
  // logo img is 3:4
  const ratioHeight = width && !height ? Number(width) / 0.75 : height;
  const ratioWidth = height && !width ? Number(height) * 0.75 : width;

  return (
    <Image
      src="/images/chumbo-logo.png"
      alt="Chumbo"
      height={ratioHeight}
      width={ratioWidth}
      // @ts-ignore 'fill' not in types
      layout={layout}
      {...rest}
    />
  )
};

export default Logo;
