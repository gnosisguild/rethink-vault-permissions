import contracts from "../../contracts";
import { allowErc20Approve } from "../../helpers";

const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const bravUSDC = "0x9f96E4B65059b0398B922792d3fF9F10B4567533";
const wbravUSDC = "0x7309E1E2e74af170c69bdE8FCB30397f8697D5FF";

const { ethereumGeneralAdapter1 } = contracts.eth.morpho;

const morphoChainlinkOracleV2 = "0x6bac818df5654ea824ce723de51d7c7d9fd2f4ff";
const adaptiveCurveIrm = "0x870ac11d48b15db9a138cf899d20f13f79ba00bc";

const marketParamsScoping = {
  loanToken: usdc,
  collateralToken: wbravUSDC,
  oracle: morphoChainlinkOracleV2,
  irm: adaptiveCurveIrm,
  // do we wanna set a max limit on lltv?
};

export default [
  ///// BRACKET PERMISSIONS /////

  // deposit usdc to bravUSDC
  allowErc20Approve([usdc], bravUSDC),
  allow.eth.bracket.bravUSDC.deposit(undefined, c.avatar),
  allow.eth.bracket.bravUSDC.withdraw(),

  // wrap/unwrap bravUSDC
  allowErc20Approve([bravUSDC], wbravUSDC),
  allow.eth.bracket.wbravUSDC.wrap(undefined),
  allow.eth.bracket.wbravUSDC.unwrap(undefined),

  ///// MORPHO PERMISSIONS /////

  // authorize ethereumGeneralAdapter1
  allow.eth.morpho.morpho.setAuthorization(ethereumGeneralAdapter1, true),

  // supply wbravUSDC as collateral
  ...allowErc20Approve([wbravUSDC], ethereumGeneralAdapter1),
  allow.eth.morpho.ethereumGeneralAdapter1.erc20TransferFrom(
    wbravUSDC,
    ethereumGeneralAdapter1,
  ),
  allow.eth.morpho.ethereumGeneralAdapter1.morphoSupplyCollateral(
    marketParamsScoping,
    undefined, // allow any amount
    c.avatar, // onBehalfOf must be the avatar
    "0x", // data
  ),

  // borrow USDC
  allow.eth.morpho.ethereumGeneralAdapter1.morphoBorrow(
    marketParamsScoping,
    undefined, // assets
    undefined, // shares
    undefined, // minSharePrice
    c.avatar, // receiver must be the avatar
  ),

  // repay USDC
  ...allowErc20Approve([usdc], ethereumGeneralAdapter1),
  allow.eth.morpho.ethereumGeneralAdapter1.erc20TransferFrom(
    usdc,
    ethereumGeneralAdapter1,
  ),
  allow.eth.morpho.ethereumGeneralAdapter1.morphoRepay(
    marketParamsScoping,
    undefined, // assets
    undefined, // shares
    undefined, // maxSharePrice
    c.avatar, // receiver must be the avatar
    "0x", // data
  ),

  // withdraw wbravUSDC collateral
  allow.eth.morpho.ethereumGeneralAdapter1.morphoWithdrawCollateral(
    marketParamsScoping,
    undefined, // assets
    c.avatar, // receiver must be the avatar
  ),

  // transfer USDC to admin module
  allow.eth.usdc.transfer(
    "0xd245A74898124ae10DE4DB5ec842032042654F0d",
    undefined,
  ),
  {
    targetAddress: "0xd245A74898124ae10DE4DB5ec842032042654F0d",
    selector: "0xa61f5814",
    condition: c.calldataMatches(
      ["0x6bcbc7959ce79b8f27efe1eae504f98cbe2647a8"],
      ["address"],
    ),
  },
] satisfies Permissions;
