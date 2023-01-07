const hre = require("hardhat");

async function main() {
  const ZulusCoin = await hre.ethers.getContractFactory("ZulusCoin");
  const zulusCoin = await ZulusCoin.deploy(242000, 1);

  await zulusCoin.deployed();

  console.log('zulus: ', zulusCoin.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
