// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function GET(req: NextRequest) {
  console.log("working...2")
  const { searchParams } = new URL(req.url);
  const division = searchParams.get('division');
  const district = searchParams.get('district');
  const upazila = searchParams.get('upazila');
  const status = searchParams.get('status');
  const page = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 10;

  try {
    const filters: any = {};
    if (division) filters.division = division;
    if (district) filters.district = district;
    if (upazila) filters.upazila = upazila;
    if (status) filters.status = status;

    const users = await prismadb.userCreate.findMany({
      where: filters,
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: { createdAt: 'desc' },
    });

    const totalUsers = await prismadb.userCreate.count({ where: filters });
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    return NextResponse.json({ users, totalPages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}
