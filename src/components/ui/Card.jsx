import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  onClick,
  ...props 
}) => {
  const classes = [
    'card',
    `card-padding-${padding}`,
    hover && 'card-hover',
    onClick && 'card-clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`card-title ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
