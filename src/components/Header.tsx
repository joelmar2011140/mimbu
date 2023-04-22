'use client'
import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useRouter } from 'next/navigation'
import SocialMediaList from "./SocialMediaList";

export function Header() {
  const roteador = useRouter()
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center h-full">
        <div className="flex items-center flex-row cursor-pointer" onClick={toggleMenu}>
          <button>
            <FaBars className="h-6 w-6 text-gray-800" />
          </button>
          <span className="text-sm ml-2 mr-2 font-bold">Menu</span>

        </div>
        <div className="flex items-center flex-row cursor-pointer" onClick={() => roteador.push('/login')}>
          <button>
            <FiLogIn className="h-6 w-6 text-gray-800" />
          </button>
          <span className="text-sm ml-2 mr-2 font-bold">Login</span>
        </div>
        <div className="flex-grow text-center hidden lg:block">
          <Link href='/'>
            <h1 className="text-gray-600 text-center font-bold text-4xl tracking-wide">Mimbu</h1>
          </Link>
        </div>
       <SocialMediaList />
      </div>
      <div className={`fixed top-16 left-0 h-full bg-white w-56 border-r border-gray-200 z-40 ${isOpen ? "block" : "hidden"} `}>
        <nav className="px-4 py-2 w-full">
          <ul className="my-10 gap-10">
            <li className="mb-2">
              <Link href="/artistas" className="hover:text-white font-semibold text-xl text-pink-600  w-full p-2 hover:bg-pink-600">Artistas</Link>
            </li>
            <li className="mb-2">
              <Link href="/contacte" className="hover:text-white font-semibold text-xl text-pink-600  w-full p-2 hover:bg-pink-600">
                Contacte-nos
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/noticias" className="hover:text-white font-semibold text-xl text-pink-600  w-full p-2 hover:bg-pink-600">
                Notícias
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="absolute top-0 right-0 mt-2 mr-2"
          onClick={toggleMenu}
        >
          <MdClose className="h-6 w-6  text-pink-600" />
        </button>
      </div>
    </header>
  )
}