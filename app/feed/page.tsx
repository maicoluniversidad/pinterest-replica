"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./feed.module.css";
import RootLayout from "../layout";

export default function FeedPage() {
  const [pines, setPines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAllPins = async () => {
      try {
        setLoading(true);
        
        // Traemos todos los pines de la base de datos sin filtros
        const { data, error } = await supabase
          .from("pins")
          .select("*")
          .order("created_at", { ascending: false }); // Los más nuevos primero

        if (error) throw error;
        setPines(data || []);
      } catch (error: any) {
        console.error("Error cargando el feed:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPins();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Buscando ideas nuevas para ti...</p>
      </div>
    );
  }

  return (
    <div className={styles.feedWrapper}>
      {/* Barra de navegación superior fija (Opcional, estilo Pinterest) */}
      <header className={styles.feedHeader}>
        <div className={styles.logo} onClick={() => router.refresh()}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" alt="Pinterest" onClick={() =>  router.push("/dashboard")}/>
        </div>
        <button className={styles.btnNavActive}>Inicio</button>
        <button className={styles.btnNav} onClick={() => router.push("/mvp")}>Crear Pin ➕</button>
        <div className={styles.searchBarPlaceholder}>
          🔍 Buscar ideas...
        </div>
      </header>

      {/* 🥞 CUADRÍCULA ESTILO MASONRY / DESORGANIZADA */}
      <main className={styles.masonryGrid}>
        {pines.map((pin) => (
          <div key={pin.id} className={styles.pinCard}>
            <div className={styles.imageWrapper}>
              <img 
                src={pin.image_url} 
                alt={pin.title} 
                className={styles.pinImage}
                onError={(e) => {
                  // Si una imagen falla por caché o URL vieja, renderiza el marcador gris limpio
                  (e.target as HTMLImageElement).src = "https://s.pinimg.com/webapp/board-creation-empty-state-2804561d.png";
                }}
              />
              {/* Capa de hover roja estilo Pinterest */}
              <div className={styles.pinOverlay}>
                <button className={styles.btnSave}>Guardar</button>
              </div>
            </div>
            <h4 className={styles.pinTitle}>{pin.title || "Sin título"}</h4>
            <p className={styles.pinAuthor}>{pin.user_email?.split("@")[0] || "Usuario"}</p>
          </div>
        ))}
      </main>

      {pines.length === 0 && (
        <div className={styles.emptyFeed}>
          <p>Aún no hay pines creados en la comunidad. ¡Sé el primero en subir uno!</p>
          <button onClick={() => router.push("/mvp")}>Crear Pin</button>
        </div>
      )}
    </div>
  );
}