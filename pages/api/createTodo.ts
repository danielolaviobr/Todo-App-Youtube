// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const data = req.body;
		console.log(data);

		const prisma = new PrismaClient();

		const newTodo = await prisma.todo.create({
			data: { task: data.task, status: false },
		});

		res.status(200).json({ ...newTodo });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
