/**
 * Parser para carregar e processar dados do CSV para treino do modelo
 * RODA NO CLIENTE (browser) durante o treino
 */

export interface RawCsvRecord {
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
  visit_per_week: number;
  personal_training: boolean;
  uses_sauna: boolean;
  drink_abo: boolean;
  avg_time_in_gym: number;
}

export interface TrainingData {
  features: number[][];
  labels: number[];
}

/**
 * Carrega CSV via fetch (funciona no browser)
 * O arquivo deve estar em public/
 */
async function loadCsv(path: string = "dataset.csv"): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Falha ao carregar CSV: ${response.statusText}`);
  }
  return response.text();
}

/**
 * Parseia CSV manual (sem dependências de npm que só funcionam no servidor)
 */
function parseCsv(csvContent: string): RawCsvRecord[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV vazio ou inválido");
  }

  const headers = lines[0].split(",").map((h) => h.trim());

  const records: RawCsvRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse simples - assume valores bem formatados
    const values = line.split(",").map((v) => v.trim());

    try {
      const record: RawCsvRecord = {
        patient_id: parseFloat(values[0]),
        age: parseFloat(values[1]),
        gender: values[2] === "Male" ? "Male" : "Female",
        resting_bp: parseFloat(values[3]),
        cholesterol: parseFloat(values[4]),
        fasting_bs: parseFloat(values[5]),
        ecg_result: values[6],
        max_heart_rate: parseFloat(values[7]),
        exercise_angina: values[8],
        st_depression: parseFloat(values[9]),
        slope: values[10],
        num_major_vessels: parseFloat(values[11]),
        thalassemia: values[12],
        heart_attack: parseFloat(values[13]),
        visit_per_week: parseFloat(values[16]),
        personal_training: values[25] === "True",
        uses_sauna: values[27] === "True",
        drink_abo: values[23] === "True",
        avg_time_in_gym: parseFloat(values[22]),
      };

      records.push(record);
    } catch (error) {
      console.warn(`Erro ao parsear linha ${i}:`, error);
      continue;
    }
  }

  return records;
}

/**
 * Normaliza features para intervalo 0-1 (min-max normalization)
 */
function normalizeFeatures(features: number[][]): {
  normalized: number[][];
  mins: number[];
  maxs: number[];
} {
  const numFeatures = features[0].length;
  const mins: number[] = Array(numFeatures).fill(Infinity);
  const maxs: number[] = Array(numFeatures).fill(-Infinity);

  // Encontra min e max para cada feature
  for (const sample of features) {
    for (let i = 0; i < numFeatures; i++) {
      mins[i] = Math.min(mins[i], sample[i]);
      maxs[i] = Math.max(maxs[i], sample[i]);
    }
  }

  // Valida min/max
  for (let i = 0; i < numFeatures; i++) {
    if (!isFinite(mins[i]) || !isFinite(maxs[i])) {
      console.warn(`Feature ${i}: min=${mins[i]}, max=${maxs[i]} (não finito)`);
      mins[i] = 0;
      maxs[i] = 1;
    }
  }

  // Normaliza
  const normalized = features.map((sample) =>
    sample.map((value, i) => {
      if (!isFinite(value)) {
        console.warn(
          `Valor não finito encontrado: feature=${i}, value=${value}`,
        );
        return 0.5;
      }
      const range = maxs[i] - mins[i];
      if (range === 0) return 0.5; // Caso especial: feature constante
      return (value - mins[i]) / range;
    }),
  );

  return { normalized, mins, maxs };
}

/**
 * Extrai features e labels de registros brutos para treino
 * Mapeia valores categóricos para numéricos
 */
function extractFeaturesAndLabels(records: RawCsvRecord[]): {
  features: number[];
  label: number;
}[] {
  const ecgMap: { [key: string]: number } = {
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

  return records.map((record) => ({
    features: [
      record.age,
      record.gender === "Male" ? 1 : 0,
      record.resting_bp,
      record.cholesterol,
      record.fasting_bs,
      ecgMap[record.ecg_result] ?? 0,
      record.max_heart_rate,
      record.exercise_angina === "Y" ? 1 : 0,
      record.st_depression,
      slopeMap[record.slope] ?? 1,
      record.num_major_vessels,
      thalassemiaMap[record.thalassemia] ?? 0,
      record.visit_per_week,
      record.personal_training ? 1 : 0,
      record.uses_sauna ? 1 : 0,
      record.drink_abo ? 1 : 0,
      record.avg_time_in_gym,
    ],
    label: record.heart_attack,
  }));
}

/**
 * Carrega, parseia e prepara dados de treino do CSV
 */
export async function loadTrainingData(): Promise<
  TrainingData & { normalizationParams: { mins: number[]; maxs: number[] } }
> {
  console.log("Carregando CSV para treino...");

  const csvContent = await loadCsv("dataset.csv");
  console.log(`CSV carregado: ${csvContent.split("\n").length} linhas`);

  const records = parseCsv(csvContent);
  console.log(`Regs. parseadas: ${records.length}`);

  const data = extractFeaturesAndLabels(records);
  console.log(
    `Features extraídas: ${data.length} amostras com 17 features cada`,
  );

  const rawFeatures = data.map((d) => d.features);
  const labels = data.map((d) => d.label);

  const { normalized, mins, maxs } = normalizeFeatures(rawFeatures);

  return {
    features: normalized,
    labels,
    normalizationParams: { mins, maxs },
  };
}
