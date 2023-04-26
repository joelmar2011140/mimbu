// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.7.0 < 0.9.0;

contract Votacao {
  uint256 totalArtistas;
  uint256 public totalVotos;
  
  struct Edicao {
    uint256 numeroDeVotos;
    mapping(string => mapping(string => uint256)) votosPorEdicaoECategoria;
  }
  
  struct Artista {
    address endereco;
    string nomeCategoria;
    string edicao;
    uint256 numeroDeVotos;
  }

  mapping(uint256 => Artista) public artistas;
  mapping(string => mapping(string => Edicao)) edicoes;
  mapping(address => mapping(string => bool)) categoriaUsada;
  mapping(address => Artista) votos;
  mapping(address => mapping(string => bool)) estaEmEdicao;
  mapping(address => mapping(string => mapping(string => bool))) jaArtistaAdicionadoEdicaoCategoria;
  mapping(address => mapping(address => mapping(string => mapping(string => mapping(string => bool))))) biUsadoVoto;
  mapping(address => mapping(address => mapping(string => mapping(string => bool)))) enderecoUsado;
  
  constructor () {
    totalArtistas = 0;
  }

  function adicionarArtista(address _enderecoArtista, string memory _nomeEdicao, string memory _nomeCategoria) public {
    require(jaArtistaAdicionadoEdicaoCategoria[_enderecoArtista][_nomeEdicao][_nomeCategoria] == false, "Artista ja esta nesta edicao concorrendo nesta categoria");
    require(estaEmEdicao[_enderecoArtista][_nomeEdicao] == false, "Artista ja estah a concorrer nesta edicao");
    artistas[totalArtistas] = Artista(_enderecoArtista, _nomeCategoria, _nomeEdicao, 0);
    totalArtistas++;
    jaArtistaAdicionadoEdicaoCategoria[_enderecoArtista][_nomeEdicao][_nomeCategoria] = true;
    estaEmEdicao[_enderecoArtista][_nomeEdicao] = true;
    edicoes[_nomeEdicao][_nomeCategoria].votosPorEdicaoECategoria[_nomeEdicao][_nomeCategoria] = 0;
    edicoes[_nomeEdicao][_nomeCategoria].numeroDeVotos = 0;
  }

  function votar(address _enderecoArtista, string memory biVotante, string memory _edicao, string memory _categoria) public {
    Artista memory artista;
    require(biUsadoVoto[_enderecoArtista][msg.sender][biVotante][_edicao][_categoria] == false, "Ja submeteu um voto nesta categoria");
    require(enderecoUsado[_enderecoArtista][msg.sender][_edicao][_categoria] == false, "Ja submeteu um voto nesta categoria");
    require(categoriaUsada[msg.sender][_categoria] == false, "Ja submeteu um voto nesta categoria");
    for (uint256 i = 0; i < totalArtistas; i++) {
      if (artistas[i].endereco == _enderecoArtista) {
        artistas[i].numeroDeVotos++;
        artista = artistas[i];
      }
    }
    votos[msg.sender] = artista;
    edicoes[_edicao][_categoria].numeroDeVotos++;
    edicoes[_edicao][_categoria].votosPorEdicaoECategoria[_edicao][_categoria]++;
    biUsadoVoto[_enderecoArtista][msg.sender][biVotante][_edicao][_categoria] = true;
    categoriaUsada[msg.sender][_categoria] = true;
  }

  function numeroDeVotosArtistaCategoriaEdicao(address _enderecoArtista, string memory _edicao, string memory _categoria) public view returns (uint256) {
    for (uint256 i = 0; i < totalArtistas; i++) {
      if (artistas[i].endereco == _enderecoArtista && keccak256(bytes(artistas[i].nomeCategoria)) == keccak256(bytes(_categoria)) && keccak256(bytes(artistas[i].edicao)) == keccak256(bytes(_edicao))) {
        return artistas[i].numeroDeVotos;
      }
    }
    return 0;
  }

  function votosPorCategoria(string memory _edicao, string memory _categoria) public view returns (uint256) {
    return edicoes[_edicao][_categoria].numeroDeVotos;
  }

  function removerArtista(address _enderecoArtista, string memory _nomeEdicao, string memory _nomeCategoria) public {
    bool artistExists = false;
    uint256 artistIndex;
    for (uint256 i = 0; i < totalArtistas; i++) {
        if (artistas[i].endereco == _enderecoArtista &&
            keccak256(bytes(artistas[i].nomeCategoria)) == keccak256(bytes(_nomeCategoria)) &&
            keccak256(bytes(artistas[i].edicao)) == keccak256(bytes(_nomeEdicao))) {
            artistExists = true;
            artistIndex = i;
            break;
        }
    }
    require(artistExists, "Artista nao encontrado nesta edicao e categoria");
    
    Artista memory artista = artistas[artistIndex];
    delete artistas[artistIndex];
    totalArtistas--;
    totalVotos -= artista.numeroDeVotos;
    estaEmEdicao[_enderecoArtista][_nomeEdicao] = false;
    jaArtistaAdicionadoEdicaoCategoria[_enderecoArtista][_nomeEdicao][_nomeCategoria] = false;
    edicoes[_nomeEdicao][_nomeCategoria].numeroDeVotos -= artista.numeroDeVotos;
    edicoes[_nomeEdicao][_nomeCategoria].votosPorEdicaoECategoria[_nomeEdicao][_nomeCategoria] -= artista.numeroDeVotos;
}
}
