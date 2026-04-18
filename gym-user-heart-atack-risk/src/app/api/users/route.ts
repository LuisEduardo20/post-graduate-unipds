import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers } from "@/lib/fileDB";
import { User, UserFormData } from "@/types/user";
import { generateId } from "@/lib/utils";

// Função para calcular o risco de infarto usando TensorFlow.js
// IMPORTANTE: Esta é uma implementação mock. Você deve treinar seu próprio modelo TensorFlow
// e implementar a lógica real de previsão aqui.
async function predictHeartAttackRisk(data: UserFormData): Promise<number> {
  // TODO: Integrar com seu modelo TensorFlow treinado
  // Exemplo de como você pode fazer isso:
  /*
  import * as tf from '@tensorflow/tfjs';
  
  const model = await tf.loadLayersModel('file://./path-to-your-model/model.json');
  const input = tf.tensor2d([[
    data.age,
    data.gender === 'M' ? 1 : 0,
    data.bloodPressure,
    data.cholesterol,
    data.glucose,
    data.smoker ? 1 : 0,
    data.physicalActivity,
    data.bmi,
    data.family_history ? 1 : 0,
    data.alcohol_consumption,
    data.stress_level,
  ]]);
  
  const prediction = model.predict(input) as tf.Tensor;
  const riskValue = (await prediction.data())[0];
  
  input.dispose();
  prediction.dispose();
  
  return Math.min(Math.max(riskValue * 100, 0), 100); // Garantir valor entre 0-100
  */

  // Mock: Retorna um valor aleatório para teste
  // Remova esta implementação e use a do TensorFlow acima
  const baseRisk = Math.random() * 100;
  return Math.min(Math.max(baseRisk, 0), 100);
}

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: UserFormData = await request.json();

    // Validação básica
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 },
      );
    }

    // Calcula o risco de infarto usando TensorFlow
    const heartAttackRisk = await predictHeartAttackRisk(body);

    const now = new Date().toISOString();
    const user: User = {
      id: generateId(),
      ...body,
      heartAttackRisk,
      createdAt: now,
      updatedAt: now,
    };

    const createdUser = await createUser(user);
    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 },
    );
  }
}
