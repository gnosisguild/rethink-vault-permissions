import contracts from "../../contracts";
import { allowErc20Approve } from "../../helpers";

const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const { ethereumGeneralAdapter1 } = contracts.eth.morpho;

const adminContract = "0xCC3F40e6C7E9A3B214E524B88a5f47Fece1a8Acb";

const smokehouseUsdc = "0xBEeFFF209270748ddd194831b3fa287a5386f5bC";
const gauntletUsdc = "0xc582F04d8a82795aa2Ff9c8bb4c1c889fe7b754e";
const clearstarUsdc = "0x9B5E92fd227876b4C07a8c02367E2CB23c639DfA";

const allowMorphoUsdcDeposit = (vaultToken: `0x${string}`) => {
  return [
    ...allowErc20Approve([usdc], ethereumGeneralAdapter1),
    allow.eth.morpho.ethereumGeneralAdapter1.erc20TransferFrom(
      usdc,
      ethereumGeneralAdapter1,
    ),
    allow.eth.morpho.ethereumGeneralAdapter1.erc4626Deposit(
      vaultToken,
      undefined,
      undefined,
      c.avatar,
    ),
    allow.eth.morpho.ethereumGeneralAdapter1.erc20TransferFrom(
      usdc,
      c.avatar,
      undefined,
    ),
    allow.eth.morpho.ethereumGeneralAdapter1.erc20Transfer(
      vaultToken,
      c.avatar,
      undefined,
    ),
  ];
};

const allowMorphoUsdcWithdraw = (vaultToken: `0x${string}`) => {
  return [
    ...allowErc20Approve([vaultToken], ethereumGeneralAdapter1),

    allow.eth.morpho.ethereumGeneralAdapter1.erc4626Redeem(
      vaultToken,
      undefined,
      undefined,
      c.avatar,
      c.avatar,
    ),
    allow.eth.morpho.ethereumGeneralAdapter1.erc20Transfer(
      vaultToken,
      c.avatar,
      undefined,
    ),
    allow.eth.morpho.ethereumGeneralAdapter1.erc20Transfer(
      usdc,
      c.avatar,
      undefined,
    ),
  ];
};

export default [
  ///// AAVE PERMISSIONS /////
  ...allowErc20Approve([usdc], contracts.eth.aave.poolV3),
  allow.eth.aave.poolV3.supply(usdc, undefined, c.avatar, undefined),
  allow.eth.aave.poolV3.withdraw(usdc, undefined, c.avatar),

  ///// FLUID PERMISSIONS /////
  ...allowErc20Approve([usdc], contracts.eth.fluid.fUsdc),
  allow.eth.fluid.fUsdc["deposit(uint256,address)"](undefined, c.avatar),
  allow.eth.fluid.fUsdc["deposit(uint256,address,uint256)"](
    undefined,
    c.avatar,
    undefined,
  ),
  allow.eth.fluid.fUsdc["withdraw(uint256,address,address)"](
    undefined,
    c.avatar,
    c.avatar,
  ),
  allow.eth.fluid.fUsdc["withdraw(uint256,address,address,uint256)"](
    undefined,
    c.avatar,
    c.avatar,
    undefined,
  ),

  ///// MORPHO PERMISSIONS /////

  // authorize ethereumGeneralAdapter1
  allow.eth.morpho.morpho.setAuthorization(ethereumGeneralAdapter1, true),

  allowMorphoUsdcDeposit(smokehouseUsdc),
  allowMorphoUsdcWithdraw(smokehouseUsdc),
  allowMorphoUsdcDeposit(clearstarUsdc),
  allowMorphoUsdcWithdraw(clearstarUsdc),
  allowMorphoUsdcDeposit(gauntletUsdc),
  allowMorphoUsdcWithdraw(gauntletUsdc),

  ///// RETHINK ADMIN CONTRACT PERMISSIONS /////

  allow.eth.usdc.transfer(adminContract, undefined),
  {
    targetAddress: adminContract,
    selector: "0xa61f5814",
    condition: c.calldataMatches(
      ["0x6bcbc7959ce79b8f27efe1eae504f98cbe2647a8"],
      ["address"],
    ),
  },
] satisfies Permissions;
