'use client'
import Image from "next/image"
import Link from "next/link"
import { StandardLayout } from "@/layouts/StandardLayout"

export default function NotFound() {
  return (
    <StandardLayout tituloDaPagina="Página não encontrada" descricao="Página não encontrada">
        <div className="flex flex-col justify-center items-center h-screen">
      <Image
        src="/images/ntfound.jpg"
        alt="Page Not Found"
        width={300}
        height={300}
      />
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mt-6 text-center">
        Oooops página não encontrada
      </h1>
      <p className="text-gray-700 text-center mt-2">
        Ao que tudo indica a página desejada não existe{" "}
        <br className="hidden md:block" />
        <span className="block md:inline-block">
          Volte{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            para à página inicial
          </Link>{" "}
          ou{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            contacte-nos
          </a>{" "}
          se precisares de uma informação extra
        </span>
      </p>
    </div>
    </StandardLayout>
  )
}
