import { NextResponse } from 'next/server';
import prisma from '../../../utils/database';

// GET /slots/:id
export async function GET(context: any) {
    const { params } = context;
    const { id } = params;
    // get slot by id
    try {
        const slot = await prisma.slot.findUnique({
            where: { id: Number(id) },
        });
        return NextResponse.json({ slot }, { status: 200 });

    } catch {
        return NextResponse.json({ message: 'Failed to fetch slot' }, { status: 500 });

    }

}
// DELETE /slots/:id
export async function DELETE(context: any) {
    const { params } = context;
    const { id } = params;
    try {
        const slot = await prisma.slot.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: `Slot deleted` }, { status: 200 });

    } catch (error) {
        console.error('Error deleting slot:', error);
        return NextResponse.json({ message: 'Failed to delete slot' }, { status: 500 });
    }
}