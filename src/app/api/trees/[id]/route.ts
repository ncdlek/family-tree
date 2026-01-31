import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const treeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  hideLiving: z.boolean().optional(),
  language: z.string().optional(),
});

// GET /api/trees/[id] - Get a specific tree
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const tree = await prisma.tree.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        people: {
          include: {
            father: true,
            mother: true,
            spouses: {
              include: { spouse: true },
            },
            events: true,
            notes: true,
          },
        },
      },
    });

    if (!tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    // Check access permissions
    const isOwner = session?.user?.id === tree.ownerId;
    const isPublic = tree.isPublic;

    if (!isOwner && !isPublic) {
      // Check if user has been granted access
      const access = await prisma.treeAccess.findUnique({
        where: {
          treeId_userEmail: {
            treeId: id,
            userEmail: session?.user?.email || "",
          },
        },
      });

      if (!access) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Filter out private people if not owner
    if (!isOwner) {
      tree.people = tree.people.filter((person: any) => person.isPublic);

      // Also hide living people if setting is enabled
      if (tree.hideLiving) {
        tree.people = tree.people.filter((person: any) => !person.isLiving);
      }
    }

    return NextResponse.json({ tree });
  } catch (error) {
    console.error("Error fetching tree:", error);
    return NextResponse.json(
      { error: "Failed to fetch tree" },
      { status: 500 }
    );
  }
}

// PATCH /api/trees/[id] - Update a tree
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

    const tree = await prisma.tree.findUnique({
      where: { id },
    });

    if (!tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    if (tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = treeUpdateSchema.parse(body);

    const updatedTree = await prisma.tree.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { people: true },
        },
      },
    });

    return NextResponse.json({ tree: updatedTree });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating tree:", error);
    return NextResponse.json(
      { error: "Failed to update tree" },
      { status: 500 }
    );
  }
}

// DELETE /api/trees/[id] - Delete a tree
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

    const tree = await prisma.tree.findUnique({
      where: { id },
    });

    if (!tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    if (tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.tree.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tree:", error);
    return NextResponse.json(
      { error: "Failed to delete tree" },
      { status: 500 }
    );
  }
}
