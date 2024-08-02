import { SignerBtcMock } from "./SignerBtcMock";
import { CellDepLike, CellOutputLike, ScriptLike, TransactionLike } from "../ckb";
import { ClientPublicDevnet } from "../client/clientPublicDevnet";


// 创建 MockClient 实例
let client = new ClientPublicDevnet();
// 创建 SignerBtcMock 实例
let signer = new SignerBtcMock(client);

async function testSignerBtcMock() {
  const cellDeps: CellDepLike[] = [
    {
      depType: 'depGroup',
      outPoint: {
        txHash: '0x75be96e1871693f030db27ddae47890a28ab180e88e36ebb3575d9f1377d3da7',
        index: 0
      }
    },
    {
      depType: 'code',
      outPoint: {
        txHash: '0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467',
        index: 7
      }
    }
  ];
  const outputs: CellOutputLike[] = [
    {
      capacity: "20000000000",
      lock: {
        args: '0x129858effd232b4033e47d90003d41ec34ecaeda9400',
        codeHash: '0x9c6933d977360f115a3e9cd5a2e0e475853681b80d775d93ad0f8969da343e56',
        hashType: 'type'
      } as ScriptLike  // 确保对象符合 ScriptLike 类型
    },
    {
      capacity: "79999999474",  // 使用字符串表示 capacity
      lock: {
        args: '0x046499d1ba2411cdbbe06ba5416ef5232506ff282800',
        codeHash: '0x9c6933d977360f115a3e9cd5a2e0e475853681b80d775d93ad0f8969da343e56',
        hashType: 'type'
      } as ScriptLike
    }
  ];

  const transactionLike: TransactionLike = {
    version: BigInt(0),
    cellDeps: cellDeps,
    headerDeps: [],
    inputs: [
      {
        previousOutput: {
          txHash: '0xac17cb8624d66aebe0650b9112157b7e9e1dea85d05d190636997e01dbd005c9',
          index: 0
        },
        since: BigInt(0)
      }
    ],
    outputs: outputs,
    outputsData: ["0x", "0x"],
    witnesses: []
  };

  const preparedTransaction = await signer.prepareTransaction(transactionLike);
  console.log("preparedTransaction: ", preparedTransaction);
  const messageRaw = await signer.getMessageRaw(preparedTransaction)
  console.log(messageRaw)
  // 可以在浏览器上执行下面命令得到签名
  // const signStr='CKB (Bitcoin Layer) transaction: 0x83d552400f7f3c80acbeb29664ee9a65c725179f5e9cf62f8b93c0e5dfe6d460'
  // await window.okxwallet.bitcoinTestnet.signMessage(signStr, 'ecdsa')
  const signatureStr = "IB6BgnFDx9TTxnPa72gsOM54a4RwH+8vJ2LGJ00KyNw3bIDB8UspwN2n+ZeHoRVrpqOqwnEzFcqKdpTnV7K2Ais="
  const signOnlyTransaction = await signer.fillWitness(preparedTransaction, signatureStr);
  console.log("signOnlyTransaction: ", signOnlyTransaction);
  try {
    const response = await client.sendTransaction(signOnlyTransaction);
    console.log('txHash :', response);
  } catch (error) {
    console.error('Failed to send transaction:', error);
  }
}


testSignerBtcMock();
