import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import api from "../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { data: todos } = await api.get("/getTodos");
	return {
		props: {
			...todos,
		},
	};
};

interface Todo {
	id?: string;
	task: string;
	createdAt: Date;
	status: boolean;
}

interface PageProps {
	todos: Todo[];
}

export default function Home({ todos: serverTodos }: PageProps) {
	const [todos, setTodos] = useState<Todo[]>(serverTodos);
	const [inputTodo, setInputTodo] = useState("");

	const handleInputChange = (event) => {
		setInputTodo(event.target.value);
	};

	const handleCreateTodo = async () => {
		try {
			const currentTodos = [...todos];

			const { data: newTodo } = await api.post("/createTodo", {
				task: inputTodo,
			});
			currentTodos.push(newTodo);
			setTodos(currentTodos);
			setInputTodo("");
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpdateTodo = async (id: string) => {
		const updatedTodos = todos.map((todo) =>
			todo.id === id ? { ...todo, status: !todo.status } : todo
		);
		setTodos(updatedTodos);
		const currentTodo = updatedTodos.find((todo) => todo.id === id);
		await api.post("/updateTodo", { id, status: currentTodo.status });
	};

	console.log(todos);

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 className="mb-16 text-4xl font-bold text-gray-800">To-do</h1>
			<h2 className="mb-8 text-2xl font-medium text-gray-800">Criar to-do</h2>
			<div className="flex">
				<input
					className="px-2 font-medium transition-colors duration-100 border-2 border-blue-400 rounded-lg outline-none focus:border-green-500"
					type="text"
					onChange={handleInputChange}
					value={inputTodo}
				/>
				<button
					className="px-4 mx-2 text-lg font-medium text-white transition-colors duration-200 bg-blue-500 rounded-lg duration-20transition-colors hover:bg-blue-700"
					onClick={handleCreateTodo}>
					Criar
				</button>
			</div>
			<ul className="mt-8">
				{todos.map((todo) => (
					<li
						className="px-3 font-medium transition-colors duration-150 bg-white border-2 border-blue-400 rounded-lg cursor-pointer hover:bg-blue-100"
						key={todo.id || todo.task}
						onClick={() => handleUpdateTodo(todo.id)}>
						<p className={`${todo.status && "line-through"}`}>{todo.task}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
