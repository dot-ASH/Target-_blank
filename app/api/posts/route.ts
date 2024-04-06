import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

type MyData = {
  id: string;
  title: string;
  postby: string;
  description: string;
  author: string;
  type: string;
  category: string;
  thumbimage: string;
  content: string;
  reference: string;
  contentfilelink: string;
};

export async function GET() {
  const posts = await sql`SELECT * FROM posts;`;
  return NextResponse.json(posts.rows, { status: 200 });
}

export async function POST(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to work for" }),
      { status: 500 }
    );
  }

  try {
    const result = await sql`
    INSERT INTO posts (title, postby, description, author, type, category, thumbimage, content, reference, contentfilelink)
    VALUES (${res.title}, ${res.postby}, ${res.description}, ${res.author}, ${res.type}, ${res.category}, ${res.thumbimage}, ${res.content}, ${res.reference}, ${res.contentfilelink})
  `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to work for" }),
      { status: 500 }
    );
  }

  try {
    const result = await sql`
      UPDATE posts
      SET title = ${res.title},
          description = ${res.description},
          author = ${res.author},
          content = ${res.content},
          reference = ${res.reference}
      WHERE id = ${res.id}
    `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to work for" }),
      { status: 500 }
    );
  }

  try {
    const result = await sql`DELETE FROM posts WHERE id = ${res.id}; `;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
