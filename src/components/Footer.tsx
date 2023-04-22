'use client'
import SocialMediaList from './SocialMediaList';
import Countdown from './CountDown';
import { useStoreState } from 'easy-peasy';

function Footer() {
  const edicao = useStoreState((state: any) => state.edicao)
  return (
    <footer className="bg-slate-50 text-gray-800 py-10">
      <div className="container mx-auto flex flex-col gap-6 items-center justify-between">
        {
          (Object.keys(edicao).length > 0) ? (<div className="flex flex-col gap-6 items-center mb-4 md:mb-0">
            <h2>As votações terminam daqui</h2>
            <Countdown targetDate={new Date(edicao.dataTermino)} />
          </div>) : null
        }
        <SocialMediaList />
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-white hover:text-gray-400 transition duration-300"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-400 transition duration-300"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-400 transition duration-300"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="mt-4 md:mt-0">&copy; {new Date().getUTCFullYear()} Mimbu. Todos os direitos reservados</div>
      </div>
    </footer>
  );
};

export default Footer;