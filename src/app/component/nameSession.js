"use client";

import Link from "next/link";

export default function NameSession({ user }) {
  return (
    <>
      {user ? (
        <div>
          <h3>Hay, {user.name}</h3>
          <button>Logout</button>
        </div>
      ) : (
        <Link href="/login">
          Login
        </Link>
      )}
    </>
  );
}
