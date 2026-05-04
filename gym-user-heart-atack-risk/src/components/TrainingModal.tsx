"use client";

import { Loader2 } from "lucide-react";

interface TrainingModalProps {
  isOpen: boolean;
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  isTraining: boolean;
}

export default function TrainingModal({
  isOpen,
  epoch,
  totalEpochs,
  loss,
  accuracy,
  isTraining,
}: TrainingModalProps) {
  if (!isOpen) return null;

  const progress = totalEpochs > 0 ? (epoch / totalEpochs) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Treinando Modelo...
          </h2>
        </div>

        <div className="space-y-4">
          {/* Barra de Progresso */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm font-semibold text-gray-800">
                {epoch}/{totalEpochs}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Loss</p>
              <p className="text-lg font-semibold text-gray-800">
                {loss.toFixed(4)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Acurácia</p>
              <p className="text-lg font-semibold text-gray-800">
                {(accuracy * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {!isTraining && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-center text-green-600 font-medium">
              ✓ Modelo treinado com sucesso!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
