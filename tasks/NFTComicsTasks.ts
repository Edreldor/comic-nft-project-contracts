import { task, types } from "hardhat/config";

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

task("deployNFTComics", "Deploy the NFTComics contract")
  .addFlag("verify", "send verification to etherscan after deployment")
  .addParam(
    "contractUri",
    "The contract store-front metadata",
    "data:application/json;base64,ewogICJuYW1lIjogIk5GVCBDb21pY3MgQ29sbGVjdGlvbiIsCiAgImRlc2NyaXB0aW9uIjogIkEgY29sbGVjdGlvbiBvZiBDb21pYyBBcnR3b3JrcyIsCiAgInNlbGxlcl9mZWVfYmFzaXNfcG9pbnRzIjogNTAwCn0=",
    types.string
  )
  .addParam(
    "feeReceiver",
    "the address of the feeReceiver",
    "0x3E9f62c85DA897691e70986a63C5D5c882d17E10",
    types.string
  )
  .addParam(
    "mainReceiver",
    "the address of the mainReceiver",
    "0xF783DcBAA99AFbaE72da6b77c5644963839ea6f4",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();

    const contractURI = taskArgs.contractUri;
    const feeReceiver = hre.ethers.utils.getAddress(taskArgs.feeReceiver);
    const mainReceiver = hre.ethers.utils.getAddress(taskArgs.mainReceiver);

    console.log("Deploying NFTComics Contract with: ", deployer.address);

    // getting the contract
    const nftComicsFactory = await hre.ethers.getContractFactory("NFTComics");

    const nftComics = await nftComicsFactory
      .connect(deployer)
      .deploy(contractURI, feeReceiver, mainReceiver);

    await nftComics.deployed();

    console.log("NFTComics contract deployed to ", nftComics.address);

    if (taskArgs.verify) {
      console.log("Send verification request to etherscan");
      await sleep(60000);

      await hre.run("verify:verify", {
        address: nftComics.address,
        constructorArguments: [contractURI, feeReceiver, mainReceiver],
      });

      console.log("Contract verified on etherscan");
    }
  });
