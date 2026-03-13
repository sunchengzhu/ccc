import { Script } from "../ckb/index.js";
import { DEVNET_SCRIPTS } from "./clientPublicDevnet.advanced.js";
import { CellDepInfo } from "./clientTypes.js";
import { ClientJsonRpc } from "./jsonRpc/index.js";
import { KnownScript } from "./knownScript.js";

export class ClientPublicDevnet extends ClientJsonRpc {
  constructor(url = "http://127.0.0.1:8114", timeout?: number) {
    super(url, timeout != null ? { timeout } : undefined);
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
    if (!found) {
      throw new Error(
        `No script information was found for ${script} on ${this.addressPrefix}`,
      );
    }
    return {
      ...found,
      cellDeps: found.cellDeps.map((c) => CellDepInfo.from(c)),
    };
  }
}
