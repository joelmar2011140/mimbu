const Votacao = artifacts.require("Votacao");

module.exports = function(deployer) {
  deployer.deploy(Votacao);
};