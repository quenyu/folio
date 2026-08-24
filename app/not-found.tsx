import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="command">artem@portfolio ~ % locate page</p>
      <pre aria-hidden="true">{String.raw`┌──────────────┐
│  404 / NULL  │
└──────────────┘`}</pre>
      <h1>Такого маршрута нет.</h1>
      <p>Похоже, ссылка устарела или в адресе есть опечатка.</p>
      <Link className="primary-link" href="/">▸ вернуться в портфолио</Link>
    </main>
  );
}
