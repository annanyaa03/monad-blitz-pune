import { expect } from "chai";
import hardhat from "hardhat";
import networkHelpers from "@nomicfoundation/hardhat-network-helpers";
const { ethers } = hardhat;
const { time } = networkHelpers;

describe("KillSwitch", function () {
  async function deployFixture() {
    const [owner, stranger] = await ethers.getSigners();
    const dailyCap = ethers.parseUnits("100", 18);
    const perTradeLimit = ethers.parseUnits("25", 18);
    const cooldownSeconds = 3600;

    const killSwitchFactory = await ethers.getContractFactory("KillSwitch");
    const killSwitch = await killSwitchFactory.deploy(dailyCap, perTradeLimit, cooldownSeconds);
    await killSwitch.waitForDeployment();

    const targetFactory = await ethers.getContractFactory("MockTradeTarget");
    const target = await targetFactory.deploy();
    await target.waitForDeployment();

    return { owner, stranger, killSwitch, target };
  }

  it("executes a trade and emits TradePlaced", async function () {
    const { killSwitch, target } = await deployFixture();
    const payload = ethers.toUtf8Bytes("buy-now");
    const calldata = target.interface.encodeFunctionData("perform", [payload]);

    await expect(
      killSwitch.executeTrade(0, ethers.parseUnits("10", 18), await target.getAddress(), calldata)
    ).to.emit(killSwitch, "TradePlaced");
  });

  it("blocks non-owners", async function () {
    const { stranger, killSwitch, target } = await deployFixture();
    const calldata = target.interface.encodeFunctionData("perform", [ethers.toUtf8Bytes("x")]);

    await expect(
      killSwitch
        .connect(stranger)
        .executeTrade(0, ethers.parseUnits("10", 18), await target.getAddress(), calldata)
    ).to.be.revertedWithCustomError(killSwitch, "NotOwner");
  });

  it("enforces the per-trade limit", async function () {
    const { killSwitch, target } = await deployFixture();
    const calldata = target.interface.encodeFunctionData("perform", [ethers.toUtf8Bytes("x")]);

    await expect(
      killSwitch.executeTrade(0, ethers.parseUnits("30", 18), await target.getAddress(), calldata)
    ).to.be.revertedWithCustomError(killSwitch, "PerTradeLimitExceeded");
  });

  it("enforces the daily cap", async function () {
    const { killSwitch, target } = await deployFixture();
    const calldata = target.interface.encodeFunctionData("perform", [ethers.toUtf8Bytes("x")]);

    await killSwitch.executeTrade(0, ethers.parseUnits("25", 18), await target.getAddress(), calldata);
    await time.increase(3601);
    await killSwitch.executeTrade(0, ethers.parseUnits("25", 18), await target.getAddress(), calldata);
    await time.increase(3601);
    await killSwitch.executeTrade(0, ethers.parseUnits("25", 18), await target.getAddress(), calldata);
    await time.increase(3601);
    await killSwitch.executeTrade(0, ethers.parseUnits("20", 18), await target.getAddress(), calldata);
    await time.increase(3601);

    await expect(
      killSwitch.executeTrade(0, ethers.parseUnits("10", 18), await target.getAddress(), calldata)
    ).to.be.revertedWithCustomError(killSwitch, "DailyCapExceeded");
  });

  it("enforces the cooldown window", async function () {
    const { killSwitch, target } = await deployFixture();
    const calldata = target.interface.encodeFunctionData("perform", [ethers.toUtf8Bytes("x")]);

    await killSwitch.executeTrade(0, ethers.parseUnits("10", 18), await target.getAddress(), calldata);

    await expect(
      killSwitch.executeTrade(0, ethers.parseUnits("10", 18), await target.getAddress(), calldata)
    ).to.be.revertedWithCustomError(killSwitch, "CooldownActive");
  });

  it("stops trading while paused", async function () {
    const { killSwitch, target } = await deployFixture();
    const calldata = target.interface.encodeFunctionData("perform", [ethers.toUtf8Bytes("x")]);

    await killSwitch.pause();

    await expect(
      killSwitch.executeTrade(0, ethers.parseUnits("10", 18), await target.getAddress(), calldata)
    ).to.be.revertedWithCustomError(killSwitch, "ContractPaused");
  });

  it("approves token spending and emits TokenApprovalSet", async function () {
    const { killSwitch, stranger } = await deployFixture();
    const mockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await mockERC20Factory.deploy();
    await mockERC20.waitForDeployment();

    const amount = ethers.parseUnits("500", 18);
    const killSwitchAddr = await killSwitch.getAddress();
    const tokenAddr = await mockERC20.getAddress();

    await expect(killSwitch.approveToken(tokenAddr, stranger.address, amount))
      .to.emit(killSwitch, "TokenApprovalSet")
      .withArgs(tokenAddr, stranger.address, amount);

    expect(await mockERC20.allowance(killSwitchAddr, stranger.address)).to.equal(amount);
  });

  it("reverts approveToken when called by non-owner", async function () {
    const { killSwitch, stranger } = await deployFixture();
    const mockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await mockERC20Factory.deploy();
    await mockERC20.waitForDeployment();

    const amount = ethers.parseUnits("500", 18);
    const tokenAddr = await mockERC20.getAddress();

    await expect(
      killSwitch.connect(stranger).approveToken(tokenAddr, stranger.address, amount)
    ).to.be.revertedWithCustomError(killSwitch, "NotOwner");
  });

  it("reverts approveToken for zero address token or spender", async function () {
    const { killSwitch, stranger } = await deployFixture();
    const amount = ethers.parseUnits("500", 18);

    await expect(
      killSwitch.approveToken(ethers.ZeroAddress, stranger.address, amount)
    ).to.be.revertedWithCustomError(killSwitch, "InvalidTarget");

    const mockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await mockERC20Factory.deploy();
    await mockERC20.waitForDeployment();
    const tokenAddr = await mockERC20.getAddress();

    await expect(
      killSwitch.approveToken(tokenAddr, ethers.ZeroAddress, amount)
    ).to.be.revertedWithCustomError(killSwitch, "InvalidTarget");
  });
});
