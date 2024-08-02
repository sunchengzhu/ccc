import { SignerBtc } from "../signer";
import { hexFrom, HexLike } from "../hex";
import { Client } from "../client";
import { Transaction, TransactionLike, WitnessArgs } from "../ckb";
import { bytesConcat, bytesFrom } from "../bytes";
import { numToBytes } from "../num";


export class SignerBtcMock extends SignerBtc {
  constructor(client: Client) {
    super(client);
  }

  async getBtcPublicKey(): Promise<HexLike> {
    // 可以在浏览器上执行这个命令得到公钥：await window.okxwallet.bitcoinTestnet.connect()
    return "0255355ca83c973f1d97ce0e3843c85d78905af16b4dc531bc488e57212d230116";
  }


  async getBtcAccount(): Promise<string> {
    // 返回当前的 Bitcoin 账户地址
    return "tb1p8wpt9v4frpf3tkn0srd97pksgsxc5hs52lafxwru9kgeephvs7rqlqt9zj";
  }

  async getMessageRaw(txLike: TransactionLike): Promise<string> {
    const tx = Transaction.from(txLike);
    const {script} = await this.getRecommendedAddressObj();
    const info = await tx.getSignHashInfo(script, this.client);
    return `CKB (Bitcoin Layer) transaction: ${info?.message}`
  }

  async fillWitness(txLike: TransactionLike, signatureStr: string): Promise<Transaction> {
    const tx = Transaction.from(txLike);
    const {script} = await this.getRecommendedAddressObj();
    const info = await tx.getSignHashInfo(script, this.client);
    if (!info) {
      return tx;
    }

    const signature = bytesFrom(
      signatureStr,
      "base64",
    );
    signature[0] = 31 + ((signature[0] - 27) % 4);

    const witness = WitnessArgs.fromBytes(tx.witnesses[info.position]);
    witness.lock = hexFrom(
      bytesConcat(
        numToBytes(5 * 4 + signature.length, 4),
        numToBytes(4 * 4, 4),
        numToBytes(5 * 4 + signature.length, 4),
        numToBytes(5 * 4 + signature.length, 4),
        numToBytes(signature.length, 4),
        signature,
      ),
    );

    tx.setWitnessArgsAt(info.position, witness);
    return tx;
  }

  // 没什么用 但是不这个方法加编译会报错
  async connect(): Promise<void> {
    console.log("Connected to Bitcoin service");
  }

  // 没什么用 但是不这个方法加编译会报错
  async isConnected(): Promise<boolean> {
    return true;
  }
}
