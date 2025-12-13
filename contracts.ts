import type { Contracts } from "./.lib/types";

export default {
  eth: {
    bracket: {
      bravUSDC: "0x9f96E4B65059b0398B922792d3fF9F10B4567533",
      wbravUSDC: "0x7309E1E2e74af170c69bdE8FCB30397f8697D5FF",
    },
    morpho: {
      morpho: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
      ethereumGeneralAdapter1: "0x4A6c312ec70E8747a587EE860a0353cd42Be0aE0", // extends GeneralAdapter1
    },
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    fluid: {
      fUsdc: "0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33",
    },
    aave: {
      poolV3: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    },
    rethink: {
      admin: "0xCC3F40e6C7E9A3B214E524B88a5f47Fece1a8Acb",
    },
  },
} as const satisfies Contracts;
