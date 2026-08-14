// Keep unit tests self-contained: no local .env or database is required when
// services are mocked. Real values from the environment always take priority.
process.env.DATABASE_URL ??=
  'postgresql://investra_test:investra_test@localhost:5432/investra_test';
process.env.JWT_SECRET ??= 'investra-jest-only-secret';
process.env.NODE_ENV = 'test';
