import killPort from 'kill-port';
import { execSync } from 'node:child_process';

const PORTS = [3000, 24678];

async function recoverPorts() {
  console.log('[DEVOPS] INITIATING AUTOMATED PORT RECOVERY...');
  for (const port of PORTS) {
    try {
      console.log(`[DEVOPS] SCANNING PORT ${port}...`);
      await killPort(port, 'tcp');
      console.log(`[DEVOPS] PORT ${port} RECOVERED SUCCESSFULLY.`);
    } catch (e) {
      // killPort might throw if the port is not in use, which is fine
      console.log(`[DEVOPS] PORT ${port} ALREADY FREE OR RECOVERY SKIPPED.`);
    }
  }
}

recoverPorts().catch(err => {
  console.error('[CRITICAL] PORT RECOVERY FAILED:', err);
  process.exit(1);
});
