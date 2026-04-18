"use client";

import { User } from "@/types/user";
import { Heart, Mail, Phone, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { getRiskColor, getRiskLevel, formatDate } from "@/lib/utils";

interface UserCardProps {
  user: User;
  onDelete: (id: string) => Promise<void>;
}

export default function UserCard({ user, onDelete }: UserCardProps) {
  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar ${user.name}?`)) {
      try {
        await onDelete(user.id);
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        alert("Erro ao deletar usuário");
      }
    }
  };

  const riskColor = getRiskColor(user.heartAttackRisk);
  const riskLevel = getRiskLevel(user.heartAttackRisk);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <Mail className="w-4 h-4 mr-2" />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <Phone className="w-4 h-4 mr-2" />
              {user.phone}
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 border ${riskColor}`}>
          <div className="flex items-center justify-center mb-1">
            <Heart className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {Math.round(user.heartAttackRisk)}%
          </div>
          <div className="text-xs font-semibold text-center">{riskLevel}</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Idade:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {user.age} anos
            </span>
          </div>
          <div>
            <span className="text-gray-600">Gênero:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {user.gender === "M" ? "Masculino" : "Feminino"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">IMC:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {user.bmi.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Colesterol:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {user.cholesterol}
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        Atualizado em: {formatDate(user.updatedAt)}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/users/${user.id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver Detalhes
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Deletar
        </button>
      </div>
    </div>
  );
}
