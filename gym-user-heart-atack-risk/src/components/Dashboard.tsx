"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import UserForm from "./UserForm";
import UserList from "./UserList";
import axios from "axios";
import { Heart } from "lucide-react";

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Erro ao buscar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = () => {
    fetchUsers();
  };

  // Calcula estatísticas
  const totalUsers = users.length;
  const avgRisk =
    users.length > 0
      ? users.reduce((sum, u) => sum + u.heartAttackRisk, 0) / users.length
      : 0;
  const highRiskCount = users.filter((u) => u.heartAttackRisk >= 60).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Monitor de Risco Cardíaco
            </h1>
          </div>
          <p className="text-gray-600">
            Sistema de previsão de risco de infarto para alunos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-gray-600 text-sm font-medium">
              Total de Usuários
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {totalUsers}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-gray-600 text-sm font-medium">Risco Médio</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {avgRisk.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-gray-600 text-sm font-medium">
              Risco Elevado (≥60%)
            </div>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {highRiskCount}
            </div>
          </div>
        </div>

        {/* Form and List */}
        <UserForm onSuccess={handleUserAdded} />
        <UserList
          users={users}
          isLoading={isLoading}
          onDeleteSuccess={handleUserAdded}
        />
      </main>
    </div>
  );
}
