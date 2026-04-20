import * as tf from "@tensorflow/tfjs";

// TODO Rever o tipo do usuário
type WorkerInput = {
  age: number;
  gender: string;
  bloodPressure: number;
  cholesterol: number;
  glucose: number;
  smoker: boolean;
  physicalActivity: number;
  bmi: number;
  family_history: boolean;
  alcohol_consumption: number;
  stress_level: number;
};

self.onmessage = async (e: MessageEvent<WorkerInput>) => {
  const data = e.data;

  // Carrega o modelo (só uma vez, idealmente com cache)
  // const model = await tf.loadLayersModel('/models/heart-risk/model.json');

  const inputs = [
    data.age,
    data.gender === "M" ? 1 : 0,
    data.bloodPressure,
    data.cholesterol,
    data.glucose,
    data.smoker ? 1 : 0,
    data.physicalActivity,
    data.bmi,
    data.family_history ? 1 : 0,
    data.alcohol_consumption,
    data.stress_level,
  ];

  const tensor = tf.tensor2d([inputs]);
  // const prediction = model.predict(tensor) as tf.Tensor;
  // const risk = (await prediction.data())[0] * 100;

  // Mock enquanto o modelo não está integrado:
  const risk = Math.random() * 100;

  self.postMessage({ risk: Math.round(risk) });
  tensor.dispose();
};
