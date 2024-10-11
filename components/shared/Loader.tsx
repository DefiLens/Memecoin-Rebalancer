import loaderAnimation from '../../public/assets/animation/loader.json';
import Lottie from 'lottie-react';
const Loader: React.FC<{ size?: number }> = ({ size }) => {
  return (
    <div className="w-6 h-6 overflow-hidden flex items-center justify-center">
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        autoplay={true}
        className="border p-0"
        style={{ minWidth: '50px', minHeight: '50px' }}
      />
    </div>
  );
};

export default Loader;
