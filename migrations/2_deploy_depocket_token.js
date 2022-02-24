const DePocketToken = artifacts.require("DePocketToken");

module.exports = function (deployer) {
  deployer.deploy(DePocketToken);
};
