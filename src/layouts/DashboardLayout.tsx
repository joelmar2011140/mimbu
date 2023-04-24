import Head from "next/head";
import { IProvider } from "@/global.types";
import { FaSearch } from "react-icons/fa"
import { BsNewspaper } from 'react-icons/bs'
import { BiCategory } from 'react-icons/bi'
import { GiMusicalNotes, GiVote } from 'react-icons/gi'
import { useStoreState } from "easy-peasy";
import Link from "next/link";

export function DashboardLayout({ children }: IProvider) {
  const estado = useStoreState((state: any) => state)
  
  const titulo: string = `Mimbu - Painel administrativo`
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="keywords" content="Concurso de música angolana, blockchain, segurança" />
        <title>{titulo}</title>
      </Head>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <aside className="min-w-screen fixed  bg-white text-gray p-6 border-r-2 border-r-violet-500">
          <h1 className="text-3xl text-center text-gray-700 font-bold mb-16">Mimbu</h1>
          <nav>
            <ul>
              <li className="mb-8 flex flex-row items-center gap-4 p-2 hover:bg-violet-600 ">
                <BsNewspaper
                  className=" text-gray-500 hover:text-white"
                  size={20}
                />
                <Link href="/panel/edicoes" className="flex items-center text-gray-500 text-2xl font-normal hover:text-white">
                  <span className="mr-2 ">Edições</span>
                </Link>
              </li>
              <li className="mb-8 flex flex-row items-center gap-4 p-2 hover:bg-violet-600">
                <BiCategory
                  className=" text-gray-500 hover:text-white"
                  size={20}
                />
                <Link href="/panel/categorias" className="flex items-center text-gray-500 text-2xl font-normal hover:text-white">
                  <span className="mr-2">Categorias</span>
                </Link>
              </li>
              <li className="mb-8 flex flex-row items-center gap-4 p-2 hover:bg-violet-600">
                <GiMusicalNotes
                  className=" text-gray-500 hover:text-white"
                  size={20}
                />
                <Link href="/panel/artistas" className="flex items-center text-gray-500 text-2xl font-normal hover:text-white">
                  <span className="mr-2">Artistas</span>
                </Link>
              </li>
              <li className="mb-8 flex flex-row items-center gap-4 p-2 hover:bg-violet-600">
                <GiVote
                  className=" text-gray-500 hover:text-white"
                  size={20}
                />
                <Link href="/panel/votantes" className="flex items-center text-gray-500 text-2xl font-normal hover:text-white">
                  <span className="mr-2">Votantes</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 absolute ml-64 p-6 bg-white">
          <div className="flex flex-wrap md:flex-no-wrap justify-between items-center mb-6">
            {/* Search component */}
            <div className="relative flex items-center w-full md:w-auto mr-4 mb-4 md:mb-0">
              <input
                type="search"
                placeholder="Pesquisar aqui"
                className="bg-white border-none px-4 py-2 pr-10 rounded-lg focus:outline-none w-full"
              />
              <FaSearch
                className="absolute right-0 top-0 m-2 text-gray-500"
                size={20}
              />
            </div>

            {/* Dropdown profile image */}
            <div className="flex items-center mr-12">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-2">
                <h3 className="text-gray-700 font-semibold">John Doe</h3>
                <p className="text-gray-500">Admin</p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}

