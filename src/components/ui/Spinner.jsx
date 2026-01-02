import './Spinner.css';

const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`spinner spinner-${size} ${className}`}>
      <div className="spinner-ring"></div>
    </div>
  );
};

// Full page loading spinner
export const PageLoader = () => (
  <div className="page-loader">
    <Spinner size="lg" />
  </div>
);

export default Spinner;
