import Disclosure from "../Disclosure/Disclosure";

interface ISingleProps {
  disclosures: any
  cards: any
  imagemEdicao: string
}

function SingleEdicao({ disclosures, imagemEdicao, cards }: ISingleProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full bg-cover bg-center h-96 sm:h-128" style={{ backgroundImage: `url(${imagemEdicao})` }}>
      </div>
      <div className="max-w mx-auto  bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        {disclosures.map((disclosure: any) => (
          <Disclosure key={disclosure.nomeCategoria} categoria={disclosure.nomeCategoria} cards={cards} />
        ))}
      </div>
    </div>
  );
}

export default SingleEdicao