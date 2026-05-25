"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { error } from "console";

export default function CrearPinPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  // Función para previsualizar la imagen antes de subirla
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Crea una URL temporal para ver la foto
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Por favor, ingresa un título.");
      return;
    }

    setLoading(true);

    try {
      // 1. Obtener el usuario activo
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión de usuario activa.");

      let finalImageUrl = "";

      // 2. Intentar subir el archivo si existe
      if (file) {
        // En tu formulario de creación, cambia esto:
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = fileName; // 👈 Directo en la raíz, sin carpetas con el ID del usuario

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("image")
          .upload(filePath, file);

        if (!uploadError) {
          // 2. La línea donde se extrae la URL pública de la imagen:
          const { data: { publicUrl } } = supabase.storage
            .from("image")
            .getPublicUrl(filePath);
          finalImageUrl = publicUrl;
          console.log("error")
        } else {
          console.warn("Fallo en Storage, aplicando imagen por defecto:", uploadError.message);
        }
      }

      // 🚀 PLAN B: Si no hay archivo o la subida falló, asignamos un marcador de posición de Pinterest
      if (!finalImageUrl) {
        finalImageUrl = "https://s.pinimg.com/webapp/board-creation-empty-state-2804561d.png";
      }

      // 3. Insertar en la tabla de la base de datos
      const { error: insertError } = await supabase
        .from("pins")
        .insert([
          {
            title: title,
            image_url: finalImageUrl,
            user_id: user.id,
            user_email: user.email
          }
        ]);

      if (insertError) throw insertError;

      alert("¡Pin creado con éxito! 🚀");
      router.push("/mvp");

    } catch (error: any) {
      console.error("Error definitivo al crear el Pin:", error.message);
      alert(`Error de base de datos (RLS): ${error.message}\n\n👉 Pídele a tu socio que habilite los permisos de INSERT o desactive el RLS en la tabla.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
        Crear un nuevo Pin
      </h2>

      <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Input de Título */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "600" }}>Título</label>
          <input
            type="text"
            placeholder="Añade un título descriptivo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", outline: "none" }}
          />
        </div>

        {/* Input de Archivo / Imagen */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "600" }}>Seleccionar Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ fontSize: "16px" }}
          />
        </div>

        {/* Previsualización de la Imagen */}
        {previewUrl && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p style={{ fontSize: "14px", color: "gray", marginBottom: "8px" }}>Vista previa:</p>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "250px", borderRadius: "12px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#e60023",
            color: "white",
            padding: "14px",
            borderRadius: "24px",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "10px"
          }}
        >
          {loading ? "Subiendo Pin..." : "Publicar Pin"}
        </button>
      </form>
    </div>
  );
}