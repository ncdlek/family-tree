import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  accessLevel: z.enum(["VIEW", "EDIT", "ADMIN"]),
});

// POST /api/trees/[id]/invite - Invite a user to collaborate
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
    const { email, accessLevel } = inviteSchema.parse(body);

    // Check if user already has access
    const existingAccess = await prisma.treeAccess.findUnique({
      where: {
        treeId_userEmail: {
          treeId,
          userEmail: email,
        },
      },
    });

    if (existingAccess) {
      return NextResponse.json(
        { error: "User already has access to this tree" },
        { status: 400 }
      );
    }

    // Create access record
    const access = await prisma.treeAccess.create({
      data: {
        treeId,
        userEmail: email,
        accessLevel,
      },
    });

    // TODO: Send email invitation
    // For now, just return the access record

    return NextResponse.json({ access }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error inviting user:", error);
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    );
  }
}

// DELETE /api/trees/[id]/invite - Revoke access
export async function DELETE(
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
    const { accessId } = body;

    if (!accessId) {
      return NextResponse.json(
        { error: "accessId is required" },
        { status: 400 }
      );
    }

    await prisma.treeAccess.delete({
      where: { id: accessId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking access:", error);
    return NextResponse.json(
      { error: "Failed to revoke access" },
      { status: 500 }
    );
  }
}
