import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'stroke' | 'fill'> {
  size?: number;
  stroke?: string;
  fill?: string;
  sw?: number;
}

export function Icon({
  size = 20,
  stroke = 'currentColor',
  fill = 'none',
  sw = 1.6,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}
