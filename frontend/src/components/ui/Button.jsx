import React from 'react';
import { Link } from 'react-router-dom';

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
  outline: 'border border-border bg-white text-black hover:bg-gray-200',
  ghost: 'bg-transparent text-black hover:bg-gray-200',
};

export default function Button({
  as = 'button',
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
  loadingText,
  spinOnLoading = true,
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

  const hasStart = !!startIcon;
  const hasEnd = !!endIcon;
  const hasIcon = hasStart || hasEnd;

  // ✅ 아이콘만 있는 경우(텍스트 없음 & 로딩 아님): 중앙에만 아이콘 렌더
  const isIconOnly = !loading && !label && hasIcon;

  // 로딩 시 왼쪽 아이콘에 회전 적용
  const leftSlotCls = cn(
    'inline-flex items-center justify-center w-5 h-5 shrink-0',
    loading && spinOnLoading && hasStart && 'animate-spin'
  );

  let content;
  if (isIconOnly) {
    // 중앙 정렬: 바깥이 already justify-center라 이 한 덩어리만 넣으면 정확히 중앙
    content = (
      <span className='inline-flex items-center justify-center'>
        {/* startIcon 또는 endIcon 중 존재하는 것 */}
        <span className='w-5 h-5 inline-flex items-center justify-center'>
          {startIcon || endIcon}
        </span>
      </span>
    );
  } else if (hasIcon) {
    // 아이콘 + 텍스트 or 로딩일 때
    content = (
      <span className='inline-grid grid-cols-[1.25rem_auto_1.25rem] items-center justify-center gap-2'>
        <span className={leftSlotCls}>{startIcon || null}</span>
        <span className='whitespace-nowrap text-center'>{label}</span>
        <span className='inline-flex items-center justify-center w-5 h-5 shrink-0'>
          {endIcon || null}
        </span>
      </span>
    );
  } else {
    // 텍스트만
    content = <span className='whitespace-nowrap text-center'>{label}</span>;
  }

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
