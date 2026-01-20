import React from 'react';
import './Card.css';

function Card({
  children,
  variant = 'default',
  hoverable = false,
  glowing = false,
  className = '',
  onClick,
  ...props
}) {
  const classes = [
    'card',
    `card-${variant}`,
    hoverable && 'card-hoverable',
    glowing && 'card-glowing',
    onClick && 'card-clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}

function CardImage({ src, alt, className = '' }) {
  return (
    <div className={`card-image ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
