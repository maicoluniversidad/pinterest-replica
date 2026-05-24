"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  // 📦 Estados actualizados para tu réplica de Pinterest
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(""); // Nuevo campo
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 🚀 1. Registrar al usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage("❌ Error: " + authError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;

    if (userId) {
      // 📘 2. Insertar en tu nueva tabla 'perfiles'
      const { error: insertError } = await supabase
        .from("perfiles") // Nombre de tu nueva tabla
        .insert([
          {
            id: userId,
            correo: email,
            fecha_de_nacimiento: fechaNacimiento, // El campo que definimos antes
          },
        ]);

      if (insertError) {
        setMessage("⚠️ Auth OK, pero error en perfil: " + insertError.message);
      } else {
        setMessage("✅ ¡Cuenta creada! Revisa tu correo para confirmar.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-xl bg-white">
      <h1 className="text-2xl font-bold mb-2 text-center">Te damos la bienvenida a Pinterest</h1>
      <p className="text-gray-600 text-center mb-6">Encuentra nuevas ideas para intentar</p>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        {/* Email */}
        <label className="text-sm font-semibold">Correo electrónico</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
        />

        {/* Password */}
        <label className="text-sm font-semibold">Contraseña</label>
        <input
          type="password"
          placeholder="Crea una contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
        />

        {/* Fecha de Nacimiento */}
        <label className="text-sm font-semibold">Fecha de nacimiento</label>
        <input
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          required
          className="border p-2 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
        />

        <button 
          type="submit" 
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-2 transition-colors"
        >
          {loading ? "Cargando..." : "Continuar"}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-sm ${message.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}