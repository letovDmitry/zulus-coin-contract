const { expect } = require('chai');
const { ethers } = require('hardhat');
const hre = require('hardhat')

describe("ZulusCoin contract", function() {
    let Token;
    let zulusCoin;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 242000;
    let tokenBlockReward = 1;

    beforeEach(async function() {
        Token = await ethers.getContractFactory("ZulusCoin");
        [ owner, addr1, addr2 ] = await hre.ethers.getSigners();

        zulusCoin = await Token.deploy(tokenCap, tokenBlockReward);
    })

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
          expect(await zulusCoin.owner()).to.equal(owner.address);
        });
    
        it("Should assign the total supply of tokens to the owner", async function () {
          const ownerBalance = await zulusCoin.balanceOf(owner.address);
          expect(await zulusCoin.totalSupply()).to.equal(ownerBalance);
        });
    
        it("Should set the max capped supply to the argument provided during deployment", async function () {
          const cap = await zulusCoin.cap();
          expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
        });
    
        it("Should set the blockReward to the argument provided during deployment", async function () {
          const blockReward = await zulusCoin.blockReward();
          expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
        });
      });
    
      describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
          await zulusCoin.transfer(addr1.address, 50);
          const addr1Balance = await zulusCoin.balanceOf(addr1.address);
          expect(addr1Balance).to.equal(50);
    
          await zulusCoin.connect(addr1).transfer(addr2.address, 50);
          const addr2Balance = await zulusCoin.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
    
        it("Should fail if sender doesn't have enough tokens", async function () {
          const initialOwnerBalance = await zulusCoin.balanceOf(owner.address);
          await expect(
            zulusCoin.connect(addr1).transfer(owner.address, 1)
          ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    
          expect(await zulusCoin.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
          );
        });
    
        it("Should update balances after transfers", async function () {
          const initialOwnerBalance = await zulusCoin.balanceOf(owner.address);
    
          await zulusCoin.transfer(addr1.address, 100);
    
          await zulusCoin.transfer(addr2.address, 50);
    
          const finalOwnerBalance = await zulusCoin.balanceOf(owner.address);
          expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
    
          const addr1Balance = await zulusCoin.balanceOf(addr1.address);
          expect(addr1Balance).to.equal(100);
    
          const addr2Balance = await zulusCoin.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
      });
      
})