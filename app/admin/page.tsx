"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

// 🛡️ LISTA BLANCA DE ADMINISTRADORES
const ADMIN_EMAILS = [
  "sdiazfdez@outlook.com",
  "socio@admin.com"
];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"usuarios" | "pines">("usuarios");
  
  // Estados para almacenar la información de Supabase
  const [pines, setPines] = useState<any[]>([]);
  const [usuariosActivos, setUsuariosActivos] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  
  const router = useRouter();

  // 1. Verificación de credenciales de Administrador
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user: activeUser } } = await supabase.auth.getUser();
      
      if (!activeUser) {
        router.push("/login");
        return;
      }

      // Validar si el correo está en la lista blanca
      if (!activeUser.email || !ADMIN_EMAILS.includes(activeUser.email)) {
        router.push("/dashboard"); // Ajustado a tu ruta base si /dashboard cambia por /mvp
        return;
      }

      setUser(activeUser);
      setLoading(false);
      
      // Cargar los datos iniciales una vez verificado el admin
      fetchDatosRealtime();
    };

    checkAdmin();
  }, [router]);

  // 2. Función unificada para consultar la tabla de Supabase
  const fetchDatosRealtime = async () => {
    setLoadingData(true);
    try {
      // Hacemos el SELECT a la tabla de pines
      const { data, error } = await supabase
        .from("pins") // Asegúrate de que coincida con el nombre de tu tabla SQL
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const listaPines = data || [];
      setPines(listaPines);

      // Truco MVP: Extraer correos únicos de los pines para simular la lista de usuarios activos
      const correosUnicos = Array.from(new Set(listaPines.map(p => p.user_email).filter(Boolean)));
      const mapeoUsuarios = correosUnicos.map((email, index) => ({
        id: index + 1,
        email: email,
        pinesContados: listaPines.filter(p => p.user_email === email).length
      }));
      setUsuariosActivos(mapeoUsuarios);

    } catch (err: any) {
      console.error("Error cargando datos en panel admin:", err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // 3. Función para borrar un pin de la base de datos
  const handleEliminarPin = async (pinId: string) => {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este Pin definitivamente?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("pins")
        .delete()
        .eq("id", pinId);

      if (error) throw error;

      alert("Pin eliminado con éxito del sistema. 🚨");
      // Recargar datos para actualizar la interfaz
      fetchDatosRealtime();
    } catch (err: any) {
      alert("Error al intentar eliminar: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Verificando credenciales de administrador...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      {/* Sidebar Izquierdo del Admin */}
      <aside className={styles.sidebar}>
        <div className={styles.logoSection} onClick={() => router.push("/mvp")}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" alt="Pinterest" />
          <span className={styles.badgeAdmin}>Admin</span>
        </div>

        <nav className={styles.menuNav}>
          <button 
            className={activeTab === "usuarios" ? styles.menuBtnActive : styles.menuBtn}
            onClick={() => setActiveTab("usuarios")}
          >
            👥 Usuarios ({usuariosActivos.length})
          </button>
          <button 
            className={activeTab === "pines" ? styles.menuBtnActive : styles.menuBtn}
            onClick={() => setActiveTab("pines")}
          >
            🚨 Moderar Pines ({pines.length})
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.btnExit} onClick={() => router.push("/dashboard")}>Volver a la App</button>
          <button className={styles.btnLogout} onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </aside>

      {/* Contenido Principal del Panel */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <h2>Panel de Control General</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={fetchDatosRealtime} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #ccc", cursor: "pointer", background: "#fff" }}>
              🔄 Sincronizar Supabase
            </button>
            <div className={styles.adminInfo}>
              <span>Conectado como: <strong>{user?.email}</strong></span>
            </div>
          </div>
        </header>

        {/* 🔄 RENDERIZADO CONDICIONAL DE SECCIONES */}
        <section className={styles.panelCard}>
          {loadingData ? (
            <div style={{ padding: "40px", textAlign: "center", color: "gray" }}>
              <p>⏳ Consultando tablas en vivo de Supabase...</p>
            </div>
          ) : activeTab === "usuarios" ? (
            <div>
              <div className={styles.sectionHeader}>
                <h3>Gestión y Control de Usuarios Activos</h3>
                <p>Lista de cuentas que han interactuado o creado contenido en el sistema.</p>
              </div>
              
              {/* TABLA DE USUARIOS REALES */}
              <div style={{ overflowX: "auto", marginTop: "20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #efefef", color: "#666" }}>
                      <th style={{ padding: "12px" }}>#</th>
                      <th style={{ padding: "12px" }}>Email del Usuario</th>
                      <th style={{ padding: "12px" }}>Pines Publicados</th>
                      <th style={{ padding: "12px" }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosActivos.map((usr, index) => (
                      <tr key={usr.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                        <td style={{ padding: "12px", fontWeight: "bold" }}>{index + 1}</td>
                        <td style={{ padding: "12px", color: "#111" }}>{usr.email}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: "#e1f5fe", color: "#0288d1", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                            {usr.pinesContados} posts
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ color: "#2e7d32", fontWeight: "600", fontSize: "14px" }}>● Activo</span>
                        </td>
                      </tr>
                    ))}
                    {usuariosActivos.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "gray" }}>
                          No hay usuarios registrados con publicaciones aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.sectionHeader}>
                <h3>Cola de Moderación de Contenido (Pines en vivo)</h3>
                <p>Monitorea las imágenes subidas al storage y remueve elementos inapropiados al instante.</p>
              </div>

              {/* CUADRÍCULA DE PINES REALES */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
                gap: "20px", 
                marginTop: "25px" 
              }}>
                {pines.map((pin) => (
                  <div key={pin.id} style={{ 
                    border: "1px solid #e0e0e0", 
                    borderRadius: "16px", 
                    padding: "12px", 
                    background: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "between"
                  }}>
                    <img 
                      src={pin.image_url} 
                      alt={pin.title} 
                      style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px" }} 
                    />
                    <div style={{ marginTop: "10px", flexGrow: 1 }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#111", margin: "0 0 4px 0" }}>
                        {pin.title || "Sin título"}
                      </h4>
                      <p style={{ fontSize: "12px", color: "#767676", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Subido por: {pin.user_email || "Anónimo"}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleEliminarPin(pin.id)}
                      style={{ 
                        marginTop: "12px",
                        background: "#e60023", 
                        color: "white", 
                        border: "none", 
                        padding: "8px 0", 
                        borderRadius: "20px", 
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "100%"
                      }}
                    >
                      🗑️ Eliminar Pin
                    </button>
                  </div>
                ))}
                {pines.length === 0 && (
                  <p style={{ color: "gray", gridColumn: "1/-1", textAlign: "center", padding: "4px" }}>
                    No hay pines almacenados en la base de datos actualmente.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}