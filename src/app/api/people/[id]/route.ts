import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const personUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  maidenName: z.string().optional(),
  suffix: z.string().optional(),
  nickname: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  isLiving: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  photoUrl: z.string().optional(),
  fatherId: z.string().nullable().optional(),
  motherId: z.string().nullable().optional(),
});

// GET /api/people/[id] - Get a specific person
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const person = await prisma.person.findUnique({
      where: { id },
      include: {
        tree: true,
        father: true,
        mother: true,
        spouses: {
          include: { spouse: true },
        },
        childrenAsFather: {
          include: {
            father: true,
            mother: true,
          },
        },
        childrenAsMother: {
          include: {
            father: true,
            mother: true,
          },
        },
        events: {
          orderBy: { date: "asc" },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    // Check access
    const isOwner = session?.user?.id === person.tree.ownerId;
    const isPublic = person.isPublic;

    if (!isOwner && !isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ person });
  } catch (error) {
    console.error("Error fetching person:", error);
    return NextResponse.json(
      { error: "Failed to fetch person" },
      { status: 500 }
    );
  }
}

// PATCH /api/people/[id] - Update a person
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const person = await prisma.person.findUnique({
      where: { id },
      include: { tree: true },
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    if (person.tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = personUpdateSchema.parse(body);

    // Check for circular relationships
    const personId = id;
    if (data.fatherId === personId || data.motherId === personId) {
      return NextResponse.json(
        { error: "A person cannot be their own parent" },
        { status: 400 }
      );
    }

    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        deathDate: data.deathDate ? new Date(data.deathDate) : undefined,
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

    return NextResponse.json({ person: updatedPerson });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating person:", error);
    return NextResponse.json(
      { error: "Failed to update person" },
      { status: 500 }
    );
  }
}

// DELETE /api/people/[id] - Delete a person
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const person = await prisma.person.findUnique({
      where: { id },
      include: { tree: true },
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    if (person.tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.person.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting person:", error);
    return NextResponse.json(
      { error: "Failed to delete person" },
      { status: 500 }
    );
  }
}
