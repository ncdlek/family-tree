import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/trees/[id]/export - Export tree data
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: treeId } = await params;

    const searchParams = new URL(req.url).searchParams;
    const format = searchParams.get("format") || "json";
    const includePrivate = searchParams.get("includePrivate") === "true";
    const includeNotes = searchParams.get("includeNotes") === "true";
    const includeSources = searchParams.get("includeSources") === "true";

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
      include: {
        people: {
          include: {
            spouses: {
              include: { spouse: true },
            },
            events: includeSources,
            notes: includeNotes,
          },
        },
      },
    });

    if (!tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    if (tree.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (format === "json") {
      return NextResponse.json({
        tree: {
          id: tree.id,
          name: tree.name,
          description: tree.description,
          exportedAt: new Date().toISOString(),
          people: tree.people,
        },
      });
    }

    if (format === "csv") {
      // Generate CSV format
      const headers = ["ID", "First Name", "Middle Name", "Last Name", "Gender", "Birth Date", "Death Date", "Father ID", "Mother ID"];
      const rows = tree.people.map((person: any) => [
        person.id,
        person.firstName,
        person.middleName || "",
        person.lastName || "",
        person.gender,
        person.birthDate ? person.birthDate.toISOString().split("T")[0] : "",
        person.deathDate ? person.deathDate.toISOString().split("T")[0] : "",
        person.fatherId || "",
        person.motherId || "",
      ]);

      const csv = [headers.join(","), ...rows.map((row: any) => row.join(","))].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${tree.name.replace(/\s+/g, "_")}_export.csv"`,
        },
      });
    }

    if (format === "gedcom") {
      // Basic GEDCOM export
      let gedcom = "0 HEAD\n1 SOUR FamilyTree\n1 GEDC\n2 VERS 5.5\n1 CHAR UTF-8\n";

      tree.people.forEach((person: any) => {
        gedcom += `0 @${person.id}@ INDI\n`;
        gedcom += `1 NAME ${person.firstName} /${person.lastName || ""}/\n`;
        gedcom += `1 SEX ${person.gender === "MALE" ? "M" : person.gender === "FEMALE" ? "F" : "U"}\n`;

        if (person.birthDate) {
          gedcom += `1 BIRT\n2 DATE ${person.birthDate.toISOString().split("T")[0]}\n`;
        }
        if (person.deathDate) {
          gedcom += `1 DEAT\n2 DATE ${person.deathDate.toISOString().split("T")[0]}\n`;
        }
        if (person.fatherId) {
          gedcom += `1 FAMC @${person.fatherId}@\n`;
        }
        if (person.motherId) {
          gedcom += `1 FAMC @${person.motherId}@\n`;
        }
      });

      gedcom += "0 TRLR\n";

      return new NextResponse(gedcom, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="${tree.name.replace(/\s+/g, "_")}.ged"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting tree:", error);
    return NextResponse.json(
      { error: "Failed to export tree" },
      { status: 500 }
    );
  }
}
