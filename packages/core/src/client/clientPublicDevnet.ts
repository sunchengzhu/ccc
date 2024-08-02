import { Script } from "../ckb/index.js";
import { CellDepInfo, KnownScript } from "./client.js";
import { DEVNET_SCRIPTS } from "./clientPublicDevnet.advanced.js";
import { ClientJsonRpc } from "./jsonRpc/index.js";

export class ClientPublicDevnet extends ClientJsonRpc {
  constructor(url = "http://127.0.0.1:8114", timeout?: number) {
    super(url, timeout);
  }

  get addressPrefix(): string {
    return "ckt";
  }

  async getKnownScript(
    script: KnownScript,
  ): Promise<
    Pick<Script, "codeHash" | "hashType"> & { cellDeps: CellDepInfo[] }
  > {
    const found = DEVNET_SCRIPTS[script];
    return {
      ...found,
      cellDeps: found.cellDeps.map((c) => CellDepInfo.from(c)),
    };
  }
}
