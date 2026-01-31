import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const eventSchema = z.object({
  type: z.enum([
    "BIRTH",
    "DEATH",
    "MARRIAGE",
    "DIVORCE",
    "GRADUATION",
    "MILITARY",
    "IMMIGRATION",
    "CENSUS",
    "BURIAL",
    "CHRISTENING",
    "ENGAGEMENT",
    "ANNIVERSARY",
    "CUSTOM",
  ]),
  date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  sources: z.string().optional(),
});

// GET /api/people/[id]/events - Get all events for a person
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
    if (!isOwner && !person.isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const events = await prisma.event.findMany({
      where: { personId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/people/[id]/events - Create a new event
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
    const data = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        ...data,
        personId,
        date: data.date ? new Date(data.date) : null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
