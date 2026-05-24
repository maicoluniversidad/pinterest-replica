"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css"; 

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: activeUser } } = await supabase.auth.getUser();
      if (!activeUser) {
        router.push("/login");
      } else {
        setUser(activeUser);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  const nombreLimpio = user.email.split('@')[0];
  const inicial = nombreLimpio[0].toUpperCase();

  return (
    <div className={styles.mainWrapper}>
      {/* Sidebar Izquierda */}
      <aside className={styles.sidebar}>
        <div className={styles.logoItem}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" alt="P" />
        </div>
        <div className={styles.sideIcons}>
          <div className={styles.activeIcon}>🏠</div>
          <div className={styles.icon}>🧭</div>
          <div className={styles.icon}>➕</div>
          <div className={styles.icon}>🔔</div>
          <div className={styles.icon}>💬</div>
        </div>
        <div className={styles.bottomIcon} onClick={handleLogout}>🚪</div>
      </aside>

      {/* Contenido Principal */}
      <div className={styles.contentArea}>
        <header className={styles.topNav}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Buscar tus Pines" className={styles.searchInput} />
          </div>
          <button onClick={handleLogout} className={styles.btnLogout}>Cerrar sesión</button>
          <div className={styles.navUserAvatar}>{inicial}</div>
        </header>

        <div className={styles.profileSection}>
          <div className={styles.profileHeaderLayout}>
            <div className={styles.titleColumn}>
              <h1 className={styles.mainTitle}>Tus ideas guardadas</h1>
              <nav className={styles.tabNav}>
                <span>Pines</span>
                <span className={styles.activeTab}>Tableros</span>
                <span>Collages</span>
              </nav>
            </div>

            <div className={styles.userCard}>
              <div className={styles.avatarBig}>{inicial}</div>
              <div className={styles.userText}>
                <h2 className={styles.userNameText}>{nombreLimpio}</h2>
                <p className={styles.following}>Siguiendo a 0</p>
              </div>
              <button className={styles.btnGray}>Compartir perfil</button>
            </div>
          </div>

          <div className={styles.controlsRow}>
            <div className={styles.filterGroup}>🕶️ <span className={styles.badge}>Grupo</span></div>
            <button className={styles.btnCreate}>Crear</button>
          </div>

          <div className={styles.emptyState}>
            <img src="https://s.pinimg.com/webapp/board-creation-empty-state-2804561d.png" alt="board" className={styles.emptyImg} />
            <h3>Organiza tus ideas</h3>
            <p>Los Pines son chispas de inspiración, y los tableros son donde viven.</p>
            <button className={styles.btnRedAction}>Crear un tablero</button>
          </div>
        </div>
      </div>
    </div>
  );
}