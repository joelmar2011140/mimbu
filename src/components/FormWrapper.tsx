import Link from "next/link"

interface IFormwrapperProps {
  children: any
  linkText: string
  descriptionText: string
  link: string
  onSubmit?: any
}

export default function FormWrapper({ children, link, descriptionText, linkText, onSubmit }: IFormwrapperProps) {
  return (
    <div className="flex p-4 flex-col items-center justify-center mi-h-screen">
      <form className="bg-white shadow-lg mt-36 rounded px-16 pt-8 pb-8 mb-8" onSubmit={onSubmit}>
        {children}
        <div className="flex mt-4 mb-4 items-center justify-between flex-row">
          <span className="text-sm ml-2 mr-2">{descriptionText}</span>
          <Link href={link} className="text-blue-500  font-bold py-2 px-4 ">
            {linkText}
          </Link>
        </div>
      </form>
    </div>
  )
}
