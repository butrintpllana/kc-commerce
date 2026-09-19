import Spinner from './Spinner';
import './page-loader.css';

export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="page-loader">
      <Spinner size="lg" />
      <p className="page-loader__label">{label}</p>
    </div>
  );
}
