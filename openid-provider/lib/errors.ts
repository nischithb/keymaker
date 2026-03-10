export class EmailAlreadyExists extends Error {
  constructor() {
    super("Email already exists");
  }
}

export class SessionTokenAlreadyExists extends Error {
  constructor() {
    super("Session Token Already Exists");
  }
}
