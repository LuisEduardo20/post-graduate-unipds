"use client";

import { User } from "@/types/user";
import UserCard from "./UserCard";
import { Loader2 } from "lucide-react";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onDeleteSuccess: () => void;
}

export default function UserList({
  users,
  isLoading,
  onDeleteSuccess,
}: UserListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg">
          Nenhum usuário cadastrado ainda.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Clique no botão acima para adicionar um novo usuário.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={async (id) => {
            const response = await fetch(`/api/users/${id}`, {
              method: "DELETE",
            });
            if (response.ok) {
              onDeleteSuccess();
            } else {
              throw new Error("Erro ao deletar usuário");
            }
          }}
        />
      ))}
    </div>
  );
}
