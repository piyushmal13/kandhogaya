import killPort from 'kill-port';

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
      if (e instanceof Error) {
        console.log(`[DEVOPS] PORT ${port} ALREADY FREE OR RECOVERY SKIPPED. (${e.message})`);
      } else {
        console.log(`[DEVOPS] PORT ${port} ALREADY FREE OR RECOVERY SKIPPED.`);
      }
    }
  }
}

try {
  await recoverPorts();
} catch (err) {
  console.error('[CRITICAL] PORT RECOVERY FAILED:', err);
  process.exit(1);
}
