/**
 * USDT Deposit Address Configuration
 *
 * CRITICAL: These addresses are the source of truth for all crypto deposits.
 * Any modification requires double-verification by authorized personnel.
 *
 * Asset: USDT (TetherUS)
 * Supported Networks: BSC (BEP20), TRX (TRC20), ETH (ERC20), TON
 */

export interface CryptoNetwork {
  id: string;
  name: string;
  fullName: string;
  address: string;
  contractSuffix: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  confirmations: number;
  estimatedTime: string;
  gasFeeNote: string;
}

export const USDT_NETWORKS: CryptoNetwork[] = [
  {
    id: "bsc",
    name: "BSC",
    fullName: "BNB Smart Chain (BEP20)",
    address: "0xbe270b3c5c2fb38e14c369142e99aace7801e160",
    contractSuffix: "97955",
    icon: "BNB",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    confirmations: 15,
    estimatedTime: "~3 minutes",
    gasFeeNote: "BNB gas fees apply (~$0.10)",
  },
  {
    id: "trx",
    name: "TRX",
    fullName: "Tron (TRC20)",
    address: "TDfzzcckJJAWmabdetzRzDtk2YYjwTrzeH",
    contractSuffix: "jLj6t",
    icon: "TRX",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    confirmations: 20,
    estimatedTime: "~1 minute",
    gasFeeNote: "TRX energy/bandwidth fees (~1 USDT)",
  },
  {
    id: "eth",
    name: "ETH",
    fullName: "Ethereum (ERC20)",
    address: "0xbe270b3c5c2fb38e14c369142e99aace7801e160",
    contractSuffix: "31ec7",
    icon: "ETH",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    confirmations: 12,
    estimatedTime: "~5 minutes",
    gasFeeNote: "ETH gas fees apply (~$2-15)",
  },
  {
    id: "ton",
    name: "TON",
    fullName: "The Open Network (TON)",
    address: "UQAkVM8mDZVWf3o-YOdC0SqP27AWczUrfZeUhktEbJ4et3Y9",
    contractSuffix: "d_sDs",
    icon: "TON",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
    confirmations: 1,
    estimatedTime: "~5 seconds",
    gasFeeNote: "TON gas fees apply (~$0.01)",
  },
];

/** Get network by id — used for verification lookups */
export function getNetworkById(id: string): CryptoNetwork | undefined {
  return USDT_NETWORKS.find((n) => n.id === id);
}

/** Verify an address matches the canonical address for a network — double verification */
export function verifyDepositAddress(networkId: string, address: string): boolean {
  const network = getNetworkById(networkId);
  if (!network) return false;
  return network.address === address;
}
