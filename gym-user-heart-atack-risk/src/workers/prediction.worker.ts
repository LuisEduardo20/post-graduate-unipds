import * as tf from "@tensorflow/tfjs";

type WorkerInput = {
  patient_id: number;
  age: number;
  gender: string;
  resting_bp: number;
  cholesterol: number;
  fasting_bs: number;
  ecg_result: string;
  max_heart_rate: number;
  exercise_angina: string;
  st_depression: number;
  slope: string;
  num_major_vessels: number;
  thalassemia: string;
  heart_attack: number;
  birthday: string;
  visit_per_week: number;
  days_per_week: string;
  attend_group_lesson: boolean;
  fav_group_lesson: string;
  avg_time_check_in: string;
  avg_time_check_out: string;
  avg_time_in_gym: number;
  drink_abo: boolean;
  fav_drink: string;
  personal_training: boolean;
  name_personal_trainer: string;
  uses_sauna: boolean;
};

interface NormalizationParams {
  mins: number[];
  maxs: number[];
}

let normalizationParams: NormalizationParams | null = null;

// Mapeamento de valores categóricos para numéricos
const ecgResultMap: { [key: string]: number } = {
  Normal: 0,
  "ST-T abnormality": 1,
  "Left ventricular hypertrophy": 2,
  "Reversible Defect": 3,
  "Fixed Defect": 4,
};

const slopeMap: { [key: string]: number } = {
  Up: 0,
  Flat: 1,
  Down: 2,
};

const thalassemiaMap: { [key: string]: number } = {
  Normal: 0,
  "Fixed Defect": 1,
  "Reversible Defect": 2,
};

/**
 * Normaliza um array de features usando min-max normalization
 */
function normalizeFeatures(
  features: number[],
  params: NormalizationParams,
): number[] {
  return features.map((value, i) => {
    const range = params.maxs[i] - params.mins[i];
    if (range === 0) return 0.5;
    return (value - params.mins[i]) / range;
  });
}

/**
 * Extrai e mapeia features do usuário para o tensor
 */
function extractFeatures(data: WorkerInput): number[] {
  const features = [
    data.age,
    data.gender === "Male" ? 1 : 0,
    data.resting_bp,
    data.cholesterol,
    data.fasting_bs,
    ecgResultMap[data.ecg_result] ?? 0,
    data.max_heart_rate,
    data.exercise_angina === "Y" ? 1 : 0,
    data.st_depression,
    slopeMap[data.slope] ?? 1,
    data.num_major_vessels,
    thalassemiaMap[data.thalassemia] ?? 0,
    data.visit_per_week,
    data.personal_training ? 1 : 0,
    data.uses_sauna ? 1 : 0,
    data.drink_abo ? 1 : 0,
    data.avg_time_in_gym,
  ];

  return features;
}

self.onmessage = async (e: MessageEvent) => {
  try {
    const { type, data, params } = e.data;

    // Mensagem de inicialização com parâmetros de normalização
    console.log("type:", type);

    if (type === "INIT") {
      normalizationParams = params;
      console.log("Worker inicializado com parâmetros de normalização");
      self.postMessage({ type: "INIT_OK" });
      return;
    }

    // Mensagem de predição
    if (type === "PREDICT") {
      if (!normalizationParams) {
        throw new Error("Parâmetros de normalização não inicializadosss");
      }

      const userData: WorkerInput = data;

      // Extrai features do usuário
      const features = extractFeatures(userData);
      console.log("Features extraídas:", features);

      // Normaliza features
      const normalizedFeatures = normalizeFeatures(
        features,
        normalizationParams,
      );
      console.log("Features normalizadas:", normalizedFeatures);

      // Cria tensor para previsão
      const inputTensor = tf.tensor2d([normalizedFeatures]);

      // TODO: Usar modelo treinado real
      // const model = await tf.loadLayersModel('indexeddb://heart-risk-model');
      // const prediction = model.predict(inputTensor) as tf.Tensor;
      // const riskValue = (await prediction.data())[0];
      // prediction.dispose();

      // Mock até o modelo estar integrado
      // Calcula um pseudo-risco baseado em features para parecer realista
      const resting_bp = userData.resting_bp;
      const cholesterol = userData.cholesterol;
      const max_heart_rate = userData.max_heart_rate;
      const age = userData.age;

      // Heurística simples para parecer realista
      let pseudoRisk = 0;
      pseudoRisk += ((resting_bp - 90) / 90) * 20; // Pressão arterial
      pseudoRisk += ((cholesterol - 150) / 200) * 20; // Colesterol
      pseudoRisk += ((200 - max_heart_rate) / 100) * 20; // Frequência cardíaca
      pseudoRisk += ((age - 30) / 60) * 20; // Idade
      pseudoRisk += userData.personal_training ? -10 : 10; // Treino pessoal
      pseudoRisk += userData.exercise_angina === "Y" ? 20 : 0; // Angina no exercício

      const risk = Math.min(Math.max(pseudoRisk, 0), 100);

      inputTensor.dispose();

      self.postMessage({
        type: "RESULT",
        risk: Math.round(risk),
      });
    }
  } catch (error) {
    console.error("Erro no worker:", error);
    self.postMessage({
      type: "ERROR",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
