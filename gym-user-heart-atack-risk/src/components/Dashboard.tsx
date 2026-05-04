"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import UserForm from "./UserForm";
import UserList from "./UserList";
import TrainingModal from "./TrainingModal";
import axios from "axios";
import { Heart, RefreshCw } from "lucide-react";
import {
  initializeModel,
  clearModelCache,
  ModelMetrics,
} from "@/lib/modelService";

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [trainingMetrics, setTrainingMetrics] = useState<ModelMetrics>({
    epoch: 0,
    totalEpochs: 20,
    loss: 0,
    accuracy: 0,
  });

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

  const initModel = async (forceRetrain: boolean = false) => {
    setIsTraining(true);
    try {
      await initializeModel(forceRetrain, (metrics) => {
        console.log("Metrics update:", metrics);
        setTrainingMetrics(metrics);
      });
      setModelReady(true);
      console.log("Modelo inicializado com sucesso!");
    } catch (error) {
      console.error("Erro ao inicializar modelo:", error);
      alert("Erro ao treinar modelo. Verifique o console.");
    } finally {
      setIsTraining(false);
    }
  };

  const handleRetrain = async () => {
    if (
      window.confirm(
        "Deseja retreinar o modelo? Isso levará alguns segundos...",
      )
    ) {
      await initModel(true);
    }
  };

  useEffect(() => {
    const setupApp = async () => {
      try {
        // Fetch usuários
        await fetchUsers();

        // Inicializa modelo
        await initModel(false);
      } catch (error) {
        console.error("Erro na inicialização:", error);
      }
    };

    setupApp();
  }, []);

  // Calcula estatísticas
  const totalUsers = users.length;
  const avgRisk =
    users.length > 0
      ? users.reduce((sum, u) => sum + u.heartAttackRisk, 0) / users.length
      : 0;
  const highRiskCount = users.filter((u) => u.heartAttackRisk >= 60).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Modal de Treino */}
      <TrainingModal
        isOpen={isTraining}
        epoch={trainingMetrics.epoch}
        totalEpochs={trainingMetrics.totalEpochs}
        loss={trainingMetrics.loss}
        accuracy={trainingMetrics.accuracy}
        isTraining={isTraining}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Monitor de Risco Cardíaco
              </h1>
            </div>
            <button
              onClick={handleRetrain}
              disabled={isTraining}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              title="Retreinar modelo com novos dados"
            >
              <RefreshCw className="w-4 h-4" />
              Retreinar
            </button>
          </div>
          <p className="text-gray-600">
            Sistema de previsão de risco de infarto para alunos
          </p>
          <p
            className={`text-sm mt-2 ${modelReady ? "text-green-600" : "text-yellow-600"}`}
          >
            {modelReady
              ? "✓ Modelo pronto para fazer previsões"
              : "Modelo sendo treinado..."}
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
        <UserForm onSuccess={fetchUsers} disabled={!modelReady || isTraining} />
        <UserList
          users={users}
          isLoading={isLoading}
          onDeleteSuccess={fetchUsers}
        />
      </main>
    </div>
  );
}
