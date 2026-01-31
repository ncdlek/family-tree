import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Users, Shield, Globe } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect(`/${(await params).locale}/dashboard`);
  }

  const t = (await import(`../../../../messages/${(await params).locale}.json`)).default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <TreePine className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            {t.nav.home}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.tree.noTreesYet}
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href={`/${(await params).locale}/signup`}>
              <Button size="lg">
                {t.auth.signUp}
              </Button>
            </Link>
            <Link href={`/${(await params).locale}/login`}>
              <Button size="lg" variant="outline">
                {t.auth.signIn}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Interactive Family Tree</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build and visualize your family history with our intuitive tree builder.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Control who sees your family information with advanced privacy controls.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Multi-Language</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full RTL support and multiple languages including English, Turkish, and Arabic.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
