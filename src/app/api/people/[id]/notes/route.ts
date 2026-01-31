import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const noteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  isPrivate: z.boolean().default(true),
});

// GET /api/people/[id]/notes - Get all notes for a person
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: personId } = await params;

    const person = await prisma.person.findUnique({
      where: { id: personId },
      include: { tree: true },
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    const isOwner = session?.user?.id === person.tree.ownerId;

    // Non-owners can only see public notes
    const notes = await prisma.note.findMany({
      where: {
        personId,
        ...(isOwner ? {} : { isPrivate: false }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST /api/people/[id]/notes - Create a new note
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: personId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const person = await prisma.person.findUnique({
      where: { id: personId },
      include: { tree: true },
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    if (person.tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = noteSchema.parse(body);

    const note = await prisma.note.create({
      data: {
        ...data,
        personId,
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
