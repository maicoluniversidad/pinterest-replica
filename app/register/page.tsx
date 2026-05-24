"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fecha, setFecha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setCargando(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { birth_date: fecha } }
    });

    if (error) {
      setErrorMsg(error.message);
      setCargando(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={s.container}>
      {/* Estilos embebidos para evitar errores de carga de archivos .css */}
      <style>{`
        input::-webkit-calendar-picker-indicator { cursor: pointer; }
      `}</style>
      
      <div style={s.card}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" 
          style={s.logo} 
          alt="Logo" 
        />
        
        <div style={s.navButtonGroup}>
          <Link href="/login" style={{...s.navBtn, ...s.inactiveGray}}>
            Iniciar sesión
          </Link>
          <div style={{...s.navBtn, ...s.btnGrayBorderBlue}}>
            Registrarse
          </div>
        </div>

        <h1 style={s.title}>Te damos la bienvenida</h1>
        <p style={s.subtitle}>Encuentra nuevas ideas para intentar</p>

        <form onSubmit={handleRegister} style={s.form}>
          <label style={s.label}>Correo electrónico</label>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={s.input}
            required 
          />

          <label style={s.label}>Contraseña</label>
          <input 
            type="password" 
            placeholder="Crea una contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={s.input}
            required 
          />

          <label style={s.label}>Fecha de nacimiento</label>
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={s.input}
            required 
          />

          {errorMsg && <p style={s.errorText}>⚠️ {errorMsg}</p>}

          <button type="submit" disabled={cargando} style={s.submitBtn}>
            {cargando ? "Registrando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// OBJETO DE ESTILOS PARA CONTROL TOTAL
const s: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: '-apple-system, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '32px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  logo: {
    width: '40px', // ESTO EVITA QUE SE VEA GIGANTE
    height: '40px',
    marginBottom: '20px',
  },
  navButtonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  navBtn: {
    padding: '10px 16px',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  inactiveGray: {
    backgroundColor: 'transparent',
    color: '#111',
  },
  btnGrayBorderBlue: {
    backgroundColor: '#efefef',
    color: '#111',
    border: '2px solid #0076d3', // BORDE AZUL DE TU IMAGEN
  },
  title: { fontSize: '28px', fontWeight: '700', margin: '10px 0', color: '#111' },
  subtitle: { fontSize: '16px', marginBottom: '25px', color: '#555' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' },
  label: { fontSize: '14px', fontWeight: '600', marginLeft: '5px' },
  input: {
    padding: '12px 16px',
    borderRadius: '16px',
    border: '2px solid #cdcdcd',
    fontSize: '16px',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: '#e60023',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorText: { color: '#e60023', fontSize: '13px', fontWeight: 'bold' }
};