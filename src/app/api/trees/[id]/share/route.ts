import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShareToken } from "@/lib/utils";

// POST /api/trees/[id]/share - Generate a new share token
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

    const shareToken = generateShareToken();

    const updatedTree = await prisma.tree.update({
      where: { id: treeId },
      data: { shareToken },
    });

    return NextResponse.json({ shareToken, tree: updatedTree });
  } catch (error) {
    console.error("Error generating share token:", error);
    return NextResponse.json(
      { error: "Failed to generate share token" },
      { status: 500 }
    );
  }
}

// PATCH /api/trees/[id]/share - Update share settings
export async function PATCH(
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
    const { isPublic, hideLiving } = body;

    const updatedTree = await prisma.tree.update({
      where: { id: treeId },
      data: {
        isPublic: isPublic !== undefined ? isPublic : tree.isPublic,
        hideLiving: hideLiving !== undefined ? hideLiving : tree.hideLiving,
      },
    });

    return NextResponse.json({ tree: updatedTree });
  } catch (error) {
    console.error("Error updating share settings:", error);
    return NextResponse.json(
      { error: "Failed to update share settings" },
      { status: 500 }
    );
  }
}

// GET /api/trees/[id]/share/access - Get list of users with access
export async function GET(
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

    const accessList = await prisma.treeAccess.findMany({
      where: { treeId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json({ accessList });
  } catch (error) {
    console.error("Error fetching access list:", error);
    return NextResponse.json(
      { error: "Failed to fetch access list" },
      { status: 500 }
    );
  }
}
