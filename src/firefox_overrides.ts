type FirefoxUserPrefs = { [key: string]: string | number | boolean };

const DEFAULT_DEBUGGING_SERVER_PORT = 6000;

export class FirefoxOverrides {
  constructor(
    private readonly defaultDebuggingServerPort = DEFAULT_DEBUGGING_SERVER_PORT
  ) {}

  debuggingServerPortArgs(args: string[] = []): {
    args: string[];
    port: number;
  } {
    const index = args.findIndex((arg) =>
      arg.includes("start-debugger-server")
    );
    if (index === -1) {
      return {
        args: args.concat(
          "--start-debugger-server",
          String(this.defaultDebuggingServerPort)
        ),
        port: this.defaultDebuggingServerPort,
      };
    }

    const port = parseInt(args[index + 1], 10);
    if (isNaN(port)) {
      throw new Error(`invalid argument: ${args[index]} ${args[index + 1]}`);
    }
    return { args, port };
  }

  userPrefs(prefs: FirefoxUserPrefs = {}): FirefoxUserPrefs {
    const DEVTOOLS_DEBUGGER_REMOTE_ENABLED = "devtools.debugger.remote-enabled";
    const DEVTOOLS_DEBUGGER_PROMPT_CONNECTION =
      "devtools.debugger.prompt-connection";
    const newPrefs = { ...prefs };

    const remoteEnabled = prefs[DEVTOOLS_DEBUGGER_REMOTE_ENABLED];
    if (typeof remoteEnabled === "undefined") {
      newPrefs[DEVTOOLS_DEBUGGER_REMOTE_ENABLED] = true;
    } else if (remoteEnabled !== true) {
      throw new Error(`${DEVTOOLS_DEBUGGER_REMOTE_ENABLED} must be true`);
    }

    const promptConnection = prefs[DEVTOOLS_DEBUGGER_PROMPT_CONNECTION];
    if (typeof promptConnection === "undefined") {
      newPrefs[DEVTOOLS_DEBUGGER_PROMPT_CONNECTION] = false;
    } else if (promptConnection !== false) {
      throw new Error(`${DEVTOOLS_DEBUGGER_PROMPT_CONNECTION} must be false`);
    }
    return newPrefs;
  }
}
