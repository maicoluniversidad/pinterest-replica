"use client";
import Link from "next/link";
import styles from "./login/login.module.css"; // Reutilizamos los estilos

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" 
          alt="Logo" 
          className={styles.logo} 
        />
        <h1 className={styles.title}>Te damos la bienvenida a Pinterest</h1>
        <p className={styles.subtitle}>Explora nuevas ideas y guarda lo que te guste</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <Link href="/login" className={styles.submitBtn} style={{ textDecoration: 'none' }}>
            Ir a Iniciar sesión
          </Link>
          <Link href="/register" className={styles.navBtn} style={{ textDecoration: 'none', backgroundColor: '#efefef', color: '#111', textAlign: 'center', padding: '14px' }}>
            Crear cuenta nueva
          </Link>
        </div>
      </div>
    </div>
  );
}