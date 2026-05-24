import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#e60023', fontSize: '3rem', marginBottom: '1rem' }}>
        Bienvenido a tu Réplica de Pinterest
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
        La plataforma para explorar y guardar ideas visuales.
      </p>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href="/register">
          <button style={{
            backgroundColor: '#e60023',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Ir al Registro
          </button>
        </Link>
        
        {/* Aquí podrías poner un botón para Login más adelante */}
        <button style={{
          backgroundColor: '#efefef',
          color: 'black',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Explorar
        </button>
      </div>

      <div style={{ marginTop: '50px', color: '#888', fontSize: '0.9rem' }}>
        Tu base de datos y autenticación con Supabase están listas. 🚀
      </div>
    </div>
  );
}