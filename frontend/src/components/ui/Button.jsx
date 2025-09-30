import React from 'react';
import { Link } from 'react-router-dom';

// 간단한 class 병합
const cn = (...xs) => xs.filter(Boolean).join(' ');

const base =
  'inline-flex items-center justify-center select-none rounded-xl font-medium transition-colors focus-thin disabled:opacity-60 disabled:cursor-not-allowed';
const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4',
  lg: 'h-12 px-5 text-base',
};
const variants = {
  primary: 'bg-brand text-white hover:opacity-90',
  outline: 'border border-border bg-white text-black hover:bg-gray-100',
  ghost: 'bg-transparent text-black hover:bg-gray-200',
  danger: 'bg-danger text-white hover:opacity-90',
};

export default function Button({
  as = 'button', // 'button' | 'a' | 'link'
  to,
  href,
  target,
  rel,
  type = 'button',
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  loadingText, // ex) "Refreshing..."
  spinOnLoading = true, // startIcon을 로딩 중 회전시킬지
  className,
  children,
  ...rest
}) {
  const cls = cn(
    base,
    sizes[size],
    variants[variant],
    fullWidth && 'w-full',
    className
  );
  const label = loading && loadingText ? loadingText : children;

  const iconStart = startIcon ? (
    <span className={cn('mr-2', loading && spinOnLoading && 'animate-spin')}>
      {startIcon}
    </span>
  ) : null;

  const iconEnd = endIcon ? <span className='ml-2'>{endIcon}</span> : null;

  const content = (
    <>
      {iconStart}
      <span className='whitespace-nowrap'>{label}</span>
      {iconEnd}
    </>
  );

  if (as === 'a' || href) {
    return (
      <a href={href} target={target} rel={rel} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  if (as === 'link' || to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {content}
    </button>
  );
}
