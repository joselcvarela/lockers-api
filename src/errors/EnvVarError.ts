export class EnvVarRequiredError extends Error {
  constructor(envVarName: string) {
    super(`Environment Variable Required: ${envVarName}`);
  }
}
