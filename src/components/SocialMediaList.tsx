import { AiFillFacebook, AiFillInstagram, AiFillTwitterSquare, AiFillYoutube } from 'react-icons/ai';

const SocialMediaList = () => {
  return (
    <div className="items-center hidden lg:block">
      <ul className="flex items-center">
        <li className="ml-4">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillFacebook className="h-6 w-6 text-blue-500" />
          </a>
        </li>
        <li className="ml-4">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillTwitterSquare className="h-6 w-6 text-blue-400" />
          </a>
        </li>
        <li className="ml-4">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillInstagram className="h-6 w-6 text-pink-500" />
          </a>
        </li>
        <li className="ml-4">
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillYoutube className="h-6 w-6 text-red-500" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialMediaList;
