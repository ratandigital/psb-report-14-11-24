// app/api/users/[id]/make-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('approve')
  const { id } = params;

  try {
    const user = await prismadb.userCreate.findUnique({ where: { id } });

    if (user?.status !== 'approved') {
      return NextResponse.json(
        { message: 'User must be approved before becoming admin' },
        { status: 400 }
      );
    }

    const updatedUser = await prismadb.userCreate.update({
      where: { id },
      data: { status: 'admin' },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error making user admin' }, { status: 500 });
  }
}
