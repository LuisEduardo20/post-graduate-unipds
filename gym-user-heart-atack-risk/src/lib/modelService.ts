/**
 * Serviço para treinar e gerenciar o modelo de predição de risco cardíaco
 * Utiliza TensorFlow.js para treinar uma rede neural com dados do CSV
 */

import * as tf from "@tensorflow/tfjs";
import { loadTrainingData } from "./csvParser";

const MODEL_STORAGE_KEY = "HEART_RISK_MODEL";
const NORMALIZATION_STORAGE_KEY = "HEART_RISK_MODEL_NORM";

export interface ModelMetrics {
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
}

export type TrainingCallback = (metrics: ModelMetrics) => void;

/**
 * Cria a arquitetura do modelo neural para predição de risco
 */
function createModel(): tf.Sequential {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [17],
        units: 128,
        activation: "relu",
        name: "input_layer",
      }),
      tf.layers.dropout({ rate: 0.3 }),
      tf.layers.dense({
        units: 64,
        activation: "relu",
        name: "hidden_1",
      }),
      tf.layers.dropout({ rate: 0.3 }),
      tf.layers.dense({
        units: 32,
        activation: "relu",
        name: "hidden_2",
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({
        units: 1,
        activation: "sigmoid",
        name: "output",
      }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

/**
 * Treina o modelo com dados do CSV
 */
async function trainModel(
  onProgress?: TrainingCallback,
): Promise<tf.Sequential> {
  console.log("Iniciando treino do modelo...");

  // Carrega dados
  const trainingData = await loadTrainingData();
  const { features, labels, normalizationParams } = trainingData;

  // Converte para tensores
  const xs = tf.tensor2d(features, [features.length, 17]);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  console.log("xs:", xs);
  console.log("ys:", ys);

  // Armazena parâmetros de normalização globalmente
  globalNormalizationParams = normalizationParams;

  console.log(`Dados preparados: ${features.length} amostras`);

  // Cria modelo
  const model = createModel();
  console.log("Modelo criado com arquitetura:");
  model.summary();

  // Treina
  const epochs = 20;
  const batchSize = 32;

  try {
    for (let epoch = 0; epoch < epochs; epoch++) {
      const history = await model.fit(xs, ys, {
        epochs: 1,
        batchSize,
        verbose: 0,
        shuffle: true,
      });

      // TODO loss está vindo  como undefined, investigar
      console.log("history:", history.history);

      const loss = history.history.loss[0] as number;
      const accuracy = history.history.acc[0] as number;

      console.log(
        `Epoch ${epoch + 1}/${epochs} - Loss: ${loss.toFixed(4)}, Accuracy: ${(accuracy * 100).toFixed(1)}%`,
      );

      onProgress?.({
        epoch: epoch + 1,
        totalEpochs: epochs,
        loss,
        accuracy,
      });
    }
  } finally {
    xs.dispose();
    ys.dispose();
  }

  console.log("Treino concluído!");
  return model;
}

/**
 * Salva o modelo em sessionStorage
 */
async function saveModel(model: tf.Sequential): Promise<void> {
  try {
    // Serializa parâmetros do modelo
    const weights = model.getWeights().map((w) => w.dataSync().slice(0)); // Copies
    const weightsJson = weights.map((w) => Array.from(w));

    // Estrutura do modelo
    const modelConfig = model.toJSON();

    const modelData = {
      config: modelConfig,
      weights: weightsJson,
      timestamp: new Date().toISOString(),
    };

    const modelJson = JSON.stringify(modelData);
    sessionStorage.setItem(MODEL_STORAGE_KEY, modelJson);

    // Salva parâmetros de normalização
    if (globalNormalizationParams) {
      sessionStorage.setItem(
        NORMALIZATION_STORAGE_KEY,
        JSON.stringify(globalNormalizationParams),
      );
    }

    console.log(
      `Modelo salvo em sessionStorage (${(modelJson.length / 1024).toFixed(1)} KB)`,
    );
  } catch (error) {
    console.error("Erro ao salvar modelo:", error);
    throw error;
  }
}

/**
 * Carrega modelo do sessionStorage
 */
function loadModel(): tf.LayersModel | null {
  try {
    const modelJson = sessionStorage.getItem(MODEL_STORAGE_KEY);
    if (!modelJson) return null;

    const modelData = JSON.parse(modelJson);

    // Carrega parâmetros de normalização
    const normJson = sessionStorage.getItem(NORMALIZATION_STORAGE_KEY);
    if (normJson) {
      globalNormalizationParams = JSON.parse(normJson);
    }

    console.log("Modelo carregado do sessionStorage");
    // Note: Em um caso real, seria necessário reconstruir o modelo com os pesos
    // Por enquanto, retornamos null para forçar retraining
    return null;
  } catch (error) {
    console.error("Erro ao carregar modelo:", error);
    return null;
  }
}

/**
 * Verifica se modelo está treinado e disponível
 */
export function isModelTrained(): boolean {
  return sessionStorage.getItem(MODEL_STORAGE_KEY) !== null;
}

/**
 * Limpa o modelo do cache
 */
export function clearModelCache(): void {
  sessionStorage.removeItem(MODEL_STORAGE_KEY);
  sessionStorage.removeItem(NORMALIZATION_STORAGE_KEY);
  console.log("Cache do modelo limpo");
}

// Armazena parâmetros de normalização globalmente para uso no worker
let globalNormalizationParams: { mins: number[]; maxs: number[] } | null = null;

/**
 * Obtém parâmetros de normalização
 */
export function getNormalizationParams(): {
  mins: number[];
  maxs: number[];
} | null {
  return globalNormalizationParams;
}

/**
 * Inicializa o modelo: carrega do cache ou treina novo
 * Retorna promise que resolve quando modelo está pronto
 */
export async function initializeModel(
  forceRetrain: boolean = false,
  onProgress?: TrainingCallback,
): Promise<void> {
  if (!forceRetrain && isModelTrained()) {
    console.log("Modelo já treinado em cache, carregando...");
    const model = loadModel();
    if (model) {
      model.dispose();
    }
    // Carrega parâmetros de normalização
    const normJson = sessionStorage.getItem(NORMALIZATION_STORAGE_KEY);
    if (normJson) {
      globalNormalizationParams = JSON.parse(normJson);
    }
    return;
  }

  console.log("Treinando novo modelo...");

  if (forceRetrain) {
    clearModelCache();
  }

  const model = await trainModel(onProgress);

  try {
    await saveModel(model);
  } finally {
    model.dispose();
  }
}

/**
 * Carrega o modelo treinado para fazer previsões
 * Retorna modelo ou null se não estiver disponível
 */
export async function getTrainedModel(): Promise<tf.Sequential | null> {
  if (!isModelTrained()) {
    console.warn("Modelo não está treinado");
    return null;
  }

  // Em um cenário real completo, seria necessário reconstruir
  // o modelo com pesos salvos. Por enquanto, retornamos null
  // e o cliente (Dashboard) deve estar pronto para isso.
  return null;
}

/**
 * Exporta o estado do modelo para enviar ao web worker
 */
export function exportModelForWorker(): {
  normalizationParams: { mins: number[]; maxs: number[] } | null;
  isReady: boolean;
} {
  return {
    normalizationParams: globalNormalizationParams,
    isReady: isModelTrained(),
  };
}
