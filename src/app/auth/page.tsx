"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { email, redirect: false });
    if (res?.error) setError(res.error);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication</h1>
      {session ? (
        <div className="border rounded p-4 bg-white shadow">
          <div className="mb-2">Signed in as <b>{session.user?.email}</b></div>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <form onSubmit={handleSignIn} className="border rounded p-4 bg-white shadow flex flex-col gap-2 max-w-sm">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border rounded px-3 py-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      )}
    </main>
  );
}
