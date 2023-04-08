'use client'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Countdown from './CountDown';

function Footer() {
  return (
    <footer className="bg-slate-50 text-gray-800 py-10">
      <div className="container mx-auto flex flex-col gap-6 items-center justify-between">
        <div className="flex flex-col gap-6 items-center mb-4 md:mb-0">
          <h2>As votações terminam daqui</h2>
          <Countdown targetDate={new Date('2023-04-15T00:00:00.000Z')} />
        </div>
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