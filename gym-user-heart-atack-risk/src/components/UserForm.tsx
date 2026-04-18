"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { UserFormData } from "@/types/user";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface UserFormProps {
  onSuccess: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    age: 30,
    gender: "M",
    bloodPressure: 120,
    cholesterol: 200,
    glucose: 100,
    smoker: false,
    physicalActivity: 0,
    bmi: 25,
    family_history: false,
    alcohol_consumption: 0,
    stress_level: 5,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const fieldValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : fieldValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/users", formData);
      if (response.status === 201) {
        alert("Usuário adicionado com sucesso!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          age: 30,
          gender: "M",
          bloodPressure: 120,
          cholesterol: 200,
          glucose: 100,
          smoker: false,
          physicalActivity: 0,
          bmi: 25,
          family_history: false,
          alcohol_consumption: 0,
          stress_level: 5,
        });
        setShowForm(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      alert("Erro ao adicionar usuário. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-6"
      >
        + Adicionar Novo Usuário
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Novo Usuário</h2>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 font-semibold"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção de Dados Pessoais */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="joao@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(11) 98765-4321"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gênero *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade (anos) *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IMC (Índice de Massa Corporal) *
              </label>
              <input
                type="number"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                required
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Seção de Dados Clínicos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Dados Clínicos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pressão Arterial (Sistólica) *
              </label>
              <input
                type="number"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colesterol Total (mg/dL) *
              </label>
              <input
                type="number"
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Glicose (mg/dL) *
              </label>
              <input
                type="number"
                name="glucose"
                value={formData.glucose}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="smoker"
                checked={formData.smoker}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Fumante?
              </label>
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="family_history"
                checked={formData.family_history}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Histórico Familiar de Infarto?
              </label>
            </div>
          </div>
        </div>

        {/* Seção de Estilo de Vida */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Estilo de Vida
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Atividade Física (horas/semana) *
              </label>
              <input
                type="number"
                name="physicalActivity"
                value={formData.physicalActivity}
                onChange={handleChange}
                required
                step="0.5"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumo de Álcool (unidades/semana) *
              </label>
              <input
                type="number"
                name="alcohol_consumption"
                value={formData.alcohol_consumption}
                onChange={handleChange}
                required
                step="0.5"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Estresse (1-10) *
              </label>
              <input
                type="number"
                name="stress_level"
                value={formData.stress_level}
                onChange={handleChange}
                required
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Salvando..." : "Salvar Usuário"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
