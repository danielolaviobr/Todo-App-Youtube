import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { id, status } = req.body;

		console.log(id, status);

		const prisma = new PrismaClient();

		const newTodo = await prisma.todo.update({
			where: { id: id },
			data: { status: status },
		});

		res.status(200).json({ newTodo });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
