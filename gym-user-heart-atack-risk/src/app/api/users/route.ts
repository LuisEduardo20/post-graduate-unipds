import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers } from "@/lib/fileDB";
import { User, UserFormData } from "@/types/user";
import { generateId } from "@/lib/utils";

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
    const body = await request.json();

    // Validação básica
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 },
      );
    }

    // Validação do risco cardíaco
    let heartAttackRisk = body.heartAttackRisk;
    if (
      heartAttackRisk === undefined ||
      heartAttackRisk === null ||
      typeof heartAttackRisk !== "number"
    ) {
      return NextResponse.json(
        { error: "Risco cardíaco (heartAttackRisk) é obrigatório" },
        { status: 400 },
      );
    }

    // Garante que o risco está entre 0-100
    heartAttackRisk = Math.min(Math.max(heartAttackRisk, 0), 100);

    const now = new Date().toISOString();
    const user: User = {
      id: generateId(),
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      age: body.age,
      gender: body.gender,
      bloodPressure: body.bloodPressure,
      cholesterol: body.cholesterol,
      glucose: body.glucose,
      smoker: body.smoker,
      physicalActivity: body.physicalActivity,
      bmi: body.bmi,
      family_history: body.family_history,
      alcohol_consumption: body.alcohol_consumption,
      stress_level: body.stress_level,
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
