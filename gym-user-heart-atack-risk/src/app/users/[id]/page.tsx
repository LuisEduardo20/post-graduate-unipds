"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { getRiskColor, getRiskLevel, formatDate } from "@/lib/utils";

export default function UserDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError("Erro ao carregar usuário. Usuário não encontrado.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const riskColor = getRiskColor(user.heartAttackRisk);
  const riskLevel = getRiskLevel(user.heartAttackRisk);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.phone && <p className="text-gray-600">{user.phone}</p>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Indicator */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Risco de Infarto
              </h2>
              <p className="text-gray-600">
                Análise baseada em dados clínicos e estilo de vida
              </p>
            </div>
            <div className={`rounded-xl p-6 border-2 ${riskColor} text-center`}>
              <div className="text-5xl font-bold mb-2">
                {Math.round(user.heartAttackRisk)}%
              </div>
              <div className="text-lg font-semibold">{riskLevel}</div>
            </div>
          </div>

          {/* Risk Level Description */}
          <div className="grid grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg ${user.heartAttackRisk < 30 ? "bg-green-100 border-2 border-green-500" : "bg-gray-100"}`}
            >
              <div className="text-sm font-semibold text-gray-700">Baixo</div>
              <div className="text-xs text-gray-600">0-29%</div>
            </div>
            <div
              className={`p-4 rounded-lg ${user.heartAttackRisk >= 30 && user.heartAttackRisk < 60 ? "bg-yellow-100 border-2 border-yellow-500" : "bg-gray-100"}`}
            >
              <div className="text-sm font-semibold text-gray-700">
                Moderado
              </div>
              <div className="text-xs text-gray-600">30-59%</div>
            </div>
            <div
              className={`p-4 rounded-lg ${user.heartAttackRisk >= 60 && user.heartAttackRisk < 80 ? "bg-orange-100 border-2 border-orange-500" : "bg-gray-100"}`}
            >
              <div className="text-sm font-semibold text-gray-700">Elevado</div>
              <div className="text-xs text-gray-600">60-79%</div>
            </div>
            <div
              className={`p-4 rounded-lg ${user.heartAttackRisk >= 80 ? "bg-red-100 border-2 border-red-500" : "bg-gray-100"}`}
            >
              <div className="text-sm font-semibold text-gray-700">
                Muito Elevado
              </div>
              <div className="text-xs text-gray-600">80-100%</div>
            </div>
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Dados Pessoais
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Idade:</span>
                <span className="font-semibold text-gray-800">
                  {user.age} anos
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Gênero:</span>
                <span className="font-semibold text-gray-800">
                  {user.gender === "M" ? "Masculino" : "Feminino"}
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">IMC:</span>
                <span className="font-semibold text-gray-800">
                  {user.bmi.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria IMC:</span>
                <span className="font-semibold text-gray-800">
                  {user.bmi < 18.5
                    ? "Abaixo do peso"
                    : user.bmi < 25
                      ? "Peso normal"
                      : user.bmi < 30
                        ? "Sobrepeso"
                        : "Obesidade"}
                </span>
              </div>
            </div>
          </div>

          {/* Dados Clínicos */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Dados Clínicos
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">
                  Pressão Arterial (Sistólica):
                </span>
                <span className="font-semibold text-gray-800">
                  {user.bloodPressure} mmHg
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Colesterol Total:</span>
                <span className="font-semibold text-gray-800">
                  {user.cholesterol} mg/dL
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Glicose:</span>
                <span className="font-semibold text-gray-800">
                  {user.glucose} mg/dL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fumante:</span>
                <span className="font-semibold text-gray-800">
                  {user.smoker ? "Sim" : "Não"}
                </span>
              </div>
            </div>
          </div>

          {/* Estilo de Vida */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Estilo de Vida
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Atividade Física:</span>
                <span className="font-semibold text-gray-800">
                  {user.physicalActivity.toFixed(1)} horas/semana
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Consumo de Álcool:</span>
                <span className="font-semibold text-gray-800">
                  {user.alcohol_consumption.toFixed(1)} unidades/semana
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nível de Estresse:</span>
                <span className="font-semibold text-gray-800">
                  {user.stress_level}/10
                </span>
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Histórico Médico
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Histórico Familiar:</span>
                <span className="font-semibold text-gray-800">
                  {user.family_history ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Cadastrado em:</span>
                <span className="font-semibold text-gray-800">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização:</span>
                <span className="font-semibold text-gray-800">
                  {formatDate(user.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Recomendações
          </h3>
          <div className="space-y-3 text-blue-800">
            {user.heartAttackRisk < 30 && (
              <>
                <p>✓ Continue mantendo seus hábitos saudáveis</p>
                <p>✓ Mantenha a atividade física regular</p>
                <p>✓ Faça check-ups anuais</p>
              </>
            )}
            {user.heartAttackRisk >= 30 && user.heartAttackRisk < 60 && (
              <>
                <p>⚠ Aumente sua atividade física gradualmente</p>
                <p>⚠ Tenha atenção com a alimentação</p>
                <p>⚠ Consulte um médico para avaliação mais detalhada</p>
              </>
            )}
            {user.heartAttackRisk >= 60 && user.heartAttackRisk < 80 && (
              <>
                <p>🔴 Procure atendimento médico urgentemente</p>
                <p>🔴 Reduza o consumo de álcool</p>
                <p>
                  🔴 Implemente um programa de exercícios sob orientação médica
                </p>
              </>
            )}
            {user.heartAttackRisk >= 80 && (
              <>
                <p>🔴 PROCURE ATENDIMENTO MÉDICO IMEDIATO</p>
                <p>🔴 Avaliação cardiológica necessária</p>
                <p>🔴 Mudanças significativas no estilo de vida são críticas</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
