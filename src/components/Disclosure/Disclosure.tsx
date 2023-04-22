'use client'
import { useState } from "react";
import DisclosureCard, { IDisclosureCard } from "./DisclosureCard";

interface IDisclosureProps {
  categoria: string
  cards: IDisclosureCard[]
}

function Disclosure({ categoria, cards }: IDisclosureProps) {
  console.log(cards);
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleDisclosure = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-8 ">
      <div className="py-4 px-6 flex text-white items-center justify-center gap-2 cursor-pointer" onClick={toggleDisclosure}>
        <div className="text-lg font-semibold">{categoria}</div>
        <div className="text-white">{isOpen ? "▲" : "▼"}</div>
      </div>
      {isOpen && (
        <div className="px-6 py-4 flex">
          {cards.map((card: IDisclosureCard) => (
            <DisclosureCard
              key={card.nomeArtistico}
              {...card}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Disclosure