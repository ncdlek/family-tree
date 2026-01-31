import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const treeSchema = z.object({
  name: z.string().min(1, "Tree name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  hideLiving: z.boolean().default(true),
  language: z.string().default("en"),
});

// GET /api/trees - Get all trees for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trees = await prisma.tree.findMany({
      where: { ownerId: session.user.id },
      include: {
        _count: {
          select: { people: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ trees });
  } catch (error) {
    console.error("Error fetching trees:", error);
    return NextResponse.json(
      { error: "Failed to fetch trees" },
      { status: 500 }
    );
  }
}

// POST /api/trees - Create a new tree
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = treeSchema.parse(body);

    const tree = await prisma.tree.create({
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        hideLiving: data.hideLiving,
        language: data.language,
        ownerId: session.user.id,
      },
      include: {
        _count: {
          select: { people: true },
        },
      },
    });

    return NextResponse.json({ tree }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating tree:", error);
    return NextResponse.json(
      { error: "Failed to create tree" },
      { status: 500 }
    );
  }
}
