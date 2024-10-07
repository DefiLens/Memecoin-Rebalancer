// import { PublicClient } from 'viem';
// import { providers } from 'ethers';

// export class ViemProvider extends providers.BaseProvider {
//   private client: PublicClient;

//   constructor(client: PublicClient) {
//     super(8453);
//     this.client = client;
//   }

//   async perform(method: string, params: any): Promise<any> {
//     switch (method) {
//       case 'getBlockNumber':
//         return this.client.getBlockNumber();
//       case 'getGasPrice':
//         return this.client.getGasPrice();
//       case 'getBalance':
//         return this.client.getBalance({ address: params.address });
//       case 'getTransactionCount':
//         return this.client.getTransactionCount({ address: params.address });
//       case 'getCode':
//         return this.client.getBytecode({ address: params.address });
//       case 'getStorageAt':
//         return this.client.getStorageAt({ address: params.address, slot: params.position });
//       case 'call':
//         return this.client.call({
//           to: params.transaction.to,
//           data: params.transaction.data,
//         });
//       case 'estimateGas':
//         return this.client.estimateGas({
//           to: params.transaction.to,
//           data: params.transaction.data,
//         });
//       case 'getBlock':
//         if (params.blockTag) {
//           return this.client.getBlock({ blockNumber: params.blockTag });
//         }
//         return this.client.getBlock({ blockHash: params.blockHash });
//       case 'getTransaction':
//         return this.client.getTransaction({ hash: params.transactionHash });
//       case 'getTransactionReceipt':
//         return this.client.getTransactionReceipt({ hash: params.transactionHash });
//       default:
//         throw new Error(`Unsupported method: ${method}`);
//     }
//   }
// }