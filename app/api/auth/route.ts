import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

type MyData = {
  id: string;
  email: string;
  user: string;
  hashpass: string;
  pwd: string;
};

export async function POST(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to work for" }),
      { status: 500 }
    );
  }

  try {
    const users = await sql`SELECT id, username, email, password
  FROM users
  WHERE username = ${res.user};`;
    if (users.rowCount < 1) {
      return NextResponse.json({ error: "not autherized" }, { status: 401 });
    }
    const isSamePass = await bcrypt.compare(res.pwd, users.rows[0].password);
    if (!isSamePass) {
      return NextResponse.json({ error: "not autherized" }, { status: 401 });
    }
    const user = {
      id: users.rows[0].id,
      username: users.rows[0].username,
      email: users.rows[0].email,
    };
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
