"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const message = process.env.NODE_ENV === "production"
    ? "The portal hit an unexpected error."
    : error.message || "The portal hit an unexpected error.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <Button onClick={reset}>Try again</Button>
      </Card>
    </main>
  );
}
