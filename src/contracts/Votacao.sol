// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.7.0 < 0.9.0;

contract Votacao {
  uint totalArtistas;
  uint public totalVotos;

  struct Artista {
    address endereco;
    string nomeCategoria;
    string nomeArtista;
    uint numeroDeVotos;
  }

  mapping(uint => Artista) public artistas;
  mapping(address => Artista) votos;
  mapping(address => mapping(address => bool)) jaVotou;
  mapping(string => mapping(address => bool)) biUsado;
  mapping(address => mapping(string => bool)) categoriaUsada;
  mapping(address => mapping(string => bool)) artistaAdicionado;
  mapping(address => bool) artistasEmCompticao;
  mapping(string => mapping(string => bool)) artistaAdicionadoCatgeoria;
  
  constructor () {
    totalArtistas = 0;
  }

  event aoSalvarArtista (string nomeArtista);
  event aoVotar(address _enderecoVotante, address _artista);

  function adicionarArtista (address _enderecoArtista, string memory _nomeArtista, string memory _nomeCategoria) public {
    require(artistasEmCompticao[_enderecoArtista] == false, "Artista ja existe");
    require(artistaAdicionado[_enderecoArtista][_nomeArtista] == false, "Artista ja existe");
    require(artistaAdicionadoCatgeoria[_nomeArtista][_nomeCategoria] == false, "Artista ja existe");
    artistas[totalArtistas] = Artista(_enderecoArtista, _nomeCategoria, _nomeArtista, 0);
    totalArtistas++;
    artistasEmCompticao[_enderecoArtista] = true;
    artistaAdicionado[_enderecoArtista][_nomeArtista] = true;
    artistaAdicionadoCatgeoria[_nomeArtista][_nomeCategoria] = true;
    emit aoSalvarArtista(_nomeArtista);
  }

  function votar (address _enderecoArtista, string memory biVotante, string memory _categoria) public {
    Artista memory artista;
    require(jaVotou[msg.sender][_enderecoArtista] == false, "Ja submeteu um voto nesta categoria");
    require(biUsado[biVotante][_enderecoArtista] == false, "Ja submeteu um voto nesta categoria");
    require(categoriaUsada[msg.sender][_categoria] == false, "Ja submeteu um voto nesta categoria");
    for (uint i = 0; i < totalArtistas; i++) {
      if (artistas[i].endereco == _enderecoArtista) {
        artistas[i].numeroDeVotos ++;
        artista = artistas[i];
      }
    }
    votos[msg.sender] = artista;
    totalVotos++;
    jaVotou[msg.sender][_enderecoArtista] = true;
    biUsado[biVotante][_enderecoArtista] = true;
    categoriaUsada[msg.sender][_categoria] = true;
    emit aoVotar(msg.sender, _enderecoArtista);
  }

  function votosDeUmArtista (address _enderecoArtista) public view returns (uint) {
    Artista memory artista;
    for (uint i = 0; i < totalArtistas; i++) {
      if (artistas[i].endereco == _enderecoArtista) {
        artista = artistas[i];
      }
    }
    return artista.numeroDeVotos;
  }
}