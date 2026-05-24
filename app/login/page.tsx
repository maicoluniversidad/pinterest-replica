"use client";
import { useState, useEffect } from "react"; // Añadimos useEffect
import { supabase } from "@/lib/supabaseClient";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  // ESTO FUERZA EL FORMULARIO VACÍO AL CARGAR
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setCargando(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Correo o contraseña incorrectos.");
      setCargando(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" 
          className={styles.logo} 
          alt="Logo" 
        />
        
        {/* BOTONES DE NAVEGACIÓN SUPERIOR */}
        <div className={styles.navButtonGroup}>
          <div className={`${styles.navBtn} ${styles.btnRed}`}>
            Iniciar sesión
          </div>
          <Link href="/register" className={`${styles.navBtn} ${styles.btnGrayBorderBlue}`} style={{ textDecoration: 'none' }}>
            Registrarse
          </Link>
        </div>

        <h1 className={styles.title}>Te damos la bienvenida</h1>
        <p className={styles.subtitle}>Encuentra nuevas ideas para intentar</p>

        <form onSubmit={handleLogin} className={styles.form} autoComplete="new-password">
          <label className={styles.label}>Correo electrónico</label>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} // Esto asegura que React mande sobre el input
            onChange={(e) => setEmail(e.target.value)}
            className={`${styles.input} ${errorMsg ? styles.inputError : ""}`}
            autoComplete="off"
            required 
          />

          <label className={styles.label}>Contraseña</label>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            autoComplete="new-password"
            required 
          />

          {errorMsg && <p className={styles.errorText}>⚠️ {errorMsg}</p>}

          <button type="submit" disabled={cargando} className={styles.submitBtn}>
            {cargando ? "Cargando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}