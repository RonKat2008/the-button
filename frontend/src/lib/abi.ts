// Names (including typos) must match button.sol exactly.
export const BUTTON_ABI = [
  'function presssButton() payable',
  'function sell() payable',
  'function returnking() view returns (address)',
  'function returnproce() view returns (uint256)',
  'function returntransctions() view returns (address[][])',
  'function leaderboard() view returns (tuple(address person, uint256 boughtprice, uint256 prevtime, uint256 totaltime, bool exists)[])',
] as const
