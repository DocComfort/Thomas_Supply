import { APP_NAME } from "@thomas-supply/shared";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { marketingSiteUrl } from "@/lib/site-links";

const demoUsers = [
  "owner@acme.test",
  "purchaser@acme.test",
  "tech@acme.test",
  "admin@thomassupply.test",
  "sales@thomassupply.test"
];

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{APP_NAME}</CardTitle>
          <CardDescription>Demo login for approved dealers and Thomas Supply staff.</CardDescription>
        </CardHeader>
        <a
          href={marketingSiteUrl}
          className="mb-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Back to Thomas Supply
        </a>
        {searchParams?.error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
            {searchParams.error}
          </div>
        )}
        <form action="/api/auth/demo-login" method="post" className="space-y-4">
          <label className="grid gap-2 text-sm font-medium">
            Email
            <Input name="email" type="email" placeholder="owner@acme.test" required />
          </label>
          <Button className="w-full" type="submit">Sign in</Button>
        </form>
        <div className="mt-5 rounded-md bg-muted p-3 text-xs text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">Demo users</p>
          <ul className="space-y-1">
            {demoUsers.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </div>
      </Card>
    </main>
  );
}
