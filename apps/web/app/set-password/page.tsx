import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setPasswordAction } from "./actions";

export const dynamic = "force-dynamic";

export default function SetPasswordPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set your password</CardTitle>
          <CardDescription>
            Choose a password to finish setting up your Thomas Supply portal
            login.
          </CardDescription>
        </CardHeader>
        {searchParams?.error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
            {searchParams.error}
          </div>
        )}
        <form action={setPasswordAction} className="space-y-4">
          <label className="grid gap-2 text-sm font-medium">
            New password
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Confirm password
            <Input
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <Button className="w-full" type="submit">
            Save password &amp; sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}
