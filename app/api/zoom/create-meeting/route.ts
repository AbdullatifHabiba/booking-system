import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../../../utils/auth';
import { Meeting } from '../../../../models/meeting';
import sequelize from '../../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = authenticate(req);

  if (req.method === 'POST') {
    const { meetingId, startTime, duration } = req.body;

    await sequelize.sync();

    const meeting = await Meeting.create({
      userId: user.userId,
      meetingId,
      startTime: new Date(startTime),
      duration,
    });

    res.status(201).json(meeting);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
