import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Users, Shield, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (session?.user) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-8 animate-fade-in">
              <TreePine className="h-8 w-8 text-white" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Family Tree
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Preserve your family history with our beautiful interactive tree builder
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link href={`/${locale}/signup` className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40">
                  Get Started Free
                </Button>
              </Link>
              <Link href={`/${locale}/login`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <p className="text-sm text-gray-500 mt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              No credit card required • Free forever
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Tree</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Beautiful drag-and-drop interface to build and visualize your family connections
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Control who sees your information with advanced privacy controls
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Full RTL support with English, Turkish, and Arabic
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create your tree</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start by adding family members and their relationships
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Add details</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Include photos, dates, events, and stories
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Share & collaborate</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Invite family members to contribute and view your tree
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to preserve your family legacy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Start building your family tree today. It's free forever.
            </p>
            <Link href={`/${locale}/signup`}>
              <Button size="lg" className="rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
