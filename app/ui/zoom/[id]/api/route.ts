import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../../../utils/auth';
import { Meeting } from '../../../../models/meeting';
import sequelize from '../../../../utils/database';
import { User } from '@/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = authenticate(req);
  const { id } = req.query;

  await sequelize.sync();

  if (req.method === 'DELETE') {
    const meeting = await Meeting.findOne({
      where: {
        id: id as string,
        userId: user.userId 
      },
    });

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    await meeting.destroy();
    res.status(200).json({ message: 'Meeting cancelled' });
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
