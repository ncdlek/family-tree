import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Plus, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const trees = await prisma.tree.findMany({
    where: { ownerId: session.user.id },
    include: { _count: { select: { people: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Family Trees</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}!
          </p>
        </div>
        <Link href={`/${locale}/trees/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Create Tree
          </Button>
        </Link>
      </div>

      {trees.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <TreePine className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">You don&apos;t have any family trees yet.</h2>
            <p className="text-muted-foreground">Create your first family tree to get started.</p>
            <Link href={`/${locale}/trees/new`}>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                Create New Tree
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree: any) => (
            <Card key={tree.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{tree.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {tree.isPublic ? "🌐" : "🔒"}
                  </span>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {tree.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{tree._count.people}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(tree.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/${locale}/trees/${tree.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Tree
                    </Button>
                  </Link>
                  <Link href={`/${locale}/trees/${tree.id}/edit`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
