import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const personSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  maidenName: z.string().optional(),
  suffix: z.string().optional(),
  nickname: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  isLiving: z.boolean().default(true),
  isPublic: z.boolean().default(false),
  photoUrl: z.string().optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
});

// GET /api/trees/[id]/people - Get all people in a tree
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: treeId } = await params;

    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
    });

    if (!tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    const isOwner = session?.user?.id === tree.ownerId;

    const people = await prisma.person.findMany({
      where: { treeId },
      include: {
        father: true,
        mother: true,
        spouses: {
          include: { spouse: true },
        },
        events: true,
        notes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Filter based on access
    if (!isOwner) {
      return NextResponse.json({
        people: people.filter((p: any) => p.isPublic && (tree.hideLiving ? !p.isLiving : true)),
      });
    }

    return NextResponse.json({ people });
  } catch (error) {
    console.error("Error fetching people:", error);
    return NextResponse.json(
      { error: "Failed to fetch people" },
      { status: 500 }
    );
  }
}

// POST /api/trees/[id]/people - Create a new person
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: treeId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
    });

    if (!tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    if (tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = personSchema.parse(body);

    // Check for circular relationships
    if (data.fatherId && data.fatherId === data.motherId) {
      return NextResponse.json(
        { error: "Father and mother cannot be the same person" },
        { status: 400 }
      );
    }

    const person = await prisma.person.create({
      data: {
        ...data,
        treeId,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        deathDate: data.deathDate ? new Date(data.deathDate) : null,
      },
      include: {
        father: true,
        mother: true,
        spouses: {
          include: { spouse: true },
        },
        events: true,
        notes: true,
      },
    });

    return NextResponse.json({ person }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating person:", error);
    return NextResponse.json(
      { error: "Failed to create person" },
      { status: 500 }
    );
  }
}
